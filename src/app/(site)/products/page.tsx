import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/content/site";
import { getCatalogItems } from "@/lib/catalog-items";
import { CatalogPage } from "@/components/portfolio/pages/CatalogPage";

export const metadata: Metadata = pageMetadata({
  title: "Products",
  description: `The ${company.name} product catalogue: prescription and over-the-counter formulations, with the ingredients and amount in each.`,
  path: "/products",
});

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const [items, sp] = await Promise.all([getCatalogItems(), searchParams]);
  const item = typeof sp.item === "string" ? sp.item : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  // Remount when the header search opens a different product so the dialog follows the URL.
  return <CatalogPage key={`${item ?? ""}|${category ?? ""}`} items={items} initialItemId={item} initialFilter={category} />;
}
