import { AlertTriangle, BadgePercent, Building2, FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/data/categories";
import { coupons } from "@/data/home";
import { getAllProducts, getProductBySlug, getRelated, getSubstitutes } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceBlock } from "@/components/product/PriceBlock";
import { Rating, RxBadge } from "@/components/product/Badges";
import { AddToCart } from "@/components/product/AddToCart";
import { DeliveryCheck } from "@/components/product/DeliveryCheck";
import { ProductRail } from "@/components/product/ProductCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return p ? { title: p.name, description: p.description } : {};
}

function InfoSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-40 border-b border-line py-5 last:border-0">
      <h2 className="mb-2 text-base font-bold">{title}</h2>
      <div className="text-sm leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const substitutes = getSubstitutes(product);
  const cheaper = substitutes.find((s) => s.price < product.price);
  const related = getRelated(product);

  const sections = [
    { id: "description", title: "Description" },
    { id: "uses", title: "Uses" },
    { id: "side-effects", title: "Side effects" },
    { id: "how-to-use", title: "How to use" },
    { id: "safety", title: "Safety advice" },
    { id: "storage", title: "Storage" },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-5">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="card self-start p-4 lg:sticky lg:top-32">
            <ProductImage product={product} className="mx-auto max-w-md" />
          </div>

          <div className="space-y-4">
            <div className="card space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                {product.rxRequired && <RxBadge />}
                <Link href={`/search?q=${encodeURIComponent(product.brand)}`} className="text-xs font-semibold text-brand-700 hover:underline">
                  Visit {product.brand} store
                </Link>
              </div>
              <h1 className="text-xl font-bold md:text-2xl">{product.name}</h1>
              <p className="text-sm text-muted">{product.packSize}</p>
              <Rating rating={product.rating} count={product.ratingCount} />
              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                <p className="flex items-start gap-2">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-muted" />
                  <span><span className="text-muted">Manufacturer: </span>{product.manufacturer}</span>
                </p>
                <p className="flex items-start gap-2">
                  <FlaskConical className="mt-0.5 size-4 shrink-0 text-muted" />
                  <span><span className="text-muted">Composition: </span>{product.composition}</span>
                </p>
              </div>
              <div className="border-t border-line pt-3">
                <PriceBlock price={product.price} mrp={product.mrp} discountPct={product.discountPct} size="lg" />
                <p className="mt-0.5 text-xs text-muted">Inclusive of all taxes</p>
              </div>
              <AddToCart productId={product.id} inStock={product.inStock} size="lg" className="w-full sm:w-auto" />
              {product.rxRequired && (
                <p className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>
                    This medicine needs a valid prescription. You can upload it at checkout or from the{" "}
                    <Link href="/upload-prescription" className="font-semibold underline">Upload prescription</Link> page.
                  </span>
                </p>
              )}
            </div>

            {cheaper && (
              <Link href={`/product/${cheaper.slug}`} className="card flex items-center justify-between gap-3 border-green-200 bg-green-50 p-4 hover:shadow-md">
                <div>
                  <p className="text-sm font-bold text-save">
                    Save {Math.round(((product.price - cheaper.price) / product.price) * 100)}% with a substitute
                  </p>
                  <p className="text-xs text-gray-700">
                    {cheaper.name} has the same composition for {formatPrice(cheaper.price)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-brand-700">View</span>
              </Link>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <DeliveryCheck />
              <div className="rounded-xl border border-line p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <BadgePercent className="size-4 text-accent-500" /> Offers
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-700">
                  {coupons.slice(0, 2).map((c) => (
                    <li key={c.code}>
                      <span className="font-bold text-accent-600">{c.code}</span>: {c.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {substitutes.length > 0 && (
              <div className="card p-5">
                <h2 className="text-base font-bold">Substitutes with the same composition</h2>
                <p className="text-xs text-muted">{product.composition}</p>
                <ul className="mt-3 divide-y divide-line">
                  {substitutes.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <Link href={`/product/${s.slug}`} className="text-sm font-semibold hover:text-brand-700">{s.name}</Link>
                        <p className="text-xs text-muted">{s.manufacturer} · {s.packSize}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatPrice(s.price)}</p>
                        {s.price < product.price ? (
                          <p className="text-xs font-semibold text-save">{Math.round(((product.price - s.price) / product.price) * 100)}% cheaper</p>
                        ) : (
                          <p className="text-xs text-muted">MRP {formatPrice(s.mrp)}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card">
              <nav className="no-scrollbar sticky top-[7.5rem] z-10 flex gap-1 overflow-x-auto rounded-t-xl border-b border-line bg-white px-3 py-2 md:top-28">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-700">
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="px-5">
                <InfoSection id="description" title={`About ${product.name}`}>
                  <p>{product.description}</p>
                </InfoSection>
                <InfoSection id="uses" title="Uses">
                  <ul className="list-disc space-y-1 pl-5">{product.uses.map((u) => <li key={u}>{u}</li>)}</ul>
                </InfoSection>
                <InfoSection id="side-effects" title="Side effects">
                  <p className="mb-2">Most side effects do not need medical attention and go away as your body adjusts. Consult your doctor if they persist.</p>
                  <ul className="list-disc space-y-1 pl-5">{product.sideEffects.map((u) => <li key={u}>{u}</li>)}</ul>
                </InfoSection>
                <InfoSection id="how-to-use" title="How to use">
                  <p>{product.howToUse}</p>
                </InfoSection>
                <InfoSection id="safety" title="Safety advice">
                  <ul className="list-disc space-y-1 pl-5">{product.safetyAdvice.map((u) => <li key={u}>{u}</li>)}</ul>
                </InfoSection>
                <InfoSection id="storage" title="Storage">
                  <p>{product.storage}</p>
                </InfoSection>
              </div>
            </div>
            <p className="text-xs text-muted">
              Disclaimer: the information on this page is dummy content for demonstration only and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
      <ProductRail title="Customers also bought" products={related} />
    </>
  );
}
