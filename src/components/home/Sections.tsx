import { ArrowUpRight, Check, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { Category, Product } from "@/data/types";
import { collectionImages, faqs, promises } from "@/data/home";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { productSummary } from "@/content/product-copy";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/button";
import { ProductImage } from "@/components/product/ProductImage";
import { AddToCart } from "@/components/product/AddToCart";
import { SaleBadge } from "@/components/product/ProductCard";

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: { eyebrow?: string; title: ReactNode; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={clsx("mb-10 md:mb-12", align === "center" && "mx-auto max-w-2xl text-center")}>
      {eyebrow && <p className="text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">{eyebrow}</p>}
      <h2 className="display mt-3 text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className={clsx("mt-4 text-lg text-ink-muted", align === "center" && "mx-auto max-w-prose")}>{subtitle}</p>}
    </div>
  );
}

function CollectionCaption({ c }: { c: Category }) {
  return (
    <div className="flex items-end justify-between gap-3 p-5">
      <div className="min-w-0">
        <p className="display text-2xl text-ink">{c.name}</p>
        <p className="mt-1 line-clamp-2 text-[15px] text-ink-muted">{c.description}</p>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-background text-ink">
        <ArrowUpRight className="size-5" />
      </span>
    </div>
  );
}

/**
 * Collection cards. With a product photo: the square photo on top and the caption on a solid green panel.
 * Without one: the drawn placeholder product over the collection's background art.
 */
export function CollectionCards({ categories, featured }: { categories: Category[]; featured: Record<string, Product | undefined> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c) => {
        const product = featured[c.slug];
        const photo = product?.images[0];
        if (photo) {
          return (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group flex flex-col overflow-hidden rounded-card border border-line bg-background transition-colors hover:border-ink-subtle">
              <span className="relative block aspect-square overflow-hidden bg-tile">
                {/* eslint-disable-next-line @next/next/no-img-element -- uploads and admin-provided URLs on any host */}
                <img src={photo} alt="" loading="lazy" className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
              </span>
              <CollectionCaption c={c} />
            </Link>
          );
        }
        const image = collectionImages[c.slug];
        return (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-card border border-line bg-surface">
            {image && <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" unoptimized={image.endsWith(".svg")} className="object-cover" />}
            {product && (
              <div className="absolute inset-x-10 top-14 bottom-24">
                <ProductImage product={product} fit="contain" className="!bg-transparent" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 border-t border-line bg-background">
              <CollectionCaption c={c} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** Big feature block for the top product. */
export function Spotlight({ product }: { product: Product }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <Link
        href={`/product/${product.slug}`}
        className={product.images.length ? "relative block overflow-hidden rounded-card border border-line" : "relative block rounded-card bg-surface p-8"}
      >
        <ProductImage product={product} className={product.images.length ? "" : "mx-auto max-w-md"} />
        {product.onSale && product.discountPct > 0 && <SaleBadge className="absolute top-6 left-6" />}
      </Link>
      <div>
        <p className="text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">Our bestseller</p>
        <h2 className="display mt-3 text-3xl md:text-4xl">{product.name}</h2>
        <p className="mt-4 max-w-prose text-lg text-ink-muted">{productSummary(product)}</p>
        <ul className="mt-6 space-y-2.5">
          {product.uses.slice(0, 4).map((u) => (
            <li key={u} className="flex items-center gap-3 text-[15px]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                <Check className="size-3.5" />
              </span>
              {u}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-2xl">
          {formatPrice(product.price)}
          {product.discountPct > 0 && <span className="ml-2 text-base text-muted-foreground line-through">{formatPrice(product.mrp)}</span>}
          <span className="ml-2 text-sm text-muted-foreground">· {product.packSize}</span>
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AddToCart productId={product.id} productName={product.name} inStock={product.inStock} className="min-w-52" />
          <ButtonLink href={`/product/${product.slug}`} variant="outline" size="lg">
            Learn more
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/** "Why Syncytium". Renders nothing until verified claims are supplied (see promises in data/home.ts). */
export function Promises() {
  if (promises.length === 0) return null;
  return (
    <div className="rounded-card border border-line bg-surface px-6 py-12 md:px-12 md:py-16">
      <SectionHeading eyebrow="Why Syncytium" title="Made with care" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((p) => (
          <div key={p.title} className="border-t border-line pt-6">
            <Icon name={p.icon} className="size-5 text-ink-muted" />
            <p className="display mt-5 text-3xl text-ink">{p.stat}</p>
            <p className="mt-1 font-medium text-ink">{p.title}</p>
            <p className="mt-2 text-[15px] text-ink-muted">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div>
        <SectionHeading align="left" eyebrow="FAQ" title="Questions, answered" subtitle="Can't find what you're looking for? Our team is happy to help." />
        <Link href="/faq" className="-mt-6 inline-flex min-h-11 items-center text-[15px] font-medium text-brand hover:underline hover:underline-offset-4">
          All questions
        </Link>
      </div>
      <div className="divide-y divide-line border-y border-line">
        {faqs.slice(0, 3).map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
              {f.q}
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform group-open:rotate-45">
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="mt-3 max-w-prose text-base text-ink-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-card border border-line bg-surface px-6 py-10 md:flex-row md:items-center md:px-12 md:py-14">
      <div>
        <h2 className="display text-2xl text-ink md:text-3xl">Start your daily ritual.</h2>
        <p className="mt-2 text-[15px] text-ink-muted">Free delivery above ₹{site.freeDeliveryAbove} · Ships within 24 hours</p>
      </div>
      <ButtonLink href="/shop" size="lg">
        Shop all products
      </ButtonLink>
    </div>
  );
}
