"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/data/types";

const MAX_QTY = 10;

interface CartState {
  items: CartItem[];
  couponCode?: string;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  applyCoupon: (code?: string) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: undefined,
      add: (productId, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: s.items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i)),
            };
          }
          return { items: [...s.items, { productId, qty: Math.min(MAX_QTY, qty) }] };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productId !== productId)
              : s.items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
        })),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [], couponCode: undefined }),
      applyCoupon: (code) => set({ couponCode: code?.trim().toUpperCase() || undefined }),
    }),
    { name: "mq-cart" },
  ),
);

export const MAX_CART_QTY = MAX_QTY;
