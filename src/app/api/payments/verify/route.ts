import { z } from "zod";
import { markOrderPaid } from "@/lib/orders.server";
import { verifyPaymentSignature } from "@/lib/razorpay.server";
import { currentUser } from "@/lib/session";

const body = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/** Called by the checkout page after Razorpay reports success. */
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ verified: false, error: "Please log in again." }, { status: 401 });

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ verified: false, error: "Missing payment details" }, { status: 400 });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  try {
    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return Response.json({ verified: false, error: "Payment signature mismatch" }, { status: 400 });
    }
  } catch (e) {
    console.error("[razorpay] verify failed", e);
    return Response.json({ verified: false, error: "Payment verification is not configured" }, { status: 500 });
  }

  const orderId = await markOrderPaid(razorpay_order_id, razorpay_payment_id);
  if (!orderId) return Response.json({ verified: false, error: "Order not found" }, { status: 404 });
  return Response.json({ verified: true, orderId });
}
