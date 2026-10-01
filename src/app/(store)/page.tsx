import { heroSlides } from "@/data/home";
import { getBestsellers, getCategories, getNewArrivals, getProducts } from "@/lib/catalog";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductTabs } from "@/components/home/ProductTabs";
import { CollectionCards, CtaBand, Faq, Promises, Reviews, SectionHeading, Spotlight } from "@/components/home/Sections";

export default async function Home() {
  const [bestsellers, newArrivals, categories, all] = await Promise.all([getBestsellers(8), getNewArrivals(8), getCategories(), getProducts({})]);
  const bestsellerIds = bestsellers.slice(0, 3).map((p) => p.id);
  // One product per collection for the collection cards (best seller first, since `all` is in featured order).
  const featured = Object.fromEntries(categories.map((c) => [c.slug, all.find((p) => p.categorySlug === c.slug)]));
  const spotlight = bestsellers[0];

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <div className="relative -mt-8 rounded-t-[2rem] bg-white">
        <ProductTabs bestsellers={bestsellers} newArrivals={newArrivals} bestsellerIds={bestsellerIds} />

        <section id="science" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10 md:py-16">
          <SectionHeading
            eyebrow="Formulations"
            title="Science-backed formulations"
            subtitle="Simple, effective supplements designed with doctors to support your long-term health and wellbeing."
          />
          <CollectionCards categories={categories} featured={featured} />
        </section>

        {spotlight && (
          <section className="mx-auto max-w-7xl px-4 md:px-10 py-10 md:py-16">
            <Spotlight product={spotlight} />
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 md:px-10 py-10 md:py-16">
          <Promises />
        </section>

        <section className="mx-auto max-w-7xl px-4 md:px-10 py-10 md:py-16">
          <Reviews />
        </section>

        <section id="faq" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10 md:py-16">
          <Faq />
        </section>

        <section className="mx-auto max-w-7xl px-4 md:px-10 pt-6 pb-4">
          <CtaBand />
        </section>
      </div>
    </>
  );
}
