"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog-item-types";
import { displayBrand, parseSalts } from "@/lib/catalog-item-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { MedicineModal } from "../MedicineModal";

/*
 * /products: the product catalogue. Interim version (Problems 02, 03, 04, 08): the pill, the "Back to
 * Home" button, the coloured count cards, the per-card rainbow borders, star ratings and the fake
 * "Sync Store" toast are removed. Problem 18 rebuilds this page and audits the data.
 */
export function CatalogPage({ items, initialItemId, initialFilter }: { items: CatalogItem[]; initialItemId?: string; initialFilter?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(initialFilter && items.some((i) => i.category === initialFilter) ? initialFilter : "All");
  const [selectedId, setSelectedId] = useState<string | null>(initialItemId ?? null);
  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCat = activeFilter === "All" || item.category === activeFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        displayBrand(item.brand).toLowerCase().includes(q) ||
        parseSalts(item.salts).some((s) => s.name.toLowerCase().includes(q))
      );
    });
  }, [items, searchQuery, activeFilter]);

  // Keep the open product in the URL so a detail view can be linked (and the header search can open one).
  function select(id: string | null) {
    setSelectedId(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("item", id);
    else url.searchParams.delete("item");
    window.history.replaceState(null, "", url);
  }

  const count = (cat: string) => (cat === "All" ? items.length : items.filter((i) => i.category === cat).length);

  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading as="h1" title="Products" lead={`Our catalogue of ${items.length} formulations, with the ingredients in each.`} />

        <div className="mt-10 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-end md:justify-between">
          <fieldset>
            <legend className="sr-only">Filter by classification</legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={activeFilter === cat}
                  onClick={() => setActiveFilter(cat)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors",
                    activeFilter === cat ? "border-brand bg-brand-tint text-brand" : "border-line text-ink hover:border-ink-subtle",
                  )}
                >
                  {cat} <span className="text-sm text-ink-muted tabular-nums">{count(cat)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex w-full flex-col gap-2 md:w-80">
            <Label htmlFor="catalog-search">Search products</Label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
              <Input
                id="catalog-search"
                type="search"
                placeholder="Name, brand or ingredient"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-9"
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-[15px] text-ink-muted" aria-live="polite">
          Showing {filteredItems.length} of {items.length} products
        </p>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-start gap-4 py-16">
            <h2 className="text-xl font-medium text-ink">No products match your search</h2>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} headingLevel="h2" onSelect={(i) => select(i.id)} />
              </li>
            ))}
          </ul>
        )}
      </Container>

      <MedicineModal item={selectedItem} onClose={() => select(null)} />
    </div>
  );
}
