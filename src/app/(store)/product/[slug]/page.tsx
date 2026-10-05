import { Check, ChevronRight, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { site } from "@/config/site";
import { getBestsellers, getProductBySlug, getRelated } from "@/lib/catalog";
import { formatCount, formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCart";
import { DeliveryCheck } from "@/components/product/DeliveryCheck";
import { ProductRail, SaleBadge } from "@/components/product/ProductCard";
import { RxBadge } from "@/components/product/Badges";
import { ProductDescription } from "@/components/product/ProductDescription";
import { descriptionSummary, splitDescription } from "@/lib/description";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  return p ? { title: p.name, description: descriptionSummary(p.description, 160) } : {};
}

function Accordion({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-b border-line py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-medium">
        {title}
        <ChevronRight className="size-5 transition group-open:rotate-90" />
      </summary>
      <div className="mt-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </details>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-brand-800" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={clsx("size-4", i < Math.round(rating) ? "fill-current" : "opacity-25")} />
      ))}
    </span>
  );
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [relatedFirst, top] = await Promise.all([getRelated(product, 8), getBestsellers(9)]);
  // Small range: top up closely related products with best sellers.
  const related = [...relatedFirst, ...top.filter((p) => p.id !== product.id && !relatedFirst.some((r) => r.id === p.id))].slice(0, 8);
  const sale = product.discountPct > 0;
  const description = splitDescription(product.description);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 md:px-10 pt-8 md:pt-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <ChevronRight className="size-3.5" />
          {product.categoryName && (
            <>
              <Link href={`/collections/${product.categorySlug}`} className="hover:text-ink">{product.categoryName}</Link>
              <ChevronRight className="size-3.5" />
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <div className={clsx("relative self-start lg:sticky lg:top-28", product.images.length ? "overflow-hidden rounded-3xl" : "rounded-3xl bg-tile p-6 md:p-10")}>
            <ProductGallery product={product} />
            {sale && <SaleBadge className="absolute top-5 left-5" />}
          </div>

          <div>
            {product.categoryName && (
              <Link href={`/collections/${product.categorySlug}`} className="text-xs font-medium tracking-[0.2em] text-ink/80 uppercase hover:text-ink">
                {product.categoryName}
              </Link>
            )}
            <h1 className="display mt-3 text-3xl md:text-4xl">{product.name}</h1>
            {product.ratingCount > 0 && (
              <p className="mt-3 flex items-center gap-2 text-sm">
                <Stars rating={product.rating} />
                <span>
                  {product.rating.toFixed(1)} <span className="text-muted">· {formatCount(product.ratingCount)} reviews</span>
                </span>
              </p>
            )}
            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl">{formatPrice(product.price)}</span>
              {sale && (
                <>
                  <span className="text-lg text-muted line-through">{formatPrice(product.mrp)}</span>
                  <span className="text-sm font-semibold text-sale">Save {product.discountPct}%</span>
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted">{product.packSize} · Inclusive of all taxes</p>
            {product.rxRequired && (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
                <RxBadge /> Prescription required. You&apos;ll upload a valid prescription at checkout.
              </p>
            )}
            {description.summary.map((text, i) => (
              <p key={i} className="mt-5 text-[15px] leading-relaxed text-ink/80">{text}</p>
            ))}

            {product.uses.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.uses.slice(0, 4).map((u) => (
                  <li key={u} className="flex items-center gap-1.5 rounded-full bg-tile px-3 py-1.5 text-sm">
                    <Check className="size-3.5 text-brand-600" /> {u}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7">
              <AddToCart productId={product.id} productName={product.name} inStock={product.inStock} className="w-full sm:w-80" />
              {product.inStock && product.stock <= 10 && <p className="mt-2 text-sm font-medium text-sale">Only {product.stock} left in stock</p>}
            </div>

            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2"><Truck className="size-4 text-brand-600" /> Free delivery above ₹{site.freeDeliveryAbove}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-brand-600" /> Third-party tested</li>
              <li className="flex items-center gap-2"><RotateCcw className="size-4 text-brand-600" /> 7-day easy returns</li>
            </ul>

            <div className="mt-6">
              <DeliveryCheck />
            </div>

            <div className="mt-6 border-t border-line">
              {description.details.length > 0 && (
                <Accordion title="Description" open>
                  <ProductDescription blocks={description.details} />
                </Accordion>
              )}
              {product.uses.length > 0 && (
                <Accordion title="Benefits" open={!description.details.length}>
                  <ul className="list-disc space-y-1 pl-5">{product.uses.map((u) => <li key={u}>{u}</li>)}</ul>
                </Accordion>
              )}
              {product.composition && <Accordion title="Key ingredients">{product.composition}</Accordion>}
              {product.howToUse && <Accordion title="How to use">{product.howToUse}</Accordion>}
              {product.safetyAdvice.length > 0 && (
                <Accordion title="Safety information">
                  <ul className="list-disc space-y-1 pl-5">{product.safetyAdvice.map((u) => <li key={u}>{u}</li>)}</ul>
                </Accordion>
              )}
              {product.sideEffects.length > 0 && (
                <Accordion title="Possible side effects">
                  <ul className="list-disc space-y-1 pl-5">{product.sideEffects.map((u) => <li key={u}>{u}</li>)}</ul>
                </Accordion>
              )}
              {product.storage && <Accordion title="Storage">{product.storage}</Accordion>}
            </div>
          </div>
        </div>
      </div>
      <ProductRail title="You may also like" products={related} bestsellerIds={top.slice(0, 3).map((p) => p.id)} />
    </>
  );
}
