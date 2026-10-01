import type { products } from "@/db/schema";
import { site } from "@/config/site";
import type { ProductFormValues } from "@/components/admin/ProductForm";

type AdminProduct = typeof products.$inferSelect & { images: { id: string; src: string; external: boolean }[] };

/** Converts a database product row into the admin form's string-based values. */
export function toFormValues(p: AdminProduct): ProductFormValues {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    manufacturer: p.manufacturer,
    categoryId: p.categoryId,
    form: p.form,
    packSize: p.packSize,
    mrp: String(p.mrpPaise / 100),
    price: String(p.pricePaise / 100),
    stock: String(p.stock),
    rxRequired: p.rxRequired,
    active: p.active,
    composition: p.composition,
    description: p.description,
    uses: p.uses.join("\n"),
    sideEffects: p.sideEffects.join("\n"),
    howToUse: p.howToUse,
    safetyAdvice: p.safetyAdvice.join("\n"),
    storage: p.storage,
    tags: p.tags.join(", "),
    images: p.images.map((i) => ({ key: i.id, src: i.src, uploadId: i.external ? undefined : i.id })),
  };
}

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  brand: site.name,
  manufacturer: site.name,
  categoryId: "",
  form: "capsule",
  packSize: "",
  mrp: "",
  price: "",
  stock: "0",
  rxRequired: false,
  active: true,
  composition: "",
  description: "",
  uses: "",
  sideEffects: "",
  howToUse: "",
  safetyAdvice: [
    "Food supplement. Not intended to diagnose, treat, cure or prevent any disease.",
    "Do not exceed the recommended daily intake.",
    "Consult your doctor before use if you are pregnant, nursing, taking medication or have a medical condition.",
    "Keep out of reach of children.",
  ].join("\n"),
  storage: "Store in a cool, dry place below 25°C, away from direct sunlight.",
  tags: "",
  images: [],
};
