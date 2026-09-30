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
    <Link href="/cart" className="relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-gray-100" aria-label={`Cart, ${count} items`}>
      <ShoppingCart className="size-5" />
      <span className="hidden md:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -top-0.5 left-5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
