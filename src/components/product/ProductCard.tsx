import type { ReactNode } from "react";
import clsx from "clsx";
import type { Product } from "@/data/types";
import { ProductCard } from "@/components/site/ProductCard";
import { RailScroller } from "./RailScroller";

// The card itself lives in components/site/ProductCard.tsx (one card for the whole site).
export { ProductCard };

export function SaleBadge({ className }: { className?: string }) {
  return <span className={clsx("rounded-full bg-danger px-2.5 py-1 text-sm font-medium text-white", className)}>Sale</span>;
}

/** Grid of product cards directly under a page h1 (cards use h2). */
export function ProductGrid({ products }: { products: Product[]; /** @deprecated unused */ bestsellerIds?: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} headingLevel="h2" />
        </li>
      ))}
    </ul>
  );
}

/** Horizontal product carousel with a heading and an optional right-hand slot (tabs, links). */
export function ProductRail({
  title,
  products,
  aside,
}: {
  title: string;
  products: Product[];
  /** @deprecated unused: there is no reliable best-seller data */
  bestsellerIds?: string[];
  aside?: ReactNode;
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-3xl text-ink md:text-4xl">{title}</h2>
        {aside}
      </div>
      <RailScroller label={title}>
        {products.map((p) => (
          <div key={p.id} className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
            <ProductCard product={p} />
          </div>
        ))}
      </RailScroller>
    </section>
  );
}
