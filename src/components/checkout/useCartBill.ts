"use client";

import { useMemo } from "react";
import { useCart } from "@/store/cart";
import { computeBill, resolveLines } from "@/lib/pricing";

export function useCartBill() {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  return useMemo(() => {
    const lines = resolveLines(items);
    return { lines, bill: computeBill(lines, couponCode), hasRx: lines.some((l) => l.product.rxRequired), couponCode };
  }, [items, couponCode]);
}
