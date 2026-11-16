"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";

export function useCartCount() {
  const hydrated = useHydrated();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  return hydrated ? count : 0;
}

export function CartLink() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      className="relative grid size-11 place-items-center rounded-control text-ink hover:bg-surface"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingCart aria-hidden className="size-5" />
      {count > 0 && (
        <span aria-hidden className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-brand-foreground tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
