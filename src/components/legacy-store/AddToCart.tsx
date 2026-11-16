"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import clsx from "clsx";
import { MAX_CART_QTY, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { useToast } from "@/components/ui/Toast";

export function QuantityStepper({
  qty,
  onChange,
  size = "sm",
  block,
}: {
  qty: number;
  onChange: (qty: number) => void;
  size?: "sm" | "lg";
  /** Stretch to the full width of the container. */
  block?: boolean;
}) {
  const h = size === "lg" ? "h-12" : "h-9";
  return (
    <div className={clsx("items-center justify-between overflow-hidden rounded-full border border-brand-800/20 bg-white", block ? "flex w-full" : "inline-flex", h)}>
      <button aria-label="Decrease quantity" onClick={() => onChange(qty - 1)} className="grid h-full w-10 place-items-center text-brand-800 hover:bg-brand-50">
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-brand-800" aria-live="polite">
        {qty}
      </span>
      <button
        aria-label="Increase quantity"
        disabled={qty >= MAX_CART_QTY}
        onClick={() => onChange(qty + 1)}
        className="grid h-full w-10 place-items-center text-brand-800 hover:bg-brand-50 disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/**
 * Add-to-cart control. `card` is the compact button on product cards (a quantity stepper once added);
 * `icon` is a round cart button; `pill` is the full-width button with a stepper once added (product page).
 */
export function AddToCart({
  productId,
  productName,
  inStock,
  variant = "pill",
  className,
}: {
  productId: string;
  productName: string;
  inStock: boolean;
  variant?: "icon" | "pill" | "card";
  className?: string;
}) {
  const hydrated = useHydrated();
  const qty = useCart((s) => s.items.find((i) => i.productId === productId)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const toast = useToast((s) => s.show);
  const inCart = hydrated ? qty : 0;

  const addOne = () => {
    add(productId);
    toast(`${productName} added to cart`);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={addOne}
        disabled={!inStock}
        aria-label={inStock ? `Add ${productName} to cart` : `${productName} is out of stock`}
        title={inStock ? "Add to cart" : "Out of stock"}
        className={clsx(
          "relative grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-white transition hover:bg-brand-gradient-strong active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300",
          className,
        )}
      >
        <ShoppingCart className="size-4" />
        {inCart > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-brand-800 ring-2 ring-tile">
            {inCart}
          </span>
        )}
      </button>
    );
  }

  if (variant === "card") {
    if (!inStock) return <span className={clsx("inline-flex h-10 items-center rounded-full bg-gray-100 px-4 text-xs font-semibold text-muted", className)}>Out of stock</span>;
    if (inCart > 0) return <QuantityStepper qty={inCart} onChange={(n) => setQty(productId, n)} />;
    return (
      <button
        type="button"
        onClick={addOne}
        aria-label={`Add ${productName} to cart`}
        className={clsx(
          "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-gradient px-3.5 text-sm font-semibold text-white transition hover:bg-brand-gradient-strong active:scale-95 sm:px-4",
          className,
        )}
      >
        <ShoppingCart className="size-4" />
        <span>Add<span className="hidden sm:inline"> to cart</span></span>
      </button>
    );
  }

  if (!inStock) {
    return (
      <span className={clsx("inline-flex h-12 items-center justify-center rounded-full bg-gray-100 px-6 text-sm font-semibold text-muted", className)}>
        Out of stock
      </span>
    );
  }
  if (inCart > 0) {
    return (
      <div className={className}>
        <QuantityStepper qty={inCart} onChange={(n) => setQty(productId, n)} size="lg" block />
      </div>
    );
  }
  return (
    <button
      onClick={addOne}
      className={clsx("inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-8 text-base font-semibold text-white transition hover:bg-brand-gradient-strong active:scale-[0.98]", className)}
    >
      <ShoppingCart className="size-4" /> Add to cart
    </button>
  );
}
