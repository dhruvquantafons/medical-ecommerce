import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { banners, concerns, coupons, faqs, featuredBrands, stats } from "@/data/home";
import { getBestsellers, getDeals, getProducts } from "@/lib/catalog";
import { SearchBox } from "@/components/layout/SearchBox";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { CategoryGrid, ConcernGrid, RxCallout, SectionTitle, TrustBadges } from "@/components/home/Sections";
import { ProductRail } from "@/components/product/ProductCard";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-page">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 md:pt-12">
          <h1 className="text-2xl font-extrabold md:text-4xl">
            What are you looking for?
          </h1>
          <p className="mt-1 text-sm text-muted md:text-base">Order medicines and health products online with fast delivery from {site.name}.</p>
          <div className="mt-5 max-w-3xl">
            <SearchBox size="lg" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="text-muted">Popular:</span>
            {["Dolo 650", "Pan 40", "Vitamin C", "Glucometer", "Chyawanprash"].map((t) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="rounded-full bg-white px-2.5 py-1 font-medium ring-1 ring-line hover:ring-brand-500">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4">
        <BannerCarousel banners={banners} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4">
        <RxCallout />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Shop by category</SectionTitle>
        <CategoryGrid categories={categories} />
      </section>

      <ProductRail title="Deals of the day" products={getDeals()} href="/search?sort=discount" />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Shop by health concern</SectionTitle>
        <ConcernGrid concerns={concerns} />
      </section>

      <ProductRail title="Bestsellers" products={getBestsellers()} href="/search?sort=rating" />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Offers for you</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          {coupons.map((c) => (
            <div key={c.code} className="card flex items-center justify-between gap-3 border-dashed p-4">
              <div>
                <p className="text-sm font-bold text-accent-600">{c.code}</p>
                <p className="text-xs text-muted">{c.description}</p>
              </div>
              <span className="rounded-md bg-accent-500/10 px-2 py-1 text-xs font-bold text-accent-600">
                {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <ProductRail title="Vitamins & supplements" products={getProducts({ category: "vitamins-supplements" })} href="/category/vitamins-supplements" />
      <ProductRail title="Healthcare devices" products={getProducts({ category: "healthcare-devices" })} href="/category/healthcare-devices" />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle>Top brands</SectionTitle>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {featuredBrands.map((b) => (
            <Link key={b} href={`/search?q=${encodeURIComponent(b)}`} className="card grid h-16 place-items-center px-2 text-center text-sm font-bold text-gray-700 hover:text-brand-700 hover:shadow-md">
              {b}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
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
