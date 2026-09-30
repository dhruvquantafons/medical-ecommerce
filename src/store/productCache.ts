"use client";

import { create } from "zustand";
import type { Product } from "@/data/types";
import { fetchCartProducts } from "@/app/actions/catalog";

interface ProductCacheState {
  /** null = looked up but not available (deleted or inactive). */
  byId: Record<string, Product | null>;
  load: (ids: string[]) => Promise<void>;
}

const inFlight = new Set<string>();

/** Shared client cache of product details so cart, coupon box and checkout fetch each product once. */
export const useProductCache = create<ProductCacheState>((set, get) => ({
  byId: {},
  load: async (ids) => {
    const missing = ids.filter((id) => !(id in get().byId) && !inFlight.has(id));
    if (!missing.length) return;
    missing.forEach((id) => inFlight.add(id));
    try {
      const found = await fetchCartProducts(missing);
      const next: Record<string, Product | null> = Object.fromEntries(missing.map((id) => [id, null]));
      for (const p of found) next[p.id] = p;
      set((s) => ({ byId: { ...s.byId, ...next } }));
    } finally {
      missing.forEach((id) => inFlight.delete(id));
    }
  },
}));
