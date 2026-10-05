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
