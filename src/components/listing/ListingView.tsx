import { PackageSearch } from "lucide-react";
import type { ReactNode } from "react";
import { getBrands, getProducts, getScopedProducts, parseFilters } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { FilterSidebar, MobileFilterButton } from "./FilterPanel";
import { SortSelect } from "./SortSelect";

type RawParams = Record<string, string | string[] | undefined>;

/** Shared category / search results layout. Filtering happens on the server from URL params. */
export function ListingView({
  basePath,
  searchParams,
  category,
  header,
}: {
  basePath: string;
  searchParams: RawParams;
  category?: string;
  header: ReactNode;
}) {
  const filters = { ...parseFilters(searchParams), category };
  const scoped = getScopedProducts(filters);
  const results = getProducts(filters);
  const params = Object.fromEntries(
    Object.entries(searchParams).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : Array.isArray(v) && v[0] ? [[k, v[0]]] : [])),
  );
  const panel = { basePath, params, brands: getBrands(scoped) };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      {header}
      <div className="mt-4 flex gap-5">
        <FilterSidebar {...panel} />
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm text-muted">
              Showing <span className="font-semibold text-ink">{results.length}</span> of {scoped.length} products
            </p>
            <div className="flex items-center gap-2">
              <MobileFilterButton {...panel} />
              <SortSelect basePath={basePath} params={params} />
            </div>
          </div>
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div className="card flex flex-col items-center gap-3 px-4 py-16 text-center">
              <PackageSearch className="size-12 text-gray-300" />
              <p className="font-semibold">No products match your filters</p>
              <p className="text-sm text-muted">Try removing some filters or searching for something else.</p>
              <ButtonLink href="/" variant="outline" size="sm">
                Back to home
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
