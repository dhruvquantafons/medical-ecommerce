import "server-only";
import { z } from "zod";
import { getProductsByIds } from "./catalog";
import { computeBill, resolveLines } from "./pricing";
import { MAX_CART_QTY } from "./limits";

export const cartInput = z.object({
  items: z
    .array(z.object({ productId: z.string().min(1).max(64), qty: z.number().int().min(1).max(MAX_CART_QTY) }))
    .min(1, "Cart is empty")
    .max(50, "Too many items in cart"),
  couponCode: z.string().max(32).optional(),
});
export type CartInput = z.infer<typeof cartInput>;

export class CheckoutError extends Error {}

/**
 * Prices a cart from the database. The browser only ever sends product ids and quantities,
 * so totals can't be tampered with. Throws CheckoutError with a customer-facing message.
 */
export async function priceCart(input: unknown) {
  const parsed = cartInput.safeParse(input);
  if (!parsed.success) throw new CheckoutError(parsed.error.issues[0]?.message ?? "Invalid cart");
  const { items, couponCode } = parsed.data;

  const products = await getProductsByIds(items.map((i) => i.productId));
  const byId = new Map(products.map((p) => [p.id, p]));
  for (const i of items) {
    const p = byId.get(i.productId);
    if (!p) throw new CheckoutError("An item in your cart is no longer available. Please review your cart.");
    if (p.stock < i.qty) throw new CheckoutError(p.stock ? `Only ${p.stock} left of ${p.name}` : `${p.name} is out of stock`);
  }

  const lines = resolveLines(items, byId);
  const bill = computeBill(lines, couponCode);
  const totalPaise = Math.round(bill.total * 100);
  if (totalPaise < 100) throw new CheckoutError("Order total must be at least ₹1");
  return { lines, bill, totalPaise, couponCode };
}
