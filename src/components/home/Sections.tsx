import { ArrowUpRight, Check, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { Category, Product } from "@/data/types";
import { collectionImages, faqs, promises, reviews } from "@/data/home";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { descriptionSummary } from "@/lib/description";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { AddToCart } from "@/components/product/AddToCart";
import { SaleBadge } from "@/components/product/ProductCard";

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: { eyebrow?: string; title: ReactNode; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={clsx("mb-10 md:mb-12", align === "center" && "mx-auto max-w-2xl text-center")}>
      {eyebrow && <p className="text-xs font-medium tracking-[0.2em] text-ink/80 uppercase">{eyebrow}</p>}
      <h2 className="display mt-3 text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className={clsx("mt-4 text-[15px] leading-relaxed text-muted", align === "center" && "mx-auto max-w-md")}>{subtitle}</p>}
    </div>
  );
}

function CollectionCaption({ c }: { c: Category }) {
  return (
    <div className="flex items-end justify-between gap-3 p-5 text-white">
      <div className="min-w-0">
        <p className="display text-2xl">{c.name}</p>
        <p className="mt-1 line-clamp-1 text-sm text-white/75">{c.description}</p>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:bg-lime">
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
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-brand-800">
              <span className="relative block aspect-square overflow-hidden bg-tile">
                {/* eslint-disable-next-line @next/next/no-img-element -- uploads and admin-provided URLs on any host */}
                <img src={photo} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
              </span>
              <CollectionCaption c={c} />
            </Link>
          );
        }
        const image = collectionImages[c.slug];
        return (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-brand-800">
            {image && <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" unoptimized={image.endsWith(".svg")} className="object-cover transition duration-700 group-hover:scale-105" />}
            <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">{c.name}</span>
            {product && (
              <div className="absolute inset-x-10 top-14 bottom-24 transition duration-700 group-hover:-translate-y-1">
                <ProductImage product={product} fit="contain" className="!bg-transparent" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0">
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
        className={product.images.length ? "relative block overflow-hidden rounded-3xl" : "relative block rounded-3xl bg-tile p-8"}
      >
        <ProductImage product={product} className={product.images.length ? "" : "mx-auto max-w-md"} />
        {product.discountPct > 0 && <SaleBadge className="absolute top-6 left-6" />}
      </Link>
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-ink/80 uppercase">Our bestseller</p>
        <h2 className="display mt-3 text-3xl md:text-4xl">{product.name}</h2>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">{descriptionSummary(product.description)}</p>
        <ul className="mt-6 space-y-2.5">
          {product.uses.slice(0, 4).map((u) => (
            <li key={u} className="flex items-center gap-3 text-[15px]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-brand-800">
                <Check className="size-3.5" />
              </span>
              {u}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-2xl">
          {formatPrice(product.price)}
          {product.discountPct > 0 && <span className="ml-2 text-base text-muted line-through">{formatPrice(product.mrp)}</span>}
          <span className="ml-2 text-sm text-muted">· {product.packSize}</span>
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

export function Promises() {
  return (
    <div className="rounded-3xl bg-brand-800 px-6 py-12 text-white md:px-12 md:py-16">
      <p className="text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase">Why Syncytium</p>
      <h2 className="display mx-auto mt-3 max-w-2xl text-center text-3xl md:text-4xl">
        Made with care, <em className="text-lime">backed by science.</em>
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((p) => (
          <div key={p.title} className="border-t border-white/15 pt-6">
            <span className="grid size-11 place-items-center rounded-full bg-lime text-brand-800">
              <Icon name={p.icon} className="size-5" />
            </span>
            <p className="display mt-5 text-3xl">{p.stat}</p>
            <p className="mt-1 font-medium">{p.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <>
      <SectionHeading eyebrow="Reviews" title={<>Loved by our <em>community</em></>} />
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="flex flex-col rounded-2xl bg-tile p-6 md:p-7">
            <div className="flex gap-0.5 text-brand-800" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={clsx("size-4", i < r.rating ? "fill-current" : "opacity-25")} />
              ))}
            </div>
            <blockquote className="display mt-4 flex-1 text-lg leading-snug font-semibold">“{r.text}”</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-medium">{r.name}</span> <span className="text-muted">· {r.city}</span>
              <span className="block text-xs text-muted">on {r.product}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">Sample reviews for demonstration.</p>
    </>
  );
}

export function Faq() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <SectionHeading align="left" eyebrow="FAQ" title={<>Questions, <em>answered</em></>} subtitle="Can't find what you're looking for? Our team is happy to help." />
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
              {f.q}
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/15 transition group-open:rotate-45">
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-lime px-6 py-10 md:flex-row md:items-center md:px-12 md:py-14">
      <div>
        <h2 className="display text-2xl text-brand-800 md:text-3xl">
          Start your <em>daily ritual.</em>
        </h2>
        <p className="mt-2 text-[15px] text-brand-800/75">Free delivery above ₹{site.freeDeliveryAbove} · Ships within 24 hours</p>
      </div>
      <ButtonLink href="/shop" variant="dark" size="lg">
        Shop all products
      </ButtonLink>
    </div>
  );
}
