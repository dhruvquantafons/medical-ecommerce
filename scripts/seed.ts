// Fills the database with the demo categories and products from src/db/seed/.
// Safe to run repeatedly: existing rows (matched by slug / id) are updated, not duplicated.
import "./env";
import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { categories, products } from "../src/db/schema";
import { categories as seedCategories } from "../src/db/seed/categories";
import { products as seedProducts } from "../src/db/seed/products";

const paise = (rupees: number) => Math.round(rupees * 100);

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

  console.log(`Seeded ${catRows.length} categories and ${values.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
