import Link from "next/link";
import clsx from "clsx";
import type { Product } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { Rating, RxBadge } from "./Badges";
import { AddToCart } from "./AddToCart";
import { RailScroller } from "./RailScroller";

export function ProductCard({ product }: { product: Product }) {
  const href = `/product/${product.slug}`;
  return (
    <div className="card group relative flex h-full flex-col p-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
      <Link href={href} className="relative block" tabIndex={-1} aria-hidden>
        <ProductImage product={product} className={clsx("transition duration-300 group-hover:scale-[1.02]", !product.inStock && "opacity-50 grayscale")} />
        {product.rxRequired && <RxBadge className="absolute top-2 left-2" />}
        {!product.inStock && (
          <span className="absolute inset-x-2 bottom-2 rounded-md bg-white/90 py-1 text-center text-[11px] font-semibold text-muted">Currently unavailable</span>
        )}
      </Link>
      <Link href={href} className="mt-3 flex-1">
        <h3 className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-ink group-hover:text-brand-700">{product.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{product.packSize}</p>
        <div className="mt-2 h-5">
          {product.ratingCount > 0 && <Rating rating={product.rating} count={product.ratingCount} />}
        </div>
      </Link>
      <div className="mt-3 border-t border-dashed border-line pt-3">
        <p className="flex flex-wrap items-baseline gap-x-1.5 leading-tight">
          <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
          {product.discountPct > 0 && <span className="text-[11px] text-muted line-through">{formatPrice(product.mrp)}</span>}
        </p>
        <p className="mt-0.5 h-4 text-[11px] font-bold text-save">{product.discountPct > 0 && `${product.discountPct}% off`}</p>
        <AddToCart productId={product.id} inStock={product.inStock} block className="mt-2" />
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductRail({ title, subtitle, products, href }: { title: string; subtitle?: string; products: Product[]; href?: string }) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">
            View all
          </Link>
        )}
      </div>
      <RailScroller label={title}>
        {products.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[18.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </RailScroller>
    </section>
  );
}
