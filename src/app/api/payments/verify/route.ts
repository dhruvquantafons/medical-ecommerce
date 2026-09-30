import { verifyPaymentSignature } from "@/lib/razorpay.server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;
  if (typeof orderId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") {
    return Response.json({ verified: false, error: "Missing payment details" }, { status: 400 });
  }

  try {
    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      return Response.json({ verified: false, error: "Payment signature mismatch" }, { status: 400 });
    }
  } catch (e) {
    console.error("[razorpay] verify failed", e);
    return Response.json({ verified: false, error: "Payment verification is not configured" }, { status: 500 });
  }
  return Response.json({ verified: true, orderId, paymentId });
}
