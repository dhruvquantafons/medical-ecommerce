"use server";

import { z } from "zod";
import { getProductsByIds } from "@/lib/catalog";

const ids = z.array(z.string().max(64)).max(50);

/** Product details for cart lines (the cart itself lives in the browser). */
export async function fetchCartProducts(productIds: string[]) {
  return getProductsByIds(ids.parse(productIds));
}
