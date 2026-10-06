import "server-only";
import { and, asc, desc, eq, gte, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { addresses, orderItems, orderPrescriptions, orders, prescriptions, products } from "@/db/schema";
import type { OrderDetail, PaymentMethod } from "@/data/types";
import { toAddress } from "./account.server";
import { CheckoutError, priceCart } from "./checkout.server";
import { trackingUrl } from "./shiprocket.server";
import type { CartLine } from "./pricing";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const rupees = (paise: number) => paise / 100;
const paise = (r: number) => Math.round(r * 100);

export function newOrderId() {
  return `SH${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

export interface CheckoutRequest {
  cart: unknown;
  addressId: string;
  prescriptionIds: string[];
}

/** Validates and prices an order for `userId` without writing anything. Throws CheckoutError. */
export async function prepareOrder(userId: string, req: CheckoutRequest) {
  const { lines, bill, totalPaise } = await priceCart(req.cart);
  const hasRx = lines.some((l) => l.product.rxRequired);

  const [address] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, req.addressId), eq(addresses.userId, userId)))
    .limit(1);
  if (!address) throw new CheckoutError("Please choose a delivery address.");

  const rxIds = hasRx ? [...new Set(req.prescriptionIds)] : [];
  if (hasRx && !rxIds.length) throw new CheckoutError("Please attach a prescription for the Rx medicines in your cart.");
  if (rxIds.length) {
    const owned = await db
      .select({ id: prescriptions.id })
      .from(prescriptions)
      .where(and(inArray(prescriptions.id, rxIds), eq(prescriptions.userId, userId)));
    if (owned.length !== rxIds.length) throw new CheckoutError("One of the selected prescriptions could not be found.");
  }

  const { name, phone, line1, line2, city, state, pincode, label } = toAddress(address);
  return { userId, lines, bill, totalPaise, hasRx, rxIds, address: { name, phone, line1, line2, city, state, pincode, label } };
}
export type PreparedOrder = Awaited<ReturnType<typeof prepareOrder>>;

/**
 * Deducts stock for an order's lines. `strict` (COD) fails if anything is short; otherwise (already paid
 * online) stock is floored at zero and the shortfall is left for the admin to resolve.
 */
async function deductStock(tx: Tx, lines: { productId: string; qty: number; name: string }[], strict: boolean) {
  for (const l of lines) {
    if (strict) {
      const updated = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${l.qty}` })
        .where(and(eq(products.id, l.productId), gte(products.stock, l.qty)))
        .returning({ id: products.id });
      if (!updated.length) throw new CheckoutError(`Sorry, ${l.name} just went out of stock.`);
    } else {
      await tx
        .update(products)
        .set({ stock: sql`greatest(${products.stock} - ${l.qty}, 0)` })
        .where(eq(products.id, l.productId));
    }
  }
}

const lineRows = (lines: CartLine[]) => lines.map((l) => ({ productId: l.product.id, qty: l.qty, name: l.product.name }));

/** Writes a prepared order. COD orders deduct stock immediately; online orders wait for payment. */
export async function insertOrder(prepared: PreparedOrder, payment: { method: PaymentMethod; razorpayOrderId?: string }, id = newOrderId()) {
  const { bill, lines } = prepared;
  const cod = payment.method === "cod";
  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id,
      userId: prepared.userId,
      paymentMethod: payment.method,
      paymentStatus: cod ? "cod" : "pending",
      rxStatus: prepared.hasRx ? "pending" : "not_required",
      razorpayOrderId: payment.razorpayOrderId,
      couponCode: bill.couponDiscount > 0 ? bill.coupon?.code : null,
      itemCount: bill.itemCount,
      mrpTotalPaise: paise(bill.mrpTotal),
      subtotalPaise: paise(bill.subtotal),
      couponDiscountPaise: paise(bill.couponDiscount),
      deliveryFeePaise: paise(bill.deliveryFee),
      totalPaise: prepared.totalPaise,
      address: prepared.address,
      stockDeducted: cod,
    });
    await tx.insert(orderItems).values(
      lines.map((l) => ({
        orderId: id,
        productId: l.product.id,
        name: l.product.name,
        packSize: l.product.packSize,
        rxRequired: l.product.rxRequired,
        qty: l.qty,
        pricePaise: paise(l.product.price),
        mrpPaise: paise(l.product.mrp),
      })),
    );
    if (prepared.rxIds.length) {
      await tx.insert(orderPrescriptions).values(prepared.rxIds.map((prescriptionId) => ({ orderId: id, prescriptionId })));
    }
    if (cod) await deductStock(tx, lineRows(lines), true);
  });
  return id;
}

/**
 * Marks an online order paid and deducts its stock. Idempotent: safe to call from both the checkout
 * callback and the Razorpay webhook. Returns the order id, or null if no such Razorpay order exists.
 */
export async function markOrderPaid(razorpayOrderId: string, razorpayPaymentId: string) {
  return db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.razorpayOrderId, razorpayOrderId)).for("update");
    if (!order) return null;
    if (order.paymentStatus !== "paid") {
      await tx
        .update(orders)
        .set({ paymentStatus: "paid", razorpayPaymentId, paidAt: new Date() })
        .where(eq(orders.id, order.id));
    }
    if (!order.stockDeducted) {
      const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      await deductStock(tx, items, false);
      await tx.update(orders).set({ stockDeducted: true }).where(eq(orders.id, order.id));
    }
    return order.id;
  });
}

/** Records a failed attempt. A later successful retry on the same Razorpay order still marks it paid. */
export async function markPaymentFailed(razorpayOrderId: string) {
  await db
    .update(orders)
    .set({ paymentStatus: "failed" })
    .where(and(eq(orders.razorpayOrderId, razorpayOrderId), eq(orders.paymentStatus, "pending")));
}

// ---- Reading orders

/** Orders a customer should see: COD, or online orders that were actually paid. */
const visibleToCustomer = or(eq(orders.paymentMethod, "cod"), eq(orders.paymentStatus, "paid"));

export async function listUserOrders(userId: string) {
  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, userId), visibleToCustomer))
    .orderBy(desc(orders.createdAt));
  if (!rows.length) return [];
  const items = await db
    .select({ orderId: orderItems.orderId, name: orderItems.name })
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.id)))
    .orderBy(asc(orderItems.id));
  return rows.map((o) => ({
    id: o.id,
    status: o.status,
    paymentMethod: o.paymentMethod,
    rxStatus: o.rxStatus,
    total: rupees(o.totalPaise),
    itemCount: o.itemCount,
    createdAt: o.createdAt.toISOString(),
    itemNames: items.filter((i) => i.orderId === o.id).map((i) => i.name),
  }));
}
export type OrderSummary = Awaited<ReturnType<typeof listUserOrders>>[number];

/** Full order details. Pass `userId` to restrict to that customer's own (visible) orders. */
export async function getOrderDetail(id: string, userId?: string): Promise<OrderDetail | null> {
  const where = userId ? and(eq(orders.id, id), eq(orders.userId, userId), visibleToCustomer) : eq(orders.id, id);
  const [o] = await db.select().from(orders).where(where).limit(1);
  if (!o) return null;

  const [items, rx] = await Promise.all([
    db
      .select({ item: orderItems, slug: products.slug })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, o.id))
      .orderBy(asc(orderItems.id)),
    db
      .select({ id: prescriptions.id, fileName: prescriptions.fileName, mimeType: prescriptions.mimeType, createdAt: prescriptions.createdAt })
      .from(orderPrescriptions)
      .innerJoin(prescriptions, eq(orderPrescriptions.prescriptionId, prescriptions.id))
      .where(eq(orderPrescriptions.orderId, o.id)),
  ]);

  return {
    id: o.id,
    userId: o.userId,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    rxStatus: o.rxStatus,
    rxNote: o.rxNote,
    razorpayOrderId: o.razorpayOrderId,
    razorpayPaymentId: o.razorpayPaymentId,
    couponCode: o.couponCode,
    itemCount: o.itemCount,
    mrpTotal: rupees(o.mrpTotalPaise),
    subtotal: rupees(o.subtotalPaise),
    couponDiscount: rupees(o.couponDiscountPaise),
    deliveryFee: rupees(o.deliveryFeePaise),
    total: rupees(o.totalPaise),
    address: o.address,
    createdAt: o.createdAt.toISOString(),
    paidAt: o.paidAt?.toISOString() ?? null,
    items: items.map(({ item, slug }) => ({
      productId: item.productId,
      slug,
      name: item.name,
      packSize: item.packSize,
      rxRequired: item.rxRequired,
      qty: item.qty,
      price: rupees(item.pricePaise),
      mrp: rupees(item.mrpPaise),
    })),
    prescriptions: rx.map((p) => ({
      id: p.id,
      name: p.fileName,
      type: p.mimeType,
      url: `/api/prescriptions/${p.id}`,
      uploadedAt: p.createdAt.toISOString(),
    })),
    shipment:
      o.shiprocketOrderId && o.shiprocketShipmentId
        ? {
            shiprocketOrderId: o.shiprocketOrderId,
            shipmentId: o.shiprocketShipmentId,
            awbCode: o.awbCode,
            courierName: o.courierName,
            trackingUrl: o.awbCode ? trackingUrl(o.awbCode) : null,
            status: o.shipmentStatus,
            updatedAt: o.shipmentUpdatedAt?.toISOString() ?? null,
            pickupRequested: o.pickupRequested,
            labelUrl: o.labelUrl,
          }
        : null,
  };
}
