import type { Metadata } from "next";
import { getBestsellers, getCategories, getProducts, parseFilters } from "@/lib/catalog";
import { CatalogView, stringParams } from "@/components/listing/CatalogView";
import { SearchBox } from "@/components/layout/SearchBox";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const { q } = parseFilters(await searchParams);
  return { title: q ? `Search: ${q}` : "Search", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const { q, tag, sort } = parseFilters(sp);
  const [products, categories, top] = await Promise.all([q || tag ? getProducts({ q, tag, sort }) : Promise.resolve([]), getCategories(), getBestsellers(3)]);
  return (
    <>
      <div className="mx-auto max-w-xl px-4 pt-10">
        <SearchBox />
      </div>
      <CatalogView
        eyebrow="Search"
        title={q ? <>Results for <em>“{q}”</em></> : "Search"}
        products={products}
        categories={categories}
        activeSlug={null}
        basePath="/search"
        params={stringParams(sp)}
        bestsellerIds={top.map((p) => p.id)}
        empty={
          <div className="rounded-2xl bg-tile px-6 py-16 text-center">
            <p className="display text-3xl">{q ? "No products found" : "What are you looking for?"}</p>
            <p className="mt-2 text-sm text-muted">Try an ingredient like “magnesium” or a goal like “sleep”.</p>
          </div>
        }
      />
    </>
  );
}
