"use client";

import { useEffect, useMemo } from "react";
import { useCart } from "@/store/cart";
import { useProductCache } from "@/store/productCache";
import { computeBill, resolveLines } from "@/lib/pricing";

export function useCartBill() {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const remove = useCart((s) => s.remove);
  const byId = useProductCache((s) => s.byId);
  const load = useProductCache((s) => s.load);

  const idsKey = items.map((i) => i.productId).join(",");
  useEffect(() => {
    if (idsKey) load(idsKey.split(","));
  }, [idsKey, load]);

  // Drop cart items whose product no longer exists or was deactivated.
  useEffect(() => {
    for (const i of items) if (byId[i.productId] === null) remove(i.productId);
  }, [items, byId, remove]);

  return useMemo(() => {
    const loading = items.some((i) => !(i.productId in byId));
    const lines = resolveLines(items, byId);
    return { lines, bill: computeBill(lines, couponCode), hasRx: lines.some((l) => l.product.rxRequired), couponCode, loading };
  }, [items, byId, couponCode]);
}
