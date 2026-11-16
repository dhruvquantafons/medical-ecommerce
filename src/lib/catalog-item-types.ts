import type { catalogItems } from "@/db/schema";

export type CatalogItem = typeof catalogItems.$inferSelect;

/** Parsed salt shape matching the portfolio's ActiveSalt type. */
export interface ActiveSalt {
  name: string;
  amount: string;
  percentage: number;
  purpose: string;
  casNumber: string;
}

/** Parse the salts JSON text column into a typed array. Never throws. */
export function parseSalts(raw: string): ActiveSalt[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ActiveSalt[];
  } catch {
    // fall through
  }
  return [];
}

/**
 * Brand as it should be displayed. Catalog rows entered in the admin spell the company
 * "SYNCTIUM Healthcare", "SYNCTIUM Pharma Labs" and so on; the brand is "Syncytium Health".
 * TODO(owner): correct the brand field on these catalog items in the admin panel, then this
 * display fix can be removed.
 */
export function displayBrand(brand: string): string {
  return /\bSYNC?Y?TIUM\b/i.test(brand) ? "Syncytium Health" : brand;
}
