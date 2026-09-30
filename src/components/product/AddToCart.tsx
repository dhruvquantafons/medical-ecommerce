"use client";

import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { MAX_CART_QTY, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { useToast } from "@/components/ui/Toast";

export function QuantityStepper({
  qty,
  onChange,
  size = "sm",
}: {
  qty: number;
  onChange: (qty: number) => void;
  size?: "sm" | "lg";
}) {
  const h = size === "lg" ? "h-12" : "h-9";
  return (
    <div className={clsx("inline-flex items-center overflow-hidden rounded-lg border border-brand-600 bg-brand-50", h)}>
      <button aria-label="Decrease quantity" onClick={() => onChange(qty - 1)} className="grid h-full w-9 place-items-center text-brand-700 hover:bg-brand-100">
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-brand-800" aria-live="polite">
        {qty}
      </span>
      <button
        aria-label="Increase quantity"
        disabled={qty >= MAX_CART_QTY}
        onClick={() => onChange(qty + 1)}
        className="grid h-full w-9 place-items-center text-brand-700 hover:bg-brand-100 disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function AddToCart({
  productId,
  inStock,
  size = "sm",
  className,
}: {
  productId: string;
  inStock: boolean;
  size?: "sm" | "lg";
  className?: string;
}) {
  const hydrated = useHydrated();
  const qty = useCart((s) => s.items.find((i) => i.productId === productId)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const toast = useToast((s) => s.show);

  if (!inStock) {
    return (
      <span className={clsx("inline-flex items-center justify-center rounded-lg bg-gray-100 px-3 text-sm font-semibold text-muted", size === "lg" ? "h-12" : "h-9", className)}>
        Out of stock
      </span>
    );
  }
  if (hydrated && qty > 0) {
    return (
      <div className={className}>
        <QuantityStepper qty={qty} onChange={(n) => setQty(productId, n)} size={size} />
      </div>
    );
  }
  return (
    <button
      onClick={() => {
        add(productId);
        toast("Added to cart");
      }}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg bg-brand-600 font-semibold text-white hover:bg-brand-700",
        size === "lg" ? "h-12 px-8 text-base" : "h-9 px-5 text-sm",
        className,
      )}
    >
      Add{size === "lg" ? " to cart" : ""}
    </button>
  );
}
