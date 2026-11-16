import type { Metadata } from "next";
import { getBestsellers, getCategories, getProducts, parseFilters } from "@/lib/catalog";
import { CatalogView, stringParams } from "@/components/legacy-store/CatalogView";

export const metadata: Metadata = { title: "Shop all", description: "All Syncytium Health supplements." };

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const { sort } = parseFilters(sp);
  const [products, categories, top] = await Promise.all([getProducts({ sort }), getCategories(), getBestsellers(3)]);
  return (
    <CatalogView
      eyebrow="Shop"
      title={<>All <em>supplements</em></>}
      // "doctor-formulated" was dropped from the original line: it is an unverified claim (CLAUDE.md, Content).
      description="Our complete range of daily supplements."
      products={products}
      categories={categories}
      basePath="/shop"
      params={stringParams(sp)}
      bestsellerIds={top.map((p) => p.id)}
    />
  );
}
