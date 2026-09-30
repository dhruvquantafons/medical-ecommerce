import type { CartItem } from "@/data/types";
import { getProductById } from "@/lib/catalog";
import { computeBill, resolveLines } from "@/lib/pricing";
import { getRazorpay, razorpayErrorMessage } from "@/lib/razorpay.server";

const MAX_LINES = 50;
const MAX_QTY = 10;

function parseItems(input: unknown): CartItem[] | string {
  if (!Array.isArray(input) || input.length === 0) return "Cart is empty";
  if (input.length > MAX_LINES) return "Too many items in cart";
  const items: CartItem[] = [];
  for (const raw of input) {
    const { productId, qty } = (raw ?? {}) as Partial<CartItem>;
    const product = typeof productId === "string" ? getProductById(productId) : undefined;
    if (!product) return "Cart contains an unknown product";
    if (!product.inStock) return `${product.name} is out of stock`;
    if (!Number.isInteger(qty) || qty! < 1 || qty! > MAX_QTY) return `Invalid quantity for ${product.name}`;
    items.push({ productId: product.id, qty: qty! });
  }
  return items;
}

// The amount is always recomputed here from the catalogue; the client only sends item ids and quantities.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const items = parseItems(body?.items);
  if (typeof items === "string") return Response.json({ error: items }, { status: 400 });

  const couponCode = typeof body?.couponCode === "string" ? body.couponCode : undefined;
  const bill = computeBill(resolveLines(items), couponCode);
  const amount = Math.round(bill.total * 100); // paise
  if (amount < 100) return Response.json({ error: "Order total must be at least ₹1" }, { status: 400 });

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `mq_${Date.now().toString(36)}`,
      notes: { app: "mediquanta", items: String(bill.itemCount), coupon: bill.couponDiscount > 0 ? bill.coupon!.code : "" },
    });
    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("[razorpay] create order failed", e);
    return Response.json({ error: razorpayErrorMessage(e) }, { status: 502 });
  }
}
