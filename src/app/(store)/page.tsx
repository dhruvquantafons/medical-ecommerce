import { BadgePercent, ShieldCheck, Truck, Stethoscope } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { banners, concerns, coupons, faqs, featuredBrands, stats } from "@/data/home";
import { getBestsellers, getCategories, getDeals, getProducts } from "@/lib/catalog";
import { SearchBox } from "@/components/layout/SearchBox";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { CategoryGrid, ConcernGrid, SectionTitle, TrustBadges } from "@/components/home/Sections";
import { ProductRail } from "@/components/product/ProductCard";

const promises = [
  { icon: ShieldCheck, title: "100% genuine products", text: "Sourced directly from licensed distributors" },
  { icon: BadgePercent, title: "Save up to 25% every day", text: "Plus cheaper generic substitutes" },
  { icon: Truck, title: "Fast doorstep delivery", text: "Across 22,000+ pincodes in India" },
  { icon: Stethoscope, title: "Pharmacist verified", text: "Every prescription order is reviewed" },
];

export default async function Home() {
  const [categories, deals, bestsellers, vitamins, devices] = await Promise.all([
    getCategories(),
    getDeals(),
    getBestsellers(),
    getProducts({ category: "vitamins-supplements" }, 12),
    getProducts({ category: "healthcare-devices" }, 12),
  ]);
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-page">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pt-7 pb-6 md:pt-12 md:pb-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
              <ShieldCheck className="size-3.5" /> Trusted by 1 Cr+ customers across India
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">
              Your health essentials, <span className="text-brand-600">delivered.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Genuine medicines, wellness products and healthcare devices from {site.name}, at up to 25% off with free delivery above ₹{site.freeDeliveryAbove}.
            </p>
            <div className="mt-6 hidden max-w-2xl md:block">
              <SearchBox size="lg" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-medium text-muted">Popular:</span>
              {["Dolo 650", "Pan 40", "Vitamin C", "Glucometer", "Chyawanprash"].map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="rounded-full bg-white px-3 py-1.5 font-semibold text-gray-700 shadow-sm ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-500">
                  {t}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-xl shadow-brand-900/10">
              <p className="text-sm font-semibold text-brand-100">Why {site.name}</p>
              <ul className="mt-4 space-y-3">
                {promises.map(({ icon: I, title, text }) => (
                  <li key={title} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-700">
                      <I className="size-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{title}</span>
                      <span className="text-xs text-brand-100">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4">
        <BannerCarousel banners={banners} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Shop by category</SectionTitle>
        <CategoryGrid categories={categories} />
      </section>

      <ProductRail title="Deals of the day" subtitle="Biggest discounts on everyday health essentials" products={deals} href="/search?sort=discount" />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Shop by health concern</SectionTitle>
        <ConcernGrid concerns={concerns} />
      </section>

      <ProductRail title="Bestsellers" subtitle="Most ordered by customers like you" products={bestsellers} href="/search?sort=rating" />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Offers for you</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          {coupons.map((c) => (
            <div key={c.code} className="relative flex overflow-hidden rounded-xl bg-white ring-1 ring-line">
              <div className="grid w-24 shrink-0 place-items-center bg-gradient-to-br from-accent-500 to-accent-600 px-2 text-center text-white">
                <span className="text-lg leading-tight font-extrabold">
                  {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                  <span className="block text-[10px] font-bold tracking-widest">OFF</span>
                </span>
              </div>
              {/* ticket notches */}
              <span aria-hidden className="absolute top-1/2 left-[5.25rem] size-4 -translate-y-1/2 rounded-full bg-page" />
              <div className="flex-1 border-l-2 border-dashed border-orange-200 p-4 pl-5">
                <p className="inline-block rounded bg-orange-50 px-2 py-0.5 font-mono text-sm font-bold tracking-wider text-accent-600">{c.code}</p>
                <p className="mt-1.5 text-xs text-muted">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductRail title="Vitamins & supplements" products={vitamins} href="/category/vitamins-supplements" />
      <ProductRail title="Healthcare devices" products={devices} href="/category/healthcare-devices" />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Top brands</SectionTitle>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {featuredBrands.map((b) => (
            <Link key={b} href={`/search?q=${encodeURIComponent(b)}`} className="card grid h-16 place-items-center px-2 text-center text-sm font-extrabold tracking-tight text-gray-600 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow-md">
              {b}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 lg:hidden">
        <TrustBadges />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-brand-700 p-6 text-white md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold md:text-3xl">{s.value}</p>
              <p className="text-xs text-white/80 md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-6">
        <SectionTitle>Frequently asked questions</SectionTitle>
        <div className="card divide-y divide-line">
          {faqs.map((f) => (
            <details key={f.q} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                {f.q}
                <span className="text-brand-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
