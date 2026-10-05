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
    <Link href="/cart" className="relative grid size-10 place-items-center rounded-full text-white hover:bg-white/10" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-brand-800">
          {count}
        </span>
      )}
    </Link>
  );
}
