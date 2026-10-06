import crypto from "node:crypto";
import { applyCourierStatus } from "@/lib/shipments.server";

// Configure in Shiprocket → Settings → API → Webhooks with URL <your-domain>/api/shipping/webhook
// and a token of your choice, saved as SHIPROCKET_WEBHOOK_TOKEN. Shiprocket sends it in the x-api-key header.
// (Shiprocket rejects webhook URLs containing "shiprocket", "kartrocket", "sr" or "kr".)
function tokenMatches(received: string) {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  if (!expected) return null;
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const ok = tokenMatches(request.headers.get("x-api-key") ?? "");
  if (ok === null) return Response.json({ error: "Webhook token not configured" }, { status: 503 });
  if (!ok) return Response.json({ error: "Invalid token" }, { status: 401 });

  const event = (await request.json().catch(() => null)) as { awb?: string | number; order_id?: string; current_status?: string; shipment_status?: string } | null;
  const status = event?.current_status ?? event?.shipment_status;
  console.info("[shiprocket] webhook", event && { awb: event.awb, order: event.order_id, status });

  if (status) {
    // order_id is our own order id (we send it as the Shiprocket channel order id).
    const updated =
      (event?.awb && (await applyCourierStatus({ awbCode: String(event.awb) }, status))) ||
      (event?.order_id && (await applyCourierStatus({ orderId: event.order_id }, status)));
    if (!updated) console.warn("[shiprocket] webhook for unknown shipment", event?.awb, event?.order_id);
  }
  // Always 200 so Shiprocket doesn't keep retrying events we can't use.
  return Response.json({ received: true });
}
