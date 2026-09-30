import Link from "next/link";
import type { Product } from "@/data/types";
import { ProductImage } from "./ProductImage";
import { PriceBlock } from "./PriceBlock";
import { Rating, RxBadge } from "./Badges";
import { AddToCart } from "./AddToCart";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card group flex h-full flex-col p-3 transition-shadow hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative block">
        <ProductImage product={product} />
        {product.discountPct >= 20 && (
          <span className="absolute top-2 left-2 rounded bg-accent-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
            {product.discountPct}% OFF
          </span>
        )}
        {product.rxRequired && <RxBadge className="absolute top-2 right-2" />}
      </Link>
      <Link href={`/product/${product.slug}`} className="mt-3 flex-1">
        <h3 className="line-clamp-2 text-sm font-medium text-ink group-hover:text-brand-700">{product.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{product.packSize}</p>
        <div className="mt-1.5">
          <Rating rating={product.rating} count={product.ratingCount} />
        </div>
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
        <PriceBlock price={product.price} mrp={product.mrp} discountPct={product.discountPct} />
        <AddToCart productId={product.id} inStock={product.inStock} />
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

export function ProductRail({ title, products, href }: { title: string; products: Product[]; href?: string }) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-bold md:text-xl">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-semibold text-brand-700 hover:underline">
            View all
          </Link>
        )}
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[18%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
