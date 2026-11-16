import { Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { Product } from "@/data/types";
import { descriptionSummary } from "@/lib/description";
import { formLabel, formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { AddToCart } from "./AddToCart";
import { RailScroller } from "./RailScroller";

export function SaleBadge({ className }: { className?: string }) {
  return <span className={clsx("rounded-full bg-sale px-2.5 py-1 text-xs font-semibold text-white", className)}>Sale</span>;
}

/** Up to `max` ingredient names from the composition text, plus how many were left out. */
function ingredientChips(composition: string, max = 3) {
  // Split on commas, but not inside numbers like "60,000 IU".
  const all = composition.split(/,(?!\d)/).map((s) => s.trim()).filter(Boolean);
  return { chips: all.slice(0, max), more: Math.max(0, all.length - max) };
}

export function ProductCard({ product, bestseller }: { product: Product; bestseller?: boolean }) {
  const href = `/product/${product.slug}`;
  const sale = product.discountPct > 0;
  const form = formLabel(product.form);
  const summary = descriptionSummary(product.description, 160);
  const { chips, more } = ingredientChips(product.composition);
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-3.5 transition duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
      <Link href={href} className="relative block overflow-hidden rounded-xl" tabIndex={-1} aria-hidden>
        <ProductImage
          product={product}
          hoverSwap
          fit="cover"
          aspect="aspect-[4/3]"
          className={clsx("transition duration-500 group-hover:scale-[1.03]", !product.inStock && "opacity-50 grayscale")}
        />
        <span className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {product.rxRequired && <span className="rounded-full bg-ink/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">Prescription (Rx)</span>}
          {sale && <SaleBadge />}
          {!sale && bestseller && <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-white">Best seller</span>}
        </span>
        {product.ratingCount > 0 && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold shadow-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 py-1 text-center text-xs font-semibold text-muted">Out of stock</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          {product.categoryName && <span className="truncate font-bold tracking-wide text-brand-500 uppercase">{product.categoryName}</span>}
          {form && <span className="shrink-0 text-muted">{form}</span>}
        </div>
        <Link href={href} className="mt-1.5">
          <h3 className="line-clamp-2 text-base leading-snug font-bold text-ink group-hover:text-brand-700 md:text-lg">{product.name}</h3>
        </Link>
        {summary && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{summary}</p>}
        {chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Key ingredients">
            {chips.map((c) => (
              <li key={c} className="max-w-full truncate rounded-md border border-line bg-page px-2 py-0.5 text-xs text-ink/75">{c}</li>
            ))}
            {more > 0 && <li className="rounded-md px-1 py-0.5 text-xs text-muted">+{more} more</li>}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-4">
          <div>
            <p className="text-xs text-muted">Price</p>
            <p className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-lg font-bold text-ink">{formatPrice(product.price)}</span>
              {sale && <span className="text-sm text-muted line-through">{formatPrice(product.mrp)}</span>}
            </p>
          </div>
          <AddToCart productId={product.id} productName={product.name} inStock={product.inStock} variant="card" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, bestsellerIds = [] }: { products: Product[]; bestsellerIds?: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} bestseller={bestsellerIds.includes(p.id)} />
      ))}
    </div>
  );
}

/** Horizontal product carousel with a heading and an optional right-hand slot (tabs, links). */
export function ProductRail({
  title,
  products,
  bestsellerIds = [],
  aside,
}: {
  title: string;
  products: Product[];
  bestsellerIds?: string[];
  aside?: ReactNode;
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-2xl md:text-3xl">{title}</h2>
        {aside}
      </div>
      <RailScroller label={title}>
        {products.map((p) => (
          <div key={p.id} className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
            <ProductCard product={p} bestseller={bestsellerIds.includes(p.id)} />
          </div>
        ))}
      </RailScroller>
    </section>
  );
}
