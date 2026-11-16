import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/content/site";
import { heroSlides } from "@/data/home";
import { getBestsellers, getCategories, getNewArrivals, getProducts } from "@/lib/catalog";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductTabs } from "@/components/home/ProductTabs";
import { CollectionCards, CtaBand, Faq, Promises, SectionHeading, Spotlight } from "@/components/home/Sections";

export const metadata: Metadata = pageMetadata({
  title: "Store",
  description: `Buy ${company.name} supplements and medicines online: gut health, liver care, bone and joint, and heart health, delivered across India.`,
  path: "/store",
});

export default async function StorePage() {
  const [bestsellers, newArrivals, categories, all] = await Promise.all([getBestsellers(8), getNewArrivals(8), getCategories(), getProducts({})]);
  const bestsellerIds = bestsellers.slice(0, 3).map((p) => p.id);
  // One product per collection for the collection cards (best seller first, since `all` is in featured order).
  const featured = Object.fromEntries(categories.map((c) => [c.slug, all.find((p) => p.categorySlug === c.slug)]));
  const spotlight = bestsellers[0];

  return (
    <>
      <h1 className="sr-only">{company.name} store</h1>
      <HeroSlider slides={heroSlides} />
      <ProductTabs bestsellers={bestsellers} newArrivals={newArrivals} bestsellerIds={bestsellerIds} />

      <section id="science" className="mx-auto max-w-site scroll-mt-20 px-4 py-16 md:px-6 md:py-24">
        <SectionHeading eyebrow="Formulations" title="Our formulations" subtitle="Supplements for gut health, liver care, bone and joint, and heart health." />
        <CollectionCards categories={categories} featured={featured} />
      </section>

      {spotlight && (
        <section className="mx-auto max-w-site px-4 py-16 md:px-6 md:py-24">
          <Spotlight product={spotlight} />
        </section>
      )}

      <Promises />

      <section id="faq" className="mx-auto max-w-site scroll-mt-20 px-4 py-16 md:px-6 md:py-24">
        <Faq />
      </section>

      <section className="mx-auto max-w-site px-4 pb-16 md:px-6 md:pb-24">
        <CtaBand />
      </section>
    </>
  );
}
