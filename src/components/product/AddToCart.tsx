"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import clsx from "clsx";
import { MAX_CART_QTY, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { useToast } from "@/components/ui/Toast";
import { buttonClass } from "@/components/ui/button";

export function QuantityStepper({
  qty,
  onChange,
  block,
}: {
  qty: number;
  onChange: (qty: number) => void;
  /** @deprecated Both sizes are 44px tall now (touch target). */
  size?: "sm" | "lg";
  /** Stretch to the full width of the container. */
  block?: boolean;
}) {
  const h = "h-11";
  return (
    <div className={clsx("items-center justify-between overflow-hidden rounded-control border border-line bg-background", block ? "flex w-full" : "inline-flex", h)}>
      <button aria-label="Decrease quantity" onClick={() => onChange(qty - 1)} className="grid h-full w-11 place-items-center text-ink hover:bg-surface">
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center text-[15px] font-medium text-ink tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        aria-label="Increase quantity"
        disabled={qty >= MAX_CART_QTY}
        onClick={() => onChange(qty + 1)}
        className="grid h-full w-11 place-items-center text-ink hover:bg-surface disabled:opacity-40"
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
          buttonClass("default", "icon"),
          "relative disabled:cursor-not-allowed",
          className,
        )}
      >
        <ShoppingCart className="size-4" />
        {inCart > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full border border-line bg-background px-1 text-[11px] font-semibold text-ink">
            {inCart}
          </span>
        )}
      </button>
    );
  }

  if (variant === "card") {
    if (!inStock) return <span className={clsx("inline-flex h-11 items-center rounded-control bg-surface px-4 text-sm text-ink-muted", className)}>Out of stock</span>;
    if (inCart > 0) return <QuantityStepper qty={inCart} onChange={(n) => setQty(productId, n)} />;
    return (
      <button
        type="button"
        onClick={addOne}
        aria-label={`Add ${productName} to cart`}
        className={clsx(
          buttonClass("default", "default"),
          "px-4",
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
      <span className={clsx("inline-flex h-11 items-center justify-center rounded-control bg-surface px-6 text-sm text-ink-muted", className)}>
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
      type="button"
      onClick={addOne}
      className={clsx(buttonClass("default", "lg"), "px-8", className)}
    >
      <ShoppingCart className="size-4" /> Add to cart
    </button>
  );
}
