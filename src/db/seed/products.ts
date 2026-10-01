import type { Product, ProductForm } from "@/data/types";

// Demo catalogue used by `npm run db:seed`: Syncytium Health's own-brand supplements.
// Names, prices, ratings and claims are illustrative placeholders only.

const BRAND = "Syncytium Health";

type Seed = {
  id: string;
  name: string;
  cat: string;
  form: ProductForm;
  pack: string;
  mrp: number;
  price: number;
  ingredients: string;
  desc: string;
  benefits: string[];
  how: string;
  tags: string[];
  rating: number;
  reviews: number;
  stock?: number;
};

const safety = [
  "Food supplement. Not intended to diagnose, treat, cure or prevent any disease.",
  "Do not exceed the recommended daily intake.",
  "Consult your doctor before use if you are pregnant, nursing, taking medication or have a medical condition.",
  "Keep out of reach of children.",
];
const storage = "Store in a cool, dry place below 25°C, away from direct sunlight. Keep the lid tightly closed.";

const seeds: Seed[] = [
  {
    id: "s001",
    name: "Daily Synbiotic",
    cat: "gut-health",
    form: "capsule",
    pack: "Jar of 30 capsules",
    mrp: 1499,
    price: 1299,
    ingredients: "24 probiotic strains (50 billion CFU) + prebiotic PAC fibre",
    desc: "A 2-in-1 probiotic and prebiotic that supports digestion, regularity and a balanced gut microbiome, in one delayed-release capsule a day.",
    benefits: ["Supports digestive health", "Helps reduce occasional bloating", "Supports regularity", "Balances the gut microbiome"],
    how: "Take 1 capsule daily with water, with or without food. Best taken at the same time each day.",
    tags: ["gut", "probiotic", "digestion"],
    rating: 4.8,
    reviews: 2140,
  },
  {
    id: "s002",
    name: "Gut Restore Fibre",
    cat: "gut-health",
    form: "powder",
    pack: "Canister of 300 g (30 servings)",
    mrp: 899,
    price: 899,
    ingredients: "Partially hydrolysed guar gum, psyllium husk, acacia fibre, inulin",
    desc: "A gentle, unflavoured prebiotic fibre blend that dissolves clear in water and feeds the good bacteria in your gut.",
    benefits: ["Feeds beneficial gut bacteria", "Supports regularity", "Helps you feel fuller for longer"],
    how: "Mix 1 scoop (10 g) into 250 ml of water, juice or a smoothie once a day. Increase water intake while using.",
    tags: ["gut", "fibre", "digestion"],
    rating: 4.6,
    reviews: 860,
  },
  {
    id: "s003",
    name: "Daily Multivitamin",
    cat: "immunity-energy",
    form: "tablet",
    pack: "Jar of 60 tablets",
    mrp: 749,
    price: 649,
    ingredients: "23 vitamins and minerals incl. methylated B12 & folate, vitamin D3, zinc, selenium",
    desc: "A complete once-a-day multivitamin with bioavailable forms of essential nutrients to fill everyday gaps in your diet.",
    benefits: ["Supports energy levels", "Supports normal immune function", "Fills common nutrient gaps"],
    how: "Take 1 tablet daily after breakfast with a glass of water.",
    tags: ["immunity", "energy", "vitamins"],
    rating: 4.7,
    reviews: 1830,
  },
  {
    id: "s004",
    name: "Vitamin D3 + K2 Drops",
    cat: "immunity-energy",
    form: "drops",
    pack: "Dropper bottle of 30 ml",
    mrp: 549,
    price: 549,
    ingredients: "Vitamin D3 (1000 IU) + vitamin K2 as MK-7 (50 mcg) per drop, in MCT oil",
    desc: "Easy-to-take liquid D3 with K2 to support bones, teeth and immunity, especially if you spend most of your day indoors.",
    benefits: ["Supports bone and teeth health", "Supports normal immune function", "Helps calcium go where it's needed"],
    how: "Take 1 drop daily with a meal containing some fat, directly on the tongue or in food.",
    tags: ["immunity", "vitamins", "bone"],
    rating: 4.8,
    reviews: 1210,
  },
  {
    id: "s005",
    name: "Marine Collagen Glow",
    cat: "skin-hair",
    form: "powder",
    pack: "Canister of 250 g (25 servings)",
    mrp: 1799,
    price: 1499,
    ingredients: "Hydrolysed marine collagen peptides (10 g), vitamin C, hyaluronic acid",
    desc: "Unflavoured marine collagen peptides with vitamin C and hyaluronic acid to support skin elasticity and hydration.",
    benefits: ["Supports skin elasticity", "Supports skin hydration", "Supports healthy hair and nails"],
    how: "Stir 1 scoop (10 g) into coffee, tea, water or a smoothie once a day. Dissolves in hot or cold drinks.",
    tags: ["skin", "hair", "collagen"],
    rating: 4.6,
    reviews: 970,
  },
  {
    id: "s006",
    name: "Biotin + Zinc Hair Gummies",
    cat: "skin-hair",
    form: "bottle",
    pack: "Jar of 60 gummies",
    mrp: 699,
    price: 599,
    ingredients: "Biotin (5000 mcg), zinc, folic acid, vitamin E; natural berry flavour, pectin-based (vegan)",
    desc: "Tasty vegan berry gummies with biotin and zinc to support strong, healthy hair from within.",
    benefits: ["Supports healthy hair growth", "Supports strong nails", "Vegan and gelatin-free"],
    how: "Chew 2 gummies daily. Do not exceed 2 gummies a day.",
    tags: ["hair", "skin", "vitamins"],
    rating: 4.5,
    reviews: 1540,
  },
  {
    id: "s007",
    name: "Ashwagandha Calm",
    cat: "sleep-stress",
    form: "capsule",
    pack: "Jar of 60 capsules",
    mrp: 649,
    price: 649,
    ingredients: "KSM-66® ashwagandha root extract (600 mg), black pepper extract",
    desc: "A clinically studied ashwagandha root extract to help your body manage everyday stress and support calm focus.",
    benefits: ["Helps manage everyday stress", "Supports calm and focus", "Supports restful sleep"],
    how: "Take 1 capsule twice daily after meals, or 2 capsules in the evening.",
    tags: ["stress", "sleep", "adaptogen"],
    rating: 4.7,
    reviews: 1320,
  },
  {
    id: "s008",
    name: "Magnesium Glycinate Night",
    cat: "sleep-stress",
    form: "tablet",
    pack: "Jar of 60 tablets",
    mrp: 799,
    price: 699,
    ingredients: "Magnesium bisglycinate (300 mg elemental), L-theanine, vitamin B6",
    desc: "A gentle, highly absorbable form of magnesium with L-theanine to help you unwind in the evening and sleep better.",
    benefits: ["Supports relaxation", "Supports restful sleep", "Supports muscle function"],
    how: "Take 2 tablets 30–60 minutes before bed with water.",
    tags: ["sleep", "stress", "minerals"],
    rating: 4.6,
    reviews: 690,
    stock: 8,
  },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const products: Product[] = seeds.map((s) => ({
  id: s.id,
  slug: slugify(s.name),
  name: s.name,
  brand: BRAND,
  manufacturer: BRAND,
  categorySlug: s.cat,
  form: s.form,
  packSize: s.pack,
  mrp: s.mrp,
  price: s.price,
  discountPct: Math.round(((s.mrp - s.price) / s.mrp) * 100),
  rxRequired: false,
  composition: s.ingredients,
  description: s.desc,
  uses: s.benefits,
  sideEffects: [],
  howToUse: s.how,
  safetyAdvice: safety,
  storage,
  rating: s.rating,
  ratingCount: s.reviews,
  inStock: (s.stock ?? 120) > 0,
  stock: s.stock ?? 120,
  tags: s.tags,
  images: [], // demo products use the drawn placeholder; add photos in the admin panel
}));
