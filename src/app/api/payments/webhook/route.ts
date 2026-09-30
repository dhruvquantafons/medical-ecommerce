import { markOrderPaid, markPaymentFailed } from "@/lib/orders.server";
import { verifyWebhookSignature } from "@/lib/razorpay.server";

// Configure in Razorpay Dashboard → Webhooks with URL <your-domain>/api/payments/webhook
// and events payment.captured, payment.failed, order.paid. Needs RAZORPAY_WEBHOOK_SECRET.
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  try {
    if (!verifyWebhookSignature(raw, signature)) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: { payment?: { entity?: { id: string; order_id: string; status: string; amount: number } } };
  };
  const payment = event.payload?.payment?.entity;
  console.info("[razorpay] webhook", event.event, payment && { id: payment.id, order: payment.order_id, status: payment.status });

  // Backup path for when the customer closes the tab before our success callback runs.
  if (payment?.order_id) {
    if (event.event === "payment.captured" || event.event === "order.paid") await markOrderPaid(payment.order_id, payment.id);
    else if (event.event === "payment.failed") await markPaymentFailed(payment.order_id);
  }
  return Response.json({ received: true });
}
