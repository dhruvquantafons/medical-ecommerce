import type { Product, ProductForm } from "@/data/types";

// Catalogue used by `npm run db:seed`. Product details come from the packs and brochures.
// PLACEHOLDERS: MRP, selling price and stock are made-up values (no real figures yet), and
// LYCOTIUM's pack count is assumed. Update them in the admin panel.
// Descriptions use consumer-friendly wording, not the doctor-facing brochure claims.

const BRAND = "Syncytium Health";

type Seed = {
  id: string;
  slug: string;
  name: string;
  cat: string;
  form: ProductForm;
  pack: string;
  mrp: number;
  price: number;
  stock: number;
  ingredients: string;
  desc: string;
  benefits: string[];
  how: string;
  tags: string[];
  rx?: boolean;
  safety?: string[];
  storage?: string;
  /** Files in src/db/seed/photos/, in display order. */
  photos: string[];
};

const supplementSafety = [
  "Not intended to diagnose, treat, cure or prevent any disease.",
  "Do not exceed the recommended dose.",
  "Consult your doctor before use if you are pregnant, nursing, taking medication or have a medical condition.",
  "Keep out of reach of children.",
];
const storage = "Store in a cool, dry place below 25°C, away from direct sunlight.";
const asDirected = "Use as directed by your physician.";

const seeds: Seed[] = [
  {
    id: "hep-ob",
    slug: "hep-ob-tablets",
    name: "HEP-OB Tablets",
    cat: "liver-care",
    form: "tablet",
    pack: "Strip of 10 tablets",
    mrp: 349,
    price: 315,
    stock: 64,
    ingredients: "Oleoylethanolamide (OEA) 200 mg, Pantethine 75 mg, L-Valine 10 mg",
    desc: [
      "A targeted nutritional formula combining oleoylethanolamide (OEA), pantethine and the amino acid L-valine to support liver health and healthy fat metabolism.",
      "",
      "OLEOYLETHANOLAMIDE",
      "- OEA works to activate something called PPARα (Peroxisome Proliferator-Activated Receptor Alpha) & simultaneously ramps up fat-burning and decreases fat storage.",
      "- Responsible for the feeling of satiety following meals",
      "- Oral supplementation of OEA can be recommended for weight loss",
      "",
      "PANTETHINE",
      "- Used for lowering levels of cholesterol and triglycerides in people with diabetes or high levels of lipoproteins in the blood (hyperlipoproteinemia)",
      "- May transfer fat from the liver and viscera to the subcutaneous tissue.",
      "- Increase the concentrations of chemicals that lower blood cholesterol & triglycerides.",
      "",
      "L-VALINE",
      "- A branched-chain essential amino acid (BCAA) which has stimulant activity thus promotes muscle growth and tissue repair",
      "- Promotes mental vigor, muscle coordination, and calm emotions",
      "- Also lowers elevated blood sugar levels and increases growth hormone production",
    ].join("\n"),
    benefits: ["Supports liver health", "Supports healthy fat metabolism", "Helps you feel fuller after meals", "Supports healthy cholesterol levels"],
    how: asDirected,
    tags: ["liver", "metabolism", "cholesterol", "weight"],
    photos: ["hep-ob-tablets.jpg"],
  },
  {
    id: "syn-gut",
    slug: "syn-gut-suspension",
    name: "SYN-GUT Suspension",
    cat: "gut-health",
    form: "syrup",
    pack: "10 mini bottles of 5 ml",
    mrp: 499,
    price: 449,
    stock: 120,
    ingredients: "Bacillus clausii 2 billion spores per 5 ml",
    desc: "A ready-to-drink probiotic with 2 billion Bacillus clausii spores in every mini bottle, to help restore and maintain a healthy balance of gut flora.",
    benefits: ["Helps restore healthy gut flora", "Supports digestion", "Supports gut health during and after a course of antibiotics", "Supports natural production of B vitamins"],
    how: `Shake well before use. ${asDirected}`,
    tags: ["gut", "probiotic", "digestion"],
    safety: ["For oral use only. Do not inject.", ...supplementSafety],
    photos: ["syn-gut-suspension.jpg"],
  },
  {
    id: "calcitium-d3",
    slug: "calcitium-d3-nano-shots",
    name: "Calcitium-D3 Nano Shots",
    cat: "bone-joint",
    form: "syrup",
    pack: "4 ready-to-drink shots of 5 ml",
    mrp: 249,
    price: 229,
    stock: 80,
    rx: true,
    ingredients: "Vitamin D3 (cholecalciferol) 60,000 IU per 5 ml",
    desc: "A high-strength vitamin D3 oral solution in ready-to-drink 5 ml shots, with a sugar-free orange flavour. This is a prescription product.",
    benefits: ["Supports healthy bones and teeth", "Supports normal calcium absorption", "Supports normal immune function", "Sugar-free orange flavour"],
    how: "Take only as prescribed by your doctor. Ready to drink.",
    tags: ["vitamin d", "bones", "immunity"],
    safety: [
      "Prescription product: take only under medical supervision.",
      "High-strength vitamin D: do not take more often than prescribed.",
      "Keep out of reach of children.",
    ],
    photos: ["calcitium-d3-nano-shots.jpg"],
  },
  {
    id: "syn-ortho",
    slug: "syn-ortho-roll-on-oil",
    name: "Syn Ortho Roll-on Oil",
    cat: "bone-joint",
    form: "cream",
    pack: "60 ml roll-on",
    mrp: 249,
    price: 219,
    stock: 45,
    ingredients: "Herbal pain-relief oil",
    desc: "A quick-absorbing herbal roll-on oil for fast, mess-free relief from everyday muscle and joint aches.",
    benefits: ["Helps relieve muscle and joint aches", "Soothes sprains and strains", "Quick-absorbing formula", "Mess-free roll-on"],
    how: "For external use only. Roll onto the affected area and massage gently. Use as directed.",
    tags: ["pain relief", "joints", "muscles", "herbal"],
    safety: ["For external use only.", "Avoid contact with eyes and broken skin.", "Stop using if irritation occurs.", "Keep out of reach of children."],
    storage: "Store in a cool, dry place below 25°C. Keep the cap closed after use.",
    photos: ["syn-ortho-roll-on-oil.jpg"],
  },
  {
    id: "calcitium",
    slug: "calcitium-tablets",
    name: "Calcitium Tablets",
    cat: "bone-joint",
    form: "tablet",
    pack: "Bottle of 30 tablets",
    mrp: 399,
    price: 359,
    stock: 95,
    ingredients: "Calcium citrate malate, Vitamin D3, Folic acid",
    desc: "Calcium citrate malate, a well-absorbed form of calcium, combined with vitamin D3 and folic acid to support strong, healthy bones.",
    benefits: ["Supports bone strength", "Well-absorbed form of calcium", "Vitamin D3 supports calcium absorption", "With folic acid"],
    how: asDirected,
    tags: ["calcium", "bones", "vitamin d", "folic acid"],
    photos: ["calcitium-tablets.jpg"],
  },
  {
    id: "lycotium",
    slug: "lycotium-softgel",
    name: "LYCOTIUM Softgel",
    cat: "heart-omega",
    form: "capsule",
    pack: "Jar of 30 softgels",
    mrp: 599,
    price: 539,
    stock: 9,
    ingredients: "Fish oil 1000 mg, EPA 180 mg, DHA 120 mg",
    desc: "Omega-3 fish oil softgels rich in EPA and DHA, to support heart health, healthy blood lipids and everyday wellbeing. Contains fish.",
    benefits: ["Supports heart health", "Supports healthy cholesterol and triglyceride levels", "Supports healthy skin", "Supports immune health"],
    how: asDirected,
    tags: ["omega-3", "fish oil", "heart", "cholesterol"],
    photos: ["lycotium-softgel.jpg"],
  },
];

export const products: Product[] = seeds.map((s) => ({
  id: s.id,
  slug: s.slug,
  name: s.name,
  brand: BRAND,
  manufacturer: BRAND,
  categorySlug: s.cat,
  form: s.form,
  packSize: s.pack,
  mrp: s.mrp,
  price: s.price,
  discountPct: Math.round(((s.mrp - s.price) / s.mrp) * 100),
  rxRequired: s.rx ?? false,
  composition: s.ingredients,
  description: s.desc,
  uses: s.benefits,
  sideEffects: [],
  howToUse: s.how,
  safetyAdvice: s.safety ?? supplementSafety,
  storage: s.storage ?? storage,
  // No ratings: these are real products with no reviews yet (the store hides ratings when the count is 0).
  rating: 0,
  ratingCount: 0,
  inStock: s.stock > 0,
  stock: s.stock,
  tags: s.tags,
  images: [], // photos are inserted by the seed script from `photos`
}));

/** Photo files per product id (src/db/seed/photos/), added when the product has no photos yet. */
export const productPhotos: Record<string, string[]> = Object.fromEntries(seeds.map((s) => [s.id, s.photos]));
