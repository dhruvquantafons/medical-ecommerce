import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";

let client: Razorpay | undefined;

export function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local");
  }
  client ??= new Razorpay({ key_id, key_secret });
  return client;
}

function hmacMatches(payload: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Verifies the signature Razorpay Checkout returns after a successful payment. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not set");
  return hmacMatches(`${orderId}|${paymentId}`, signature, secret);
}

/** Verifies the X-Razorpay-Signature header of a webhook against the raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not set");
  return hmacMatches(rawBody, signature, secret);
}

/** Pulls a readable message out of Razorpay SDK errors ({ statusCode, error: { description } }). */
export function razorpayErrorMessage(e: unknown) {
  if (e && typeof e === "object") {
    const err = e as { error?: { description?: string }; message?: string };
    return err.error?.description ?? err.message ?? "Payment gateway error";
  }
  return "Payment gateway error";
}
