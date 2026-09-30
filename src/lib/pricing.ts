import { site } from "@/config/site";
import { coupons } from "@/data/home";
import type { CartItem, Coupon, Product } from "@/data/types";

export interface CartLine {
  product: Product;
  qty: number;
}

export interface BillSummary {
  itemCount: number;
  mrpTotal: number;
  productDiscount: number;
  subtotal: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
  savings: number;
  coupon?: Coupon;
  couponError?: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Pairs cart items with their products. Items whose product is missing (deleted/inactive) are dropped. */
export function resolveLines(items: CartItem[], byId: Map<string, Product> | Record<string, Product | null | undefined>): CartLine[] {
  const lookup = (id: string) => (byId instanceof Map ? byId.get(id) : byId[id]);
  return items.flatMap((i) => {
    const product = lookup(i.productId);
    return product ? [{ product, qty: i.qty }] : [];
  });
}

export function findCoupon(code: string) {
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}

export function validateCoupon(code: string, subtotal: number): { coupon?: Coupon; error?: string } {
  const coupon = findCoupon(code);
  if (!coupon) return { error: "Invalid coupon code" };
  if (subtotal < coupon.minOrder) return { coupon, error: `Add items worth ₹${round2(coupon.minOrder - subtotal)} more to use ${coupon.code}` };
  return { coupon };
}

function couponAmount(c: Coupon, subtotal: number) {
  const raw = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
  return round2(Math.min(raw, c.maxDiscount ?? Infinity, subtotal));
}

export function computeBill(lines: CartLine[], couponCode?: string): BillSummary {
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const mrpTotal = round2(lines.reduce((n, l) => n + l.product.mrp * l.qty, 0));
  const subtotal = round2(lines.reduce((n, l) => n + l.product.price * l.qty, 0));
  const productDiscount = round2(mrpTotal - subtotal);

  let couponDiscount = 0;
  let coupon: Coupon | undefined;
  let couponError: string | undefined;
  if (couponCode) {
    const v = validateCoupon(couponCode, subtotal);
    coupon = v.coupon;
    couponError = v.error;
    if (v.coupon && !v.error) couponDiscount = couponAmount(v.coupon, subtotal);
  }

  const deliveryFee = itemCount === 0 || subtotal >= site.freeDeliveryAbove ? 0 : site.deliveryFee;
  const total = round2(subtotal - couponDiscount + deliveryFee);
  return {
    itemCount,
    mrpTotal,
    productDiscount,
    subtotal,
    couponDiscount,
    deliveryFee,
    total,
    savings: round2(productDiscount + couponDiscount),
    coupon,
    couponError,
  };
}
