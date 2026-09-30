"use client";

import { ShoppingCart, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { coupons } from "@/data/home";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/product/AddToCart";
import { RxBadge } from "@/components/product/Badges";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BillSummary } from "./BillSummary";
import { useCartBill } from "./useCartBill";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-6">
      <div className="h-7 w-40 rounded bg-gray-200" />
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="h-72 rounded-xl bg-gray-200" />
        <div className="h-56 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-brand-50">
        <ShoppingCart className="size-10 text-brand-600" />
      </span>
      <h1 className="text-xl font-bold">Your cart is empty</h1>
      <p className="text-sm text-muted">Search for medicines or browse categories to add items.</p>
      <ButtonLink href="/" className="mt-2">Start shopping</ButtonLink>
    </div>
  );
}

function CouponBox() {
  const couponCode = useCart((s) => s.couponCode);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const { bill } = useCartBill();
  const [code, setCode] = useState("");

  return (
    <div className="card p-5">
      <h2 className="mb-3 flex items-center gap-2 font-bold">
        <Tag className="size-4 text-accent-500" /> Apply coupon
      </h2>
      {couponCode ? (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-accent-500 bg-orange-50 px-3 py-2">
          <div>
            <p className="text-sm font-bold text-accent-600">{couponCode}</p>
            {bill.couponError ? (
              <p className="text-xs text-red-600">{bill.couponError}</p>
            ) : (
              <p className="text-xs text-save">You saved {formatPrice(bill.couponDiscount)}</p>
            )}
          </div>
          <button onClick={() => applyCoupon(undefined)} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
        </div>
      ) : (
        <>
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
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              className="h-10 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm uppercase outline-none focus:border-brand-500"
            />
            <Button type="submit" variant="outline" disabled={!code.trim()}>Apply</Button>
          </form>
          <ul className="mt-3 space-y-2">
            {coupons.map((c) => (
              <li key={c.code} className="flex items-center justify-between gap-2 text-xs">
                <span><span className="font-bold text-accent-600">{c.code}</span> · <span className="text-muted">{c.description}</span></span>
                <button onClick={() => applyCoupon(c.code)} className="shrink-0 font-semibold text-brand-700 hover:underline">Apply</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function CartView() {
  const hydrated = useHydrated();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { lines, bill } = useCartBill();

  if (!hydrated) return <PageSkeleton />;
  if (!lines.length) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold md:text-2xl">Cart ({bill.itemCount} item{bill.itemCount === 1 ? "" : "s"})</h1>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <ul className="card divide-y divide-line">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex gap-3 p-4 sm:gap-4">
                <Link href={`/product/${p.slug}`} className="w-20 shrink-0 sm:w-24">
                  <ProductImage product={p} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${p.slug}`} className="text-sm font-semibold hover:text-brand-700">{p.name}</Link>
                    <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted">{p.packSize} {p.rxRequired && <RxBadge />}</p>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
                    <div>
                      <p className="font-bold">{formatPrice(p.price * qty)}</p>
                      {p.discountPct > 0 && (
                        <p className="text-xs"><span className="text-muted line-through">{formatPrice(p.mrp * qty)}</span> <span className="font-semibold text-save">{p.discountPct}% off</span></p>
                      )}
                    </div>
                    <QuantityStepper qty={qty} onChange={(n) => setQty(p.id, n)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <CouponBox />
          <BillSummary bill={bill}>
            <ButtonLink href="/checkout" size="lg" className="w-full">Proceed to checkout</ButtonLink>
          </BillSummary>
        </div>
      </div>
      {/* Mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-16 z-20 flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="font-bold">{formatPrice(bill.total)}</p>
          {bill.savings > 0 && <p className="text-xs font-semibold text-save">Saving {formatPrice(bill.savings)}</p>}
        </div>
        <ButtonLink href="/checkout">Checkout</ButtonLink>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
