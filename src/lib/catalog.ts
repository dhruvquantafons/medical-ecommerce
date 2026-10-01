import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, exists, getTableColumns, gt, inArray, ne, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, productImages, products } from "@/db/schema";
import type { Category, Product } from "@/data/types";

// All catalogue reads go through this module. Money is stored in paise and exposed in rupees.

import { SORT_KEYS, type SortKey } from "./catalog-types";
import { productImagePath } from "./files";

export type { SortKey };

export interface ProductFilters {
  category?: string;
  q?: string;
  tag?: string;
  sort?: SortKey;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseFilters(sp: RawParams): ProductFilters {
  const sort = first(sp.sort) as SortKey;
  return {
    q: first(sp.q)?.trim() || undefined,
    tag: first(sp.tag) || undefined,
    sort: SORT_KEYS.includes(sort) ? sort : "featured",
  };
}

// ---- Row mapping

/** A product's photo URLs in display order: uploads are served by /api/product-images/[id]. */
export const productImageUrls = sql<string[]>`coalesce((
  select array_agg(coalesce(${productImages.url}, ${productImagePath("")} || ${productImages.id}) order by ${productImages.sortOrder}, ${productImages.createdAt})
  from ${productImages} where ${productImages.productId} = ${products.id}
), '{}'::text[])`;

const productColumns = { ...getTableColumns(products), categorySlug: categories.slug, categoryName: categories.name, images: productImageUrls };
type ProductRow = typeof products.$inferSelect & { categorySlug: string; categoryName?: string; images: string[] };

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
    categoryName: r.categoryName,
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
    images: r.images,
  };
}

function toCategory(r: typeof categories.$inferSelect): Category {
  return { slug: r.slug, name: r.name, icon: r.icon, color: r.color, description: r.description };
}

const selectProducts = () => db.select(productColumns).from(products).innerJoin(categories, eq(products.categoryId, categories.id));

// ---- Search and filters

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

function orderBy(f: ProductFilters): SQL[] {
  const stable = [asc(products.createdAt), asc(products.id)];
  switch (f.sort) {
    case "price-asc":
      return [asc(products.pricePaise), ...stable];
    case "price-desc":
      return [desc(products.pricePaise), ...stable];
    case "rating":
      return [desc(products.rating), ...stable];
    default:
      // "Featured": best sellers first (or best search match when searching).
      return f.q ? [desc(searchScore(f.q)), ...stable] : [desc(products.ratingCount), ...stable];
  }
}

export async function getProducts(f: ProductFilters, limit?: number): Promise<Product[]> {
  const query = selectProducts()
    .where(and(...scopeConditions(f)))
    .orderBy(...orderBy(f));
  const rows = limit ? await query.limit(limit) : await query;
  return rows.map(toProduct);
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

/** Same collection scores 1, each shared tag scores 2. */
export async function getRelated(p: Product, limit = 10) {
  const tags = sql`array[${sql.join(
    p.tags.map((t) => sql`${t}`),
    sql`, `,
  )}]::text[]`;
  const score = sql<number>`(case when ${categories.slug} = ${p.categorySlug} then 1 else 0 end)
    + 2 * cardinality(array(select unnest(${products.tags}) intersect select unnest(${tags})))`;
  const rows = await selectProducts()
    .where(and(eq(products.active, true), ne(products.id, p.id), gt(score, 0)))
    .orderBy(desc(score), asc(products.createdAt))
    .limit(limit);
  return rows.map(toProduct);
}

export async function getBestsellers(limit = 12) {
  const rows = await selectProducts()
    .where(eq(products.active, true))
    .orderBy(desc(products.ratingCount), asc(products.createdAt))
    .limit(limit);
  return rows.map(toProduct);
}

export async function getNewArrivals(limit = 12) {
  const rows = await selectProducts()
    .where(eq(products.active, true))
    .orderBy(desc(products.createdAt), asc(products.id))
    .limit(limit);
  return rows.map(toProduct);
}

/** Ids of the top sellers, used for the "Best seller" badge. */
export const getBestsellerIds = cache(async (n = 3) => new Set((await getBestsellers(n)).map((p) => p.id)));

// ---- Collections (the `categories` table; cached per request: header, footer and page all ask)

/** Store-facing collections: only those with at least one active product. Admin uses its own query. */
export const getCategories = cache(async (): Promise<Category[]> => {
  const hasActive = db
    .select({ one: sql`1` })
    .from(products)
    .where(and(eq(products.categoryId, categories.id), eq(products.active, true)));
  const rows = await db.select().from(categories).where(exists(hasActive)).orderBy(asc(categories.sortOrder), asc(categories.name));
  return rows.map(toCategory);
});

export async function getCategoryBySlug(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}
