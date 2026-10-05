import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { Category, Product } from "@/data/types";
import { ProductGrid } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { SortSelect } from "./SortSelect";

/** Shop / collection / search results: serif header, collection tabs, sort, product grid. */
export function CatalogView({
  eyebrow,
  title,
  description,
  products,
  categories,
  activeSlug,
  basePath,
  params,
  bestsellerIds,
  empty,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  products: Product[];
  categories: Category[];
  /** Collection slug being viewed; undefined = all products. Pass null to hide the tabs. */
  activeSlug?: string | null;
  basePath: string;
  params: Record<string, string>;
  bestsellerIds: string[];
  empty?: ReactNode;
}) {
  const tab = (active: boolean) =>
    clsx("shrink-0 rounded-full px-4 py-2 text-sm transition", active ? "bg-brand-gradient text-white" : "bg-tile text-ink hover:bg-brand-100");
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-10 pt-10 pb-6 md:pt-14">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-xs font-medium tracking-[0.2em] text-ink/80 uppercase">{eyebrow}</p>}
        <h1 className="display mt-3 text-3xl md:text-5xl">{title}</h1>
        {description && <p className="mt-4 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>

      <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-4">
        {activeSlug !== null ? (
          <nav aria-label="Collections" className="no-scrollbar -mx-4 flex max-w-full gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            <Link href="/shop" className={tab(activeSlug === undefined)} aria-current={activeSlug === undefined ? "page" : undefined}>
              All
            </Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className={tab(activeSlug === c.slug)} aria-current={activeSlug === c.slug ? "page" : undefined}>
                {c.name}
              </Link>
            ))}
          </nav>
        ) : (
          <p className="text-sm text-muted">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        )}
        {products.length > 1 && <SortSelect basePath={basePath} params={params} />}
      </div>

      {products.length ? (
        <ProductGrid products={products} bestsellerIds={bestsellerIds} />
      ) : (
        empty ?? (
          <div className="rounded-2xl bg-tile px-6 py-16 text-center">
            <p className="display text-2xl">Nothing here yet</p>
            <ButtonLink href="/shop" className="mt-5">Browse all products</ButtonLink>
          </div>
        )
      )}
    </div>
  );
}

/** Plain string params from Next's searchParams. */
export function stringParams(sp: Record<string, string | string[] | undefined>) {
  return Object.fromEntries(Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : Array.isArray(v) && v[0] ? [[k, v[0]]] : [])));
}
