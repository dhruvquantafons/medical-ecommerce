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
import { categories, catalogItems, employees, orderItems, productImages, products } from "../src/db/schema";
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

  // ---- Employees (skip if already seeded)
  const [{ n: empCount }] = await db.select({ n: count() }).from(employees);
  if (empCount === 0) {
    const seedEmployees = [
      {
        name: "Dr. Sarah Jenkins",
        role: "Lead Pharmacologist",
        bio: "Expert in pharmacokinetic modeling and drug formulation.",
        photoUrl: "https://i.pravatar.cc/150?img=47",
        sortOrder: 0,
        active: true,
      },
      {
        name: "Marcus Chen",
        role: "Supply Chain Director",
        bio: "Optimizing cold-chain distribution for sensitive biotech products.",
        photoUrl: "https://i.pravatar.cc/150?img=11",
        sortOrder: 1,
        active: true,
      },
      {
        name: "Elena Rodriguez",
        role: "Quality Assurance Lead",
        bio: "Ensuring every batch meets our stringent quality standards.",
        photoUrl: "https://i.pravatar.cc/150?img=5",
        sortOrder: 2,
        active: true,
      },
      {
        name: "David Kim",
        role: "Digital Strategist",
        bio: "Driving our digital-first approach to modern pharmacy access.",
        photoUrl: "https://i.pravatar.cc/150?img=12",
        sortOrder: 3,
        active: true,
      },
      {
        name: "Dr. Michael Chen",
        role: "Clinical Research Director",
        bio: "Pioneering breakthrough trials in targeted biological therapies.",
        photoUrl: "https://i.pravatar.cc/150?img=33",
        sortOrder: 4,
        active: true,
      },
      {
        name: "Sophia Patel",
        role: "Regulatory Affairs Manager",
        bio: "Navigating complex global health compliance for innovative formulations.",
        photoUrl: "https://i.pravatar.cc/150?img=43",
        sortOrder: 5,
        active: true,
      },
    ];
    await db.insert(employees).values(seedEmployees);
    console.log(`Seeded ${seedEmployees.length} employees.`);
  } else {
    console.log(`Employees already seeded (${empCount} rows), skipping.`);
  }

  // ---- Catalog items (skip if already seeded)
  const [{ n: catalogCount }] = await db.select({ n: count() }).from(catalogItems);
  if (catalogCount === 0) {
    const salt = (name: string, amount: string, percentage: number, purpose: string, casNumber: string) =>
      JSON.stringify({ name, amount, percentage, purpose, casNumber });
    const salts = (...entries: Parameters<typeof salt>[]) =>
      `[${entries.map(e => salt(...e)).join(",")}]` as unknown as string;

    const seedCatalogItems = [
      {
        name: "Synspas+",
        brand: "SYNCTIUM Healthcare",
        category: "Prescription (Rx)",
        description: "Targeted hepatic lipid and metabolic homeostasis formulation engineered with Oleoylethanolamide, Pantethine, and L-Valine.",
        dosageForm: "Tablet",
        digitalVerifiedId: "SNC-PTH-88301-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.9,
        reviewsCount: 384,
        priceEstimate: "$29.50",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/synspas.jpg",
        imageGradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fff1f2 100%)",
        molecularFormula: "C20H39NO2 + C11H22N2O6S2 + C5H11NO2",
        bioavailability: "89.6%",
        halfLife: "3.8 - 5.5 Hours",
        salts: salts(
          ["Oleoylethanolamide (OEA)", "200 mg", 45, "PPAR-α Receptor Lipid Signaling", "111-58-0"],
          ["Pantethine Pure", "100 mg", 25, "CoA Precursor & Lipid Metabolism", "16816-67-4"],
          ["L-Valine BCAA", "150 mg", 30, "Essential Amino Acid & Protein Matrix", "72-18-4"],
        ),
        sortOrder: 0, active: true,
      },
      {
        name: "NACPHYLIN",
        brand: "SYNCTIUM Pharma Labs",
        category: "Prescription (Rx)",
        description: "A New Airway Regulator with added Anti-Inflammatory Action. N-Acetylcysteine acts as a mucolytic; Acebrophylline is a new generation airway mucus regulator.",
        dosageForm: "Tablet",
        digitalVerifiedId: "SNC-NAC-99102-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.85,
        reviewsCount: 312,
        priceEstimate: "$18.50",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/catalog_img_1.jpg",
        imageGradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #e0f2fe 100%)",
        molecularFormula: "C5H9NO3 + C11H14N4O3",
        bioavailability: "98.0%",
        halfLife: "Sustained Action",
        salts: salts(
          ["N-Acetylcysteine", "600 mg", 85, "Mucolytic & Antioxidant", "616-91-1"],
          ["Acebrophylline", "100 mg", 15, "Airway Mucus Regulator", "613-25-2"],
        ),
        sortOrder: 1, active: true,
      },
      {
        name: "AXONERGIC",
        brand: "SYNCTIUM Pharma Labs",
        category: "Prescription (Rx)",
        description: "Methylcobalamin 1000 mcg + Thiamine Hydrochloride 100 mg + Pyridoxine Hydrochloride 100 mg + Niacinamide 100 mg / ml Injection. The Neuro Regenerating Power for Complete Health.",
        dosageForm: "Injectable",
        digitalVerifiedId: "SNC-PTH-33901-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.9,
        reviewsCount: 480,
        priceEstimate: "$16.00",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/catalog_img_2.jpg",
        imageGradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #f0f9ff 100%)",
        molecularFormula: "C8H8O3 + C10H20O + C10H16O",
        bioavailability: "94.5%",
        halfLife: "Rapid Transdermal Absorption",
        salts: salts(
          ["Methylcobalamin", "1000 mcg", 40, "Nerve Regeneration", "13422-55-4"],
          ["Thiamine Hydrochloride", "100 mg", 20, "Nerve Pain Treatment", "67-03-8"],
          ["Pyridoxine Hydrochloride", "100 mg", 20, "Homocysteine Reduction", "58-56-0"],
          ["Niacinamide", "100 mg", 20, "Brain Function Boost", "98-92-0"],
        ),
        sortOrder: 2, active: true,
      },
      {
        name: "Rabocap-Plus",
        brand: "SYNCTIUM Pharma Labs",
        category: "Prescription (Rx)",
        description: "Rabeprazole (Enteric Coated) 20 mg + Levosulpiride 75 mg (Sustained Release) Capsules. The Clinically Proven Treatment of GI Discomforts.",
        dosageForm: "Capsule",
        digitalVerifiedId: "SNC-PTH-55672-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.7,
        reviewsCount: 318,
        priceEstimate: "$36.00",
        availability: "Prescription Required",
        imageUrl: "/portfolio/assets/catalog_img_3.jpg",
        imageGradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 50%, #faf5ff 100%)",
        molecularFormula: "C17H17Cl2N·HCl",
        bioavailability: "44.0%",
        halfLife: "26.0 Hours",
        salts: salts(
          ["Rabeprazole", "20 mg", 21, "Proton Pump Inhibitor (Enteric Coated)", "117976-89-3"],
          ["Levosulpiride", "75 mg", 79, "Prokinetic Agent (Sustained Release)", "23672-07-3"],
        ),
        sortOrder: 3, active: true,
      },
      {
        name: "Diptor-F",
        brand: "SYNCTIUM Pharma Labs",
        category: "Prescription (Rx)",
        description: "Rosuvastatin 10 mg + Fenofibrate 160 mg Tablets. The Most Advance and Effective Solution for Indian Dyslipiemics associated with Diabetic and Hypertension.",
        dosageForm: "Tablet",
        digitalVerifiedId: "SNC-PTH-33100-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.85,
        reviewsCount: 249,
        priceEstimate: "$41.50",
        availability: "Prescription Required",
        imageUrl: "/portfolio/assets/catalog_img_4.jpg",
        imageGradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #f0f9ff 100%)",
        molecularFormula: "C4H12NO7P·Na + CaCO3",
        bioavailability: "0.64%",
        halfLife: "10+ Years Bone Depot",
        salts: salts(
          ["Rosuvastatin", "10 mg", 6, "HMG-CoA Reductase Inhibitor", "287714-41-4"],
          ["Fenofibrate", "160 mg", 94, "PPAR-alpha Agonist (Lipid Regulation)", "49562-28-9"],
        ),
        sortOrder: 4, active: true,
      },
      {
        name: "Diptor 10",
        brand: "Synokem Pharma",
        category: "Prescription (Rx)",
        description: "In Atherosclerosis Regression & Dyslipidemia. Power That Lowers More Than Cholesterol.",
        dosageForm: "Tablet",
        digitalVerifiedId: "SNC-PTH-44210-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.9,
        reviewsCount: 691,
        priceEstimate: "$19.00",
        availability: "Prescription Required",
        imageUrl: "/portfolio/assets/catalog_img_5.jpg",
        imageGradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #f0fdfa 100%)",
        molecularFormula: "C15H10I4NNaO4",
        bioavailability: "40.0 - 80.0%",
        halfLife: "6.0 - 7.0 Days",
        salts: salts(
          ["Levothyroxine Sodium Salt", "100 mcg", 90, "Thyroid Hormone Replacement", "55-03-8"],
          ["Acacia Gum Hydrocolloid", "50 mg", 10, "Stabilizing Binder Salt", "9000-01-5"],
        ),
        sortOrder: 5, active: true,
      },
      {
        name: "Syntil-CV",
        brand: "Cefuroxime Axetil 500 mg + Potassium Clavulanate 125 mg Tablets",
        category: "Prescription (Rx)",
        description: "The Super Antibiotic Combination. Offers much wider spectrum than other oral Cephalosporins.",
        dosageForm: "Tablet",
        digitalVerifiedId: "SNC-PTH-44109-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.8,
        reviewsCount: 518,
        priceEstimate: "$18.90",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/catalog_img_6.jpg",
        imageGradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #f0fdf4 100%)",
        molecularFormula: "C21H25ClN2O3·2HCl",
        bioavailability: "88.0%",
        halfLife: "8.3 Hours",
        salts: salts(
          ["Cefuroxime Axetil", "500 mg", 80, "Broad-Spectrum Cephalosporin Antibiotic", "64544-07-6"],
          ["Potassium Clavulanate", "125 mg", 20, "Beta-Lactamase Inhibitor", "61177-45-5"],
        ),
        sortOrder: 6, active: true,
      },
      {
        name: "AXONERGIC-AT",
        brand: "SYNCTIUM Pharma Labs",
        category: "Prescription (Rx)",
        description: "Pregabalin 75 mg + Amitriptyline 10 mg Tablets. Ensure SPEEDY Relief — The Pivotal Combination For Enduring Relief From Neuropathic Pain.",
        dosageForm: "Tablet",
        digitalVerifiedId: "SNC-PTH-88011-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.6,
        reviewsCount: 780,
        priceEstimate: "$12.50",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/catalog_img_7.jpg",
        imageGradient: "linear-gradient(135deg, #0284c7 0%, #7dd3fc 50%, #f0f9ff 100%)",
        molecularFormula: "NaCl + C5H12O5",
        bioavailability: "~100% (Topical)",
        halfLife: "N/A (Topical)",
        salts: salts(
          ["Pregabalin", "75 mg", 88, "Neuropathic Pain Relief", "148553-50-8"],
          ["Amitriptyline", "10 mg", 12, "Tricyclic Antidepressant", "50-48-6"],
        ),
        sortOrder: 7, active: true,
      },
      {
        name: "Diptor 20",
        brand: "SYNCTIUM Pharma Labs",
        category: "Over-The-Counter (OTC)",
        description: "In Atherosclerosis Regression & Dyslipidemia. A Valuable Statin For Life.",
        dosageForm: "Capsule",
        digitalVerifiedId: "SNC-PTH-60033-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.75,
        reviewsCount: 943,
        priceEstimate: "$22.00",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/catalog_img_8.jpg",
        imageGradient: "linear-gradient(135deg, #f59e0b 0%, #fde68a 50%, #fffbeb 100%)",
        molecularFormula: "Live Cultures Matrix",
        bioavailability: "85.0%",
        halfLife: "12.0 Hours (Transit)",
        salts: salts(
          ["Lactobacillus acidophilus", "5B CFU", 50, "Gut Flora Restoration", "53103-98-3"],
          ["Bifidobacterium longum", "3B CFU", 30, "Colon Health Microbiome", "216816-29-4"],
          ["Inulin Prebiotic Salt", "200 mg", 20, "Probiotic Growth Medium", "9005-80-5"],
        ),
        sortOrder: 8, active: true,
      },
      {
        name: "SYNKALI-B6",
        brand: "SYNCTIUM Urology",
        category: "Over-The-Counter (OTC)",
        description: "Potassium Citrate, Citric Acid & Vitamin B6 Solution. Systemic alkalizer used for the treatment of renal tubular acidosis.",
        dosageForm: "Syrup",
        digitalVerifiedId: "SNC-PTH-71509-V",
        googleIndexed: true,
        eCommerceReady: true,
        rating: 4.85,
        reviewsCount: 1204,
        priceEstimate: "$14.99",
        availability: "In Stock",
        imageUrl: "/portfolio/assets/catalog_img_9.jpg",
        imageGradient: "linear-gradient(135deg, #ea580c 0%, #fb923c 50%, #fff7ed 100%)",
        molecularFormula: "C13H18O2·C6H14N2O2",
        bioavailability: "87.0%",
        halfLife: "2.0 Hours",
        salts: salts(
          ["Potassium Citrate", "1100 mg", 60, "Systemic Alkalizer", "6100-05-6"],
          ["Citric Acid", "334 mg", 30, "Urine Alkalizer", "77-92-9"],
          ["Pyridoxine Hydrochloride", "1.5 mg", 10, "Vitamin B6 Supplement", "58-56-0"],
        ),
        sortOrder: 9, active: true,
      },
    ];
    await db.insert(catalogItems).values(seedCatalogItems);
    console.log(`Seeded ${seedCatalogItems.length} catalog items.`);
  } else {
    console.log(`Catalog items already seeded (${catalogCount} rows), skipping.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
