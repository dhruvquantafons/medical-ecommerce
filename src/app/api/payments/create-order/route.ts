import { z } from "zod";
import { CheckoutError } from "@/lib/checkout.server";
import { insertOrder, newOrderId, prepareOrder } from "@/lib/orders.server";
import { getRazorpay, razorpayErrorMessage } from "@/lib/razorpay.server";
import { currentUser } from "@/lib/session";

const body = z.object({
  cart: z.unknown(),
  addressId: z.string().min(1),
  prescriptionIds: z.array(z.string()).max(10).default([]),
});

/**
 * Starts an online payment: validates and prices the order from the database, creates the Razorpay
 * order, and stores our order as "payment pending". /api/payments/verify (or the webhook) marks it paid.
 */
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Please log in to continue." }, { status: 401 });

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid checkout details." }, { status: 400 });

  let prepared;
  try {
    prepared = await prepareOrder(user.id, parsed.data);
  } catch (e) {
    if (e instanceof CheckoutError) return Response.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const orderId = newOrderId();
  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: prepared.totalPaise,
      currency: "INR",
      receipt: orderId,
      notes: { app: "syncytium-health", orderId, userId: user.id },
    });
  } catch (e) {
    console.error("[razorpay] create order failed", e);
    return Response.json({ error: razorpayErrorMessage(e) }, { status: 502 });
  }

  await insertOrder(prepared, { method: "online", razorpayOrderId: razorpayOrder.id }, orderId);

  return Response.json({
    orderId,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
