import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products, user } from "@/db/schema";
import { ORDER_FLOW } from "./order-labels";
import * as shiprocket from "./shiprocket.server";

// Order-level Shiprocket flow: create order → assign courier (AWB) → schedule pickup.
// Each step is saved as soon as it succeeds, so a failed step (e.g. low wallet balance) can be retried.

export interface Parcel {
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
}

/** Shiprocket wants "YYYY-MM-DD HH:mm" in local (IST) time. */
const istDateTime = (d: Date) => d.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).slice(0, 16);

/** Indian mobile numbers as the 10 digits Shiprocket expects (drops +91 / leading 0). */
const tenDigitPhone = (phone: string) => phone.replace(/\D/g, "").slice(-10);

/** Runs the remaining shipping steps for an order. Returns a summary of what happened. */
export async function shipOrder(orderId: string, parcel: Parcel) {
  const [o] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!o) throw new shiprocket.ShiprocketError("Order not found");
  if (o.status === "cancelled" || o.status === "delivered") throw new shiprocket.ShiprocketError(`A ${o.status} order can't be shipped.`);
  if (o.paymentMethod === "online" && o.paymentStatus !== "paid") throw new shiprocket.ShiprocketError("This online order hasn't been paid yet.");
  if (o.rxStatus === "pending" || o.rxStatus === "rejected") throw new shiprocket.ShiprocketError("Approve the prescription before shipping this order.");

  let { shiprocketOrderId, shiprocketShipmentId, awbCode } = o;

  if (!shiprocketOrderId || !shiprocketShipmentId) {
    const [items, [customer]] = await Promise.all([
      db
        .select({ item: orderItems, slug: products.slug })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, o.id))
        .orderBy(asc(orderItems.id)),
      db.select({ email: user.email }).from(user).where(eq(user.id, o.userId)),
    ]);
    const a = o.address;
    const [firstName, ...rest] = a.name.trim().split(/\s+/);
    const created = await shiprocket.createOrder({
      order_id: o.id,
      order_date: istDateTime(o.createdAt),
      pickup_location: shiprocket.pickupLocationName(),
      billing_customer_name: firstName,
      billing_last_name: rest.join(" "),
      billing_address: a.line1,
      billing_address_2: a.line2,
      billing_city: a.city,
      billing_pincode: a.pincode,
      billing_state: a.state,
      billing_country: "India",
      billing_email: customer?.email ?? "",
      billing_phone: tenDigitPhone(a.phone),
      shipping_is_billing: true,
      order_items: items.map(({ item, slug }) => ({
        name: `${item.name} (${item.packSize})`,
        sku: slug ?? item.productId,
        units: item.qty,
        selling_price: item.pricePaise / 100,
      })),
      payment_method: o.paymentMethod === "cod" ? "COD" : "Prepaid",
      shipping_charges: o.deliveryFeePaise / 100,
      total_discount: o.couponDiscountPaise / 100,
      sub_total: o.subtotalPaise / 100,
      weight: parcel.weightKg,
      length: parcel.lengthCm,
      breadth: parcel.breadthCm,
      height: parcel.heightCm,
    });
    shiprocketOrderId = created.orderId;
    shiprocketShipmentId = created.shipmentId;
    await db.update(orders).set({ shiprocketOrderId, shiprocketShipmentId, shipmentStatus: "NEW", shipmentUpdatedAt: new Date() }).where(eq(orders.id, o.id));
  }

  if (!awbCode) {
    const assigned = await shiprocket.assignAwb(shiprocketShipmentId);
    awbCode = assigned.awbCode;
    await db
      .update(orders)
      .set({ awbCode, courierName: assigned.courierName, shipmentStatus: "AWB ASSIGNED", shipmentUpdatedAt: new Date() })
      .where(eq(orders.id, o.id));
  }

  if (!o.pickupRequested) {
    await shiprocket.requestPickup(shiprocketShipmentId);
    await db
      .update(orders)
      .set({ pickupRequested: true, shipmentStatus: "PICKUP SCHEDULED", shipmentUpdatedAt: new Date() })
      .where(eq(orders.id, o.id));
  }

  // Ready for the courier: move it along to "packed" (the courier's pickup scan later marks it shipped).
  if (ORDER_FLOW.indexOf(o.status) < ORDER_FLOW.indexOf("packed")) {
    await db.update(orders).set({ status: "packed" }).where(eq(orders.id, o.id));
  }
  return { awbCode };
}

/** Returns the shipping label PDF URL, generating it on first use. */
export async function shippingLabel(orderId: string) {
  const [o] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!o?.shiprocketShipmentId || !o.awbCode) throw new shiprocket.ShiprocketError("Assign a courier before printing the label.");
  if (o.labelUrl) return o.labelUrl;
  const labelUrl = await shiprocket.generateLabel(o.shiprocketShipmentId);
  await db.update(orders).set({ labelUrl }).where(eq(orders.id, o.id));
  return labelUrl;
}

/** Maps a courier status to our order status, or null when it shouldn't move the order. */
export function orderStatusForCourier(status: string): "shipped" | "delivered" | null {
  const s = status.toUpperCase();
  if (/RTO|UNDELIVERED|CANCEL|LOST|DAMAGED|DESTROYED/.test(s)) return null;
  if (/DELIVERED/.test(s)) return "delivered";
  if (/PICKED UP|SHIPPED|IN TRANSIT|OUT FOR DELIVERY|REACHED|DESTINATION|DELAYED|MISROUTED/.test(s)) return "shipped";
  return null;
}

/**
 * Records a courier status (from the webhook or a manual refresh) and moves the order forward to
 * shipped/delivered. Never moves an order backwards or touches cancelled orders.
 */
export async function applyCourierStatus(where: { awbCode: string } | { orderId: string }, status: string) {
  const [o] = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where("awbCode" in where ? eq(orders.awbCode, where.awbCode) : eq(orders.id, where.orderId))
    .limit(1);
  if (!o) return null;
  const next = orderStatusForCourier(status);
  const advance = next && o.status !== "cancelled" && ORDER_FLOW.indexOf(next) > ORDER_FLOW.indexOf(o.status);
  await db
    .update(orders)
    .set({ shipmentStatus: status.toUpperCase(), shipmentUpdatedAt: new Date(), ...(advance ? { status: next } : {}) })
    .where(eq(orders.id, o.id));
  return o.id;
}

/** Pulls the latest courier status for an order from Shiprocket. */
export async function refreshTracking(orderId: string) {
  const [o] = await db.select({ awbCode: orders.awbCode }).from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!o?.awbCode) throw new shiprocket.ShiprocketError("This order has no AWB yet.");
  const status = await shiprocket.trackAwb(o.awbCode);
  if (status) await applyCourierStatus({ orderId }, status);
  return status;
}

/** Cancels the order's Shiprocket order, if any. Best effort: returns an error message instead of throwing. */
export async function cancelShipment(shiprocketOrderId: string | null) {
  if (!shiprocketOrderId) return null;
  try {
    await shiprocket.cancelOrder(shiprocketOrderId);
    return null;
  } catch (e) {
    console.error("[shiprocket] cancel failed", e);
    return e instanceof Error ? e.message : "Shiprocket cancel failed";
  }
}
