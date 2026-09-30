import { categories, getCategory } from "@/data/categories";
import { products } from "@/data/products";
import type { Product } from "@/data/types";

// All catalogue access goes through here so the mock data can later be swapped for an API.

export type SortKey = "relevance" | "price-asc" | "price-desc" | "discount" | "rating";

export interface ProductFilters {
  category?: string;
  q?: string;
  tag?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  type?: "rx" | "otc";
  inStock?: boolean;
  sort?: SortKey;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | undefined) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export function parseFilters(sp: RawParams): ProductFilters {
  const brand = first(sp.brand);
  const type = first(sp.type);
  return {
    q: first(sp.q)?.trim() || undefined,
    tag: first(sp.tag) || undefined,
    brands: brand ? brand.split(",").filter(Boolean) : undefined,
    minPrice: num(first(sp.min)),
    maxPrice: num(first(sp.max)),
    minDiscount: num(first(sp.discount)),
    type: type === "rx" || type === "otc" ? type : undefined,
    inStock: first(sp.stock) === "1" || undefined,
    sort: (first(sp.sort) as SortKey) || "relevance",
  };
}

function matchScore(p: Product, q: string) {
  const needle = q.toLowerCase();
  const name = p.name.toLowerCase();
  if (name.startsWith(needle)) return 3;
  if (name.includes(needle) || p.brand.toLowerCase().includes(needle)) return 2;
  const haystack = [p.composition, p.manufacturer, ...p.tags, ...p.uses, getCategory(p.categorySlug)?.name ?? ""]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle) ? 1 : 0;
}

/** Products matching the scope (category / search / tag) before user-applied filters. */
export function getScopedProducts(f: Pick<ProductFilters, "category" | "q" | "tag">): Product[] {
  let list = products;
  if (f.category) list = list.filter((p) => p.categorySlug === f.category);
  if (f.tag) list = list.filter((p) => p.tags.includes(f.tag!));
  if (f.q) {
    const q = f.q;
    list = list
      .map((p) => ({ p, s: matchScore(p, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);
  }
  return list;
}

export function getProducts(f: ProductFilters): Product[] {
  let list = getScopedProducts(f);
  if (f.brands?.length) list = list.filter((p) => f.brands!.includes(p.brand));
  if (f.minPrice != null) list = list.filter((p) => p.price >= f.minPrice!);
  if (f.maxPrice != null) list = list.filter((p) => p.price <= f.maxPrice!);
  if (f.minDiscount != null) list = list.filter((p) => p.discountPct >= f.minDiscount!);
  if (f.type === "rx") list = list.filter((p) => p.rxRequired);
  if (f.type === "otc") list = list.filter((p) => !p.rxRequired);
  if (f.inStock) list = list.filter((p) => p.inStock);

  const sorted = [...list];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      sorted.sort((a, b) => b.discountPct - a.discountPct);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }
  return sorted;
}

export function getBrands(list: Product[]) {
  const counts = new Map<string, number>();
  for (const p of list) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getAllProducts() {
  return products;
}

export function getCategories() {
  return categories;
}

/** Other products with the exact same composition, cheapest first. */
export function getSubstitutes(p: Product) {
  return products
    .filter((x) => x.id !== p.id && x.composition === p.composition)
    .sort((a, b) => a.price - b.price);
}

export function getRelated(p: Product, limit = 10) {
  return products
    .filter((x) => x.id !== p.id && x.composition !== p.composition)
    .map((x) => ({
      x,
      s: (x.categorySlug === p.categorySlug ? 1 : 0) + x.tags.filter((t) => p.tags.includes(t)).length * 2,
    }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.x);
}

export function getDeals(limit = 12) {
  return [...products]
    .filter((p) => p.inStock && !p.rxRequired)
    .sort((a, b) => b.discountPct - a.discountPct)
    .slice(0, limit);
}

export function getBestsellers(limit = 12) {
  return [...products].sort((a, b) => b.ratingCount - a.ratingCount).slice(0, limit);
}

export function suggest(q: string, limit = 6) {
  if (!q.trim()) return [];
  return getScopedProducts({ q }).slice(0, limit);
}
