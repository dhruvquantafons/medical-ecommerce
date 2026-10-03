// Fills the database with the collections and products from src/db/seed/.
// Safe to run repeatedly: existing rows (matched by slug / id) are updated, not duplicated.
// Note: re-running resets seeded products' details, prices and stock to the seed file's values.
// Photos are only added to products that have none, so photos managed in the admin panel are kept.
// Products and collections created in the admin panel are never touched.
import "./env";
import { readFileSync } from "node:fs";
import path from "node:path";
import { count, eq, inArray, sql } from "drizzle-orm";
import { db } from "../src/db";
import { categories, orderItems, productImages, products } from "../src/db/schema";
import { categories as seedCategories } from "../src/db/seed/categories";
import { productPhotos, products as seedProducts } from "../src/db/seed/products";
import { PRODUCT_IMAGE_TYPES, sniffType } from "../src/lib/files";

const paise = (rupees: number) => Math.round(rupees * 100);

// Earlier demo catalogues: the original pharmacy demo (p001…) and the placeholder supplements (s001…).
const LEGACY_PRODUCT_ID = /^[ps]\d{3}$/;
const LEGACY_CATEGORY_SLUGS = [
  "medicines", "healthcare-devices", "vitamins-supplements", "diabetes-care", "personal-care",
  "skin-care", "ayurveda", "baby-mom-care", "covid-essentials", "sexual-wellness",
  "immunity-energy", "skin-hair", "sleep-stress",
];

const PHOTO_DIR = path.join(__dirname, "../src/db/seed/photos");
const PHOTO_TYPES: readonly string[] = PRODUCT_IMAGE_TYPES;

/** Adds each seeded product's photos, unless it already has photos (e.g. managed in the admin panel). */
async function seedPhotos() {
  const ids = Object.keys(productPhotos);
  const withPhotos = new Set(
    (await db.selectDistinct({ id: productImages.productId }).from(productImages).where(inArray(productImages.productId, ids))).map((r) => r.id),
  );
  let added = 0;
  for (const [productId, files] of Object.entries(productPhotos)) {
    if (withPhotos.has(productId) || !files.length) continue;
    const rows = files.map((file, sortOrder) => {
      const data = readFileSync(path.join(PHOTO_DIR, file));
      const mimeType = sniffType(data);
      if (!mimeType || !PHOTO_TYPES.includes(mimeType)) throw new Error(`${file}: not a JPG, PNG or WEBP image`);
      return { productId, sortOrder, data, mimeType, sizeBytes: data.length };
    });
    await db.insert(productImages).values(rows);
    added += rows.length;
  }
  console.log(`Product photos added: ${added}.`);
}

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
    stock: p.stock,
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

  await seedPhotos();
  await retireLegacyDemo();
  console.log(`Seeded ${catRows.length} collections and ${values.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
