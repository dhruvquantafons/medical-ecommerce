/** Client-safe catalogue types (src/lib/catalog.ts is server-only). */
export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";
export const SORT_KEYS: SortKey[] = ["featured", "price-asc", "price-desc", "rating"];
