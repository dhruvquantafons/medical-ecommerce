import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBestsellers, getCategories, getCategoryBySlug, getProducts, parseFilters } from "@/lib/catalog";
import { CatalogView, stringParams } from "@/components/listing/CatalogView";

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const c = await getCategoryBySlug((await params).slug);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const collection = await getCategoryBySlug(slug);
  if (!collection) notFound();
  const { sort } = parseFilters(sp);
  const [products, categories, top] = await Promise.all([getProducts({ category: slug, sort }), getCategories(), getBestsellers(3)]);
  return (
    <CatalogView
      eyebrow="Collection"
      title={collection.name}
      description={collection.description}
      products={products}
      categories={categories}
      activeSlug={slug}
      basePath={`/collections/${slug}`}
      params={stringParams(sp)}
      bestsellerIds={top.map((p) => p.id)}
    />
  );
}
