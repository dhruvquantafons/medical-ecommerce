import type { products } from "@/db/schema";
import type { ProductFormValues } from "@/components/admin/ProductForm";

/** Converts a database product row into the admin form's string-based values. */
export function toFormValues(p: typeof products.$inferSelect): ProductFormValues {
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
    imageUrl: p.imageUrl ?? "",
  };
}

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  brand: "",
  manufacturer: "",
  categoryId: "",
  form: "tablet",
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
  safetyAdvice: "",
  storage: "Store in a cool, dry place away from direct sunlight.",
  tags: "",
  imageUrl: "",
};
