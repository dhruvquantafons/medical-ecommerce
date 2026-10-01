// Fills the database with the demo collections and products from src/db/seed/.
// Safe to run repeatedly: existing rows (matched by slug / id) are updated, not duplicated.
// Products and collections created in the admin panel are never touched.
import "./env";
import { count, eq, inArray, sql } from "drizzle-orm";
import { db } from "../src/db";
import { categories, orderItems, products } from "../src/db/schema";
import { categories as seedCategories } from "../src/db/seed/categories";
import { products as seedProducts } from "../src/db/seed/products";

const paise = (rupees: number) => Math.round(rupees * 100);

// The original pharmacy demo catalogue (before the switch to own-brand supplements).
const LEGACY_PRODUCT_ID = /^p\d{3}$/;
const LEGACY_CATEGORY_SLUGS = [
  "medicines", "healthcare-devices", "vitamins-supplements", "diabetes-care", "personal-care",
  "skin-care", "ayurveda", "baby-mom-care", "covid-essentials", "sexual-wellness",
];

/** Removes the legacy demo data. Products that appear in past orders are deactivated instead of deleted. */
async function retireLegacyDemo() {
  const legacy = (await db.select({ id: products.id }).from(products)).map((p) => p.id).filter((id) => LEGACY_PRODUCT_ID.test(id));
  if (legacy.length) {
    const ordered = new Set(
      (await db.selectDistinct({ id: orderItems.productId }).from(orderItems).where(inArray(orderItems.productId, legacy))).map((r) => r.id),
    );
    const removable = legacy.filter((id) => !ordered.has(id));
    if (removable.length) await db.delete(products).where(inArray(products.id, removable));
    if (ordered.size) await db.update(products).set({ active: false }).where(inArray(products.id, [...ordered]));
    console.log(`Legacy demo products: ${removable.length} deleted, ${ordered.size} deactivated (kept for order history).`);
  }
  const emptyLegacy = await db
    .select({ id: categories.id })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .where(inArray(categories.slug, LEGACY_CATEGORY_SLUGS))
    .groupBy(categories.id)
    .having(eq(count(products.id), 0));
  if (emptyLegacy.length) {
    await db.delete(categories).where(inArray(categories.id, emptyLegacy.map((c) => c.id)));
    console.log(`Legacy demo categories deleted: ${emptyLegacy.length}.`);
  }
}

async function main() {
  const catRows = await db
    .insert(categories)
    .values(seedCategories.map((c, i) => ({ ...c, sortOrder: i })))
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        icon: sql`excluded.icon`,
        color: sql`excluded.color`,
        sortOrder: sql`excluded.sort_order`,
      },
    })
    .returning({ id: categories.id, slug: categories.slug });
  const categoryId = new Map(catRows.map((c) => [c.slug, c.id]));

  // Stagger created_at so "relevance" order matches the seed file order.
  const base = Date.now() - seedProducts.length * 1000;
  const values = seedProducts.map((p, i) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    manufacturer: p.manufacturer,
    categoryId: categoryId.get(p.categorySlug)!,
    form: p.form,
    packSize: p.packSize,
    mrpPaise: paise(p.mrp),
    pricePaise: paise(p.price),
    rxRequired: p.rxRequired,
    composition: p.composition,
    description: p.description,
    uses: p.uses,
    sideEffects: p.sideEffects,
    howToUse: p.howToUse,
    safetyAdvice: p.safetyAdvice,
    storage: p.storage,
    tags: p.tags,
    rating: p.rating,
    ratingCount: p.ratingCount,
    stock: p.inStock ? 25 + ((i * 37) % 150) : 0,
    createdAt: new Date(base + i * 1000),
  }));

  const excluded = (col: string) => sql.raw(`excluded.${col}`);
  await db
    .insert(products)
    .values(values)
    .onConflictDoUpdate({
      target: products.id,
      set: Object.fromEntries(
        (
          [
            ["slug", "slug"], ["name", "name"], ["brand", "brand"], ["manufacturer", "manufacturer"],
            ["categoryId", "category_id"], ["form", "form"], ["packSize", "pack_size"], ["mrpPaise", "mrp_paise"],
            ["pricePaise", "price_paise"], ["rxRequired", "rx_required"], ["composition", "composition"],
            ["description", "description"], ["uses", "uses"], ["sideEffects", "side_effects"], ["howToUse", "how_to_use"],
            ["safetyAdvice", "safety_advice"], ["storage", "storage"], ["tags", "tags"], ["rating", "rating"],
            ["ratingCount", "rating_count"], ["stock", "stock"],
          ] as const
        ).map(([key, col]) => [key, excluded(col)]),
      ),
    });

  await retireLegacyDemo();
  console.log(`Seeded ${catRows.length} collections and ${values.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
