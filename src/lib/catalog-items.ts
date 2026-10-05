import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { catalogItems } from "@/db/schema";
import type { CatalogItem } from "./catalog-item-types";

export type { CatalogItem, ActiveSalt } from "./catalog-item-types";
export { parseSalts } from "./catalog-item-types";

/** Active items ordered by sortOrder — used by portfolio pages. */
export const getCatalogItems = cache(async (): Promise<CatalogItem[]> => {
  return db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.active, true))
    .orderBy(asc(catalogItems.sortOrder));
});

/** All items (active and inactive) — used by the admin list. */
export const getAllCatalogItems = cache(async (): Promise<CatalogItem[]> => {
  return db.select().from(catalogItems).orderBy(asc(catalogItems.sortOrder));
});
