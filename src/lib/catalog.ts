import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, getTableColumns, gt, gte, inArray, lte, ne, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import type { Category, Product } from "@/data/types";

// All catalogue reads go through this module. Money is stored in paise and exposed in rupees.

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

// ---- Row mapping

const productColumns = { ...getTableColumns(products), categorySlug: categories.slug };
type ProductRow = typeof products.$inferSelect & { categorySlug: string };

export function toProduct(r: ProductRow): Product {
  const mrp = r.mrpPaise / 100;
  const price = r.pricePaise / 100;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    manufacturer: r.manufacturer,
    categorySlug: r.categorySlug,
    form: r.form,
    packSize: r.packSize,
    mrp,
    price,
    discountPct: mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0,
    rxRequired: r.rxRequired,
    composition: r.composition,
    description: r.description,
    uses: r.uses,
    sideEffects: r.sideEffects,
    howToUse: r.howToUse,
    safetyAdvice: r.safetyAdvice,
    storage: r.storage,
    rating: r.rating,
    ratingCount: r.ratingCount,
    inStock: r.stock > 0,
    stock: r.stock,
    tags: r.tags,
    imageUrl: r.imageUrl,
  };
}

function toCategory(r: typeof categories.$inferSelect): Category {
  return { slug: r.slug, name: r.name, icon: r.icon, color: r.color, description: r.description };
}

const selectProducts = () => db.select(productColumns).from(products).innerJoin(categories, eq(products.categoryId, categories.id));

// ---- Search and filters

const discountPct = sql<number>`round(((${products.mrpPaise} - ${products.pricePaise}) * 100.0) / nullif(${products.mrpPaise}, 0))`;
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => `\\${m}`);

/** 3 = name starts with q, 2 = name/brand contains q, 1 = other text fields contain q, 0 = no match. */
function searchScore(q: string) {
  const contains = `%${escapeLike(q)}%`;
  const prefix = `${escapeLike(q)}%`;
  return sql<number>`case
    when ${products.name} ilike ${prefix} then 3
    when ${products.name} ilike ${contains} or ${products.brand} ilike ${contains} then 2
    when ${products.composition} ilike ${contains} or ${products.manufacturer} ilike ${contains}
      or array_to_string(${products.tags}, ' ') ilike ${contains}
      or array_to_string(${products.uses}, ' ') ilike ${contains}
      or ${categories.name} ilike ${contains} then 1
    else 0 end`;
}

/** Conditions that define the page scope (category / search / concern tag), before user filters. */
function scopeConditions(f: Pick<ProductFilters, "category" | "q" | "tag">): SQL[] {
  const c: SQL[] = [eq(products.active, true)];
  if (f.category) c.push(eq(categories.slug, f.category));
  if (f.tag) c.push(sql`${f.tag} = any(${products.tags})`);
  if (f.q) c.push(gt(searchScore(f.q), 0));
  return c;
}

function filterConditions(f: ProductFilters): SQL[] {
  const c = scopeConditions(f);
  if (f.brands?.length) c.push(inArray(products.brand, f.brands));
  if (f.minPrice != null) c.push(gte(products.pricePaise, Math.round(f.minPrice * 100)));
  if (f.maxPrice != null) c.push(lte(products.pricePaise, Math.round(f.maxPrice * 100)));
  if (f.minDiscount != null) c.push(gte(discountPct, f.minDiscount));
  if (f.type === "rx") c.push(eq(products.rxRequired, true));
  if (f.type === "otc") c.push(eq(products.rxRequired, false));
  if (f.inStock) c.push(gt(products.stock, 0));
  return c;
}

function orderBy(f: ProductFilters): SQL[] {
  const stable = [asc(products.createdAt), asc(products.id)];
  switch (f.sort) {
    case "price-asc":
      return [asc(products.pricePaise), ...stable];
    case "price-desc":
      return [desc(products.pricePaise), ...stable];
    case "discount":
      return [desc(discountPct), ...stable];
    case "rating":
      return [desc(products.rating), ...stable];
    default:
      return f.q ? [desc(searchScore(f.q)), ...stable] : stable;
  }
}

export async function getProducts(f: ProductFilters, limit?: number): Promise<Product[]> {
  const query = selectProducts()
    .where(and(...filterConditions(f)))
    .orderBy(...orderBy(f));
  const rows = limit ? await query.limit(limit) : await query;
  return rows.map(toProduct);
}

/** Everything a category/search listing page needs: filtered results, scope size and brand facets. */
export async function getListing(f: ProductFilters) {
  const scope = and(...scopeConditions(f));
  const [results, [{ total }], brands] = await Promise.all([
    getProducts(f),
    db.select({ total: sql<number>`count(*)::int` }).from(products).innerJoin(categories, eq(products.categoryId, categories.id)).where(scope),
    db
      .select({ name: products.brand, count: sql<number>`count(*)::int` })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(scope)
      .groupBy(products.brand)
      .orderBy(desc(sql`count(*)`), asc(products.brand)),
  ]);
  return { results, total, brands };
}

export function suggest(q: string, limit = 6) {
  return q.trim() ? getProducts({ q: q.trim() }, limit) : Promise.resolve([]);
}

// ---- Single products and recommendations

export async function getProductBySlug(slug: string) {
  const [row] = await selectProducts()
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);
  return row ? toProduct(row) : undefined;
}

/** Active products by id, e.g. for cart lines and order creation. Missing or inactive ids are omitted. */
export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const rows = await selectProducts().where(and(inArray(products.id, ids), eq(products.active, true)));
  return rows.map(toProduct);
}

/** Other products with the exact same composition, cheapest first. */
export async function getSubstitutes(p: Product) {
  if (!p.composition) return [];
  const rows = await selectProducts()
    .where(and(eq(products.active, true), eq(products.composition, p.composition), ne(products.id, p.id)))
    .orderBy(asc(products.pricePaise));
  return rows.map(toProduct);
}

/** Same category scores 1, each shared tag scores 2; substitutes are excluded (shown separately). */
export async function getRelated(p: Product, limit = 10) {
  const tags = sql`array[${sql.join(
    p.tags.map((t) => sql`${t}`),
    sql`, `,
  )}]::text[]`;
  const score = sql<number>`(case when ${categories.slug} = ${p.categorySlug} then 1 else 0 end)
    + 2 * cardinality(array(select unnest(${products.tags}) intersect select unnest(${tags})))`;
  const rows = await selectProducts()
    .where(and(eq(products.active, true), ne(products.id, p.id), ne(products.composition, p.composition), gt(score, 0)))
    .orderBy(desc(score), asc(products.createdAt))
    .limit(limit);
  return rows.map(toProduct);
}

export async function getDeals(limit = 12) {
  const rows = await selectProducts()
    .where(and(eq(products.active, true), gt(products.stock, 0), eq(products.rxRequired, false)))
    .orderBy(desc(discountPct), asc(products.createdAt))
    .limit(limit);
  return rows.map(toProduct);
}

export async function getBestsellers(limit = 12) {
  const rows = await selectProducts()
    .where(eq(products.active, true))
    .orderBy(desc(products.ratingCount))
    .limit(limit);
  return rows.map(toProduct);
}

// ---- Categories (cached per request: the header, footer and page all ask for them)

export const getCategories = cache(async (): Promise<Category[]> => {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  return rows.map(toCategory);
});

export async function getCategoryBySlug(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}
