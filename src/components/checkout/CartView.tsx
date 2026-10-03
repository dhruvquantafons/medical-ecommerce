"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/types";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { formatPrice } from "@/lib/format";
import { ProductRail } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/product/AddToCart";
import { RxBadge } from "@/components/product/Badges";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BillSummary } from "./BillSummary";
import { useCartBill } from "./useCartBill";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10">
      <div className="h-12 w-56 rounded-full bg-tile" />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div className="h-72 rounded-2xl bg-tile" />
        <div className="h-56 rounded-2xl bg-tile" />
      </div>
    </div>
  );
}

export function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-tile">
        <ShoppingBag className="size-9 text-brand-800" />
      </span>
      <h1 className="display mt-2 text-3xl md:text-4xl">Your cart is empty</h1>
      <p className="text-[15px] text-muted">Find the right supplement for your daily ritual.</p>
      <ButtonLink href="/shop" size="lg" className="mt-3">Shop all products</ButtonLink>
    </div>
  );
}

/** Collapsed "Have a discount code?" field. Codes aren't advertised on the site. */
function DiscountCode() {
  const couponCode = useCart((s) => s.couponCode);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const { bill } = useCartBill();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  if (couponCode) {
    return (
      <div className="flex items-center justify-between rounded-2xl bg-tile px-4 py-3 text-sm">
        <div>
          <p className="font-semibold">Code {couponCode}</p>
          {bill.couponError ? <p className="text-xs text-sale">{bill.couponError}</p> : <p className="text-xs text-save">You saved {formatPrice(bill.couponDiscount)}</p>}
        </div>
        <button onClick={() => applyCoupon(undefined)} className="text-xs font-semibold underline underline-offset-4 hover:text-sale">
          Remove
        </button>
      </div>
    );
  }
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-medium underline underline-offset-4 hover:text-brand-700">
        Have a discount code?
      </button>
    );
  }
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) applyCoupon(code);
        setCode("");
      }}
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Discount code"
        aria-label="Discount code"
        autoFocus
        className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-sm uppercase outline-none focus:border-brand-500"
      />
      <Button type="submit" variant="outline" size="md" className="h-11" disabled={!code.trim()}>
        Apply
      </Button>
    </form>
  );
}

export function CartView({ suggestions }: { suggestions: Product[] }) {
  const hydrated = useHydrated();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { lines, bill, loading } = useCartBill();

  if (!hydrated || loading) return <PageSkeleton />;
  if (!lines.length) return <EmptyCart />;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 md:px-10 pt-10 md:pt-14">
        <h1 className="display text-3xl md:text-4xl">
          Your cart <span className="text-muted">({bill.itemCount})</span>
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
          <ul className="space-y-3">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex gap-4 rounded-2xl bg-tile p-3 sm:p-4">
                <Link href={`/product/${p.slug}`} className="w-24 shrink-0 sm:w-28">
                  <ProductImage product={p} className="!bg-white" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {p.categoryName && <p className="text-xs text-muted">{p.categoryName}</p>}
                      <Link href={`/product/${p.slug}`} className="font-medium hover:underline">{p.name}</Link>
                      <p className="flex items-center gap-2 text-xs text-muted">
                        {p.packSize} {p.rxRequired && <RxBadge />}
                      </p>
                    </div>
                    <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-white hover:text-sale">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
                    <QuantityStepper qty={qty} onChange={(n) => setQty(p.id, n)} />
                    <p className="text-right">
                      <span className="font-semibold">{formatPrice(p.price * qty)}</span>
                      {p.discountPct > 0 && <span className="ml-1.5 text-sm text-muted line-through">{formatPrice(p.mrp * qty)}</span>}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <BillSummary bill={bill}>
              <div className="mb-4">
                <DiscountCode />
              </div>
              <ButtonLink href="/checkout" size="lg" className="w-full">
                Checkout · {formatPrice(bill.total)}
              </ButtonLink>
            </BillSummary>
          </div>
        </div>
      </div>
      <ProductRail title="You may also like" products={suggestions.filter((p) => !lines.some((l) => l.product.id === p.id)).slice(0, 8)} />
    </>
  );
}
