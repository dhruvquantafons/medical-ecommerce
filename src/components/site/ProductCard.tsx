"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import type { Product } from "@/data/types";
import type { CatalogItem } from "@/lib/catalog-item-types";
import { parseSalts } from "@/lib/catalog-item-types";
import { productSummary } from "@/content/product-copy";
import { formLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";
import { CardAddButton } from "./CardAddButton";
import { Chip } from "./Chip";
import { Price } from "./Price";

/*
 * The one product card for the whole site (changeui.md Problem 13): store products and catalogue items.
 * - Square image on the surface colour, contained with 12% padding so packs of different shapes line up.
 * - Category (small uppercase), name (18px), one line of description (clamped to two lines), up to three
 *   composition chips in Geist Mono.
 * - Store products: price (with MRP struck through when higher) and an "Add" Stateful Button.
 * - Prescription and catalogue-only products: no price and no cart button; "Prescription required"
 *   where it applies.
 * - No star ratings or review counts (there are no real reviews).
 * - The whole card is one link (a stretched link on the name); the Add button sits above it.
 */

type Common = {
  headingLevel?: "h2" | "h3";
  className?: string;
};
type StoreProps = Common & { product: Product; item?: never; onSelect?: never };
type CatalogProps = Common & {
  item: CatalogItem;
  /** Open the details in place (the /products dialog) instead of navigating. The link still opens in a new tab. */
  onSelect?: (item: CatalogItem) => void;
  product?: never;
};

/**
 * Ingredient names from a composition line, splitting on commas but not inside numbers like "60,000 IU",
 * and dropping the amounts ("Pantethine 75 mg" → "Pantethine") so chips stay short. Doses are on the
 * product page.
 */
function compositionChips(composition: string) {
  return composition
    .split(/,(?!\d)/)
    .map((s) => s.replace(/\s+\d[\d,.]*\s*(mg|mcg|µg|g|iu|ml|billion|million|cfu|%).*$/i, "").trim())
    .filter(Boolean);
}

/** First sentence of a description, for the one-line summary. */
function firstSentence(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  const m = t.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : t).trim();
}

export function ProductCard(props: StoreProps | CatalogProps) {
  const { headingLevel: H = "h3", className } = props;

  let href: string;
  let name: string;
  let category: string | undefined;
  let detail: string | undefined;
  let summary: string;
  let chips: string[];
  let rx: boolean;
  let image: React.ReactNode;
  let onClick: ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined;
  const product = props.product;

  if (product) {
    href = `/product/${product.slug}`;
    name = product.name;
    category = product.categoryName;
    detail = formLabel(product.form) || undefined;
    summary = productSummary(product, 200);
    chips = compositionChips(product.composition);
    rx = product.rxRequired;
    image = (
      <ProductImage
        product={product}
        fit="contain"
        inset="p-[12%]"
        aspect="aspect-square"
        className={cn("transition-transform duration-200 group-hover:scale-[1.03]", !product.inStock && "opacity-60")}
      />
    );
  } else {
    const item = props.item!;
    href = `/products?item=${encodeURIComponent(item.id)}`;
    name = item.name;
    category = item.category;
    detail = item.dosageForm;
    summary = firstSentence(item.description);
    chips = parseSalts(item.salts).map((s) => s.name);
    rx = /prescription/i.test(item.category) || /prescription/i.test(item.availability);
    image = (
      <div className="aspect-square overflow-hidden rounded-card bg-surface">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs on any host
          <img
            src={item.imageUrl}
            alt={`${item.name} pack`}
            loading="lazy"
            className="size-full object-contain p-[12%] transition-transform duration-200 group-hover:scale-[1.03]"
          />
        )}
      </div>
    );
    const onSelect = props.onSelect;
    if (onSelect) {
      onClick = (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onSelect(item);
      };
    }
  }

  const shown = chips.slice(0, 3);
  const more = chips.length - shown.length;
  const sellable = product && !rx;

  return (
    <article className={cn("group relative flex h-full flex-col rounded-card border border-line bg-background p-3 transition-colors hover:border-ink-subtle", className)}>
      <div className="relative overflow-hidden rounded-card">
        {image}
        {(rx || (product && !product.inStock) || (product?.onSale && product.discountPct > 0)) && (
          <p className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {rx && <Chip className="bg-background">Prescription required</Chip>}
            {product && !product.inStock && <Chip className="bg-background text-ink-muted">Out of stock</Chip>}
            {product?.onSale && product.discountPct > 0 && <Chip tone="danger">Sale</Chip>}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        {(category || detail) && (
          <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm text-ink-muted">
            {category && <span className="tracking-[0.08em] uppercase">{category}</span>}
            {detail && <span>{detail}</span>}
          </p>
        )}
        <H className="mt-1 text-lg leading-snug font-medium text-ink">
          <Link href={href} onClick={onClick} scroll={!onClick} className="after:absolute after:inset-0 after:rounded-card group-hover:text-brand">
            {name}
          </Link>
        </H>
        {summary && <p className="mt-1 line-clamp-2 text-[15px] text-ink-muted">{summary}</p>}
        {shown.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Composition">
            {shown.map((c) => (
              <li key={c} className="max-w-full">
                <Chip className="font-mono text-[13px]">{c}</Chip>
              </li>
            ))}
            {more > 0 && <li className="self-center text-sm text-ink-subtle">+{more} more</li>}
          </ul>
        )}

        {sellable && (
          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-4">
            <Price price={product.price} mrp={product.mrp} />
            {product.inStock ? (
              <CardAddButton productId={product.id} productName={product.name} />
            ) : (
              <span className="text-sm text-ink-muted">Out of stock</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
