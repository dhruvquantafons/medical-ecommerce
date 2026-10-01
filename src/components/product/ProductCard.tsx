import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { Product } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { AddToCart } from "./AddToCart";
import { RailScroller } from "./RailScroller";

export function SaleBadge({ className }: { className?: string }) {
  return <span className={clsx("rounded-full bg-sale px-2.5 py-1 text-xs font-semibold text-white", className)}>Sale</span>;
}

export function ProductCard({ product, bestseller }: { product: Product; bestseller?: boolean }) {
  const href = `/product/${product.slug}`;
  const sale = product.discountPct > 0;
  return (
    <div className="group relative flex h-full flex-col rounded-2xl bg-tile p-3 transition duration-300 hover:shadow-lg hover:shadow-brand-900/5">
      <Link href={href} className="relative block" tabIndex={-1} aria-hidden>
        <ProductImage product={product} hoverSwap className={clsx("transition duration-500 group-hover:scale-[1.03]", !product.inStock && "opacity-50 grayscale")} />
        <span className="absolute top-2 left-2 flex gap-1.5">
          {sale && <SaleBadge />}
          {!sale && bestseller && <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-white">Best seller</span>}
        </span>
        {!product.inStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 py-1 text-center text-xs font-semibold text-muted">Out of stock</span>
        )}
      </Link>
      <div className="mt-auto flex items-end justify-between gap-3 px-2 pt-4 pb-1">
        <Link href={href} className="min-w-0">
          {product.categoryName && <p className="text-xs text-muted">{product.categoryName}</p>}
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-ink group-hover:underline md:text-[15px]">{product.name}</h3>
          <p className="mt-1 text-sm">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {sale && <span className="ml-1.5 text-muted line-through">{formatPrice(product.mrp)}</span>}
          </p>
        </Link>
        <AddToCart productId={product.id} productName={product.name} inStock={product.inStock} variant="icon" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, bestsellerIds = [] }: { products: Product[]; bestsellerIds?: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} bestseller={bestsellerIds.includes(p.id)} />
      ))}
    </div>
  );
}

/** Horizontal product carousel with a serif heading and an optional right-hand slot (tabs, links). */
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
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
        {aside}
      </div>
      <RailScroller label={title}>
        {products.map((p) => (
          <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23.5%]">
            <ProductCard product={p} bestseller={bestsellerIds.includes(p.id)} />
          </div>
        ))}
      </RailScroller>
    </section>
  );
}
