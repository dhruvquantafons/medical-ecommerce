import type { ProductForm } from "@/data/types";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export function formatPrice(n: number) {
  return inr.format(Math.round(n * 100) / 100).replace(/\.00$/, "");
}

export function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

const FORM_LABELS: Partial<Record<ProductForm, string>> = {
  tablet: "Tablet",
  capsule: "Capsule",
  syrup: "Oral liquid",
  drops: "Drops",
  powder: "Powder",
  pack: "Sachet",
  cream: "Topical",
  bottle: "Gummies",
};

/** Customer-facing dosage form ("Tablet", "Topical"…), or "" for forms with no meaningful label. */
export const formLabel = (form: ProductForm) => FORM_LABELS[form] ?? "";
