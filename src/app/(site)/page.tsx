import type { Metadata } from "next";
import { company } from "@/content/site";
import { heroHeadlineIndex, heroHeadlineOptions } from "@/content/landing";
import { getCatalogItems } from "@/lib/catalog-items";
import { getBestsellers, getCategories, getProducts } from "@/lib/catalog";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { HeroSection, type HeroFact } from "@/components/portfolio/HeroSection";
import { RangeSection, type RangeTile } from "@/components/portfolio/RangeSection";
import { ShopDirect } from "@/components/portfolio/ShopDirect";
import { CompositionExplorer } from "@/components/portfolio/CompositionExplorer";
import { ContactBand } from "@/components/portfolio/ContactSection";

export const metadata: Metadata = pageMetadata({ title: `${company.name}: ${company.tagline}`, absoluteTitle: true, description: company.description, path: "/" });

const RX = "Prescription (Rx)";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const [items, bestsellers, categories, storeProducts, sp] = await Promise.all([getCatalogItems(), getBestsellers(4), getCategories(), getProducts({}), searchParams]);

  // Headline preview in development only: /?headline=2
  const preview = process.env.NODE_ENV !== "production" ? Number(sp.headline) - 1 : NaN;
  const headline = heroHeadlineOptions[Number.isInteger(preview) && heroHeadlineOptions[preview] ? preview : heroHeadlineIndex];

  // Proof row: only numbers counted from the product data.
  const facts: HeroFact[] = [
    { value: items.length, label: "formulations in our product catalogue" },
    { value: storeProducts.length, label: "products sold direct in our store" },
    { value: categories.length, label: "therapeutic areas in the store" },
  ].filter((f) => f.value > 0);

  // "What we make": one tile per store collection, plus prescription formulations from the catalogue.
  const tiles: RangeTile[] = categories.map((c) => {
    const inArea = storeProducts.filter((p) => p.categorySlug === c.slug);
    const photo = inArea.find((p) => p.images[0]);
    return {
      name: c.name,
      description: c.description,
      count: inArea.length,
      unit: "product",
      href: `/collections/${c.slug}`,
      images: photo ? [{ src: photo.images[0], alt: `${photo.name} pack` }] : undefined,
    };
  });
  const rx = items.filter((i) => i.category === RX);
  if (rx.length > 0) {
    const packs = rx.filter((i) => i.imageUrl).slice(0, 3);
    tiles.push({
      name: "Prescription formulations",
      description: "Prescription medicines in our product catalogue, each listed with its full composition.",
      count: rx.length,
      unit: "formulation",
      href: `/products?category=${encodeURIComponent(RX)}`,
      images: packs.map((i) => ({ src: i.imageUrl!, alt: `${i.name} pack` })),
      wide: true,
    });
  }

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HeroSection headline={headline} areas={categories.map((c) => c.name)} facts={facts} />
      <RangeSection tiles={tiles} />
      <ShopDirect products={bestsellers} />
      <CompositionExplorer items={items} />
      <ContactBand />
    </>
  );
}
