"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { site } from "@/config/site";
import type { Address, Order } from "@/data/types";

interface AccountState {
  pincode: string;
  addresses: Address[];
  orders: Order[];
  setPincode: (pin: string) => void;
  saveAddress: (a: Address) => void;
  addOrder: (o: Order) => void;
}

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      pincode: site.defaultPincode,
      addresses: [],
      orders: [],
      setPincode: (pincode) => set({ pincode }),
      saveAddress: (a) =>
        set((s) => ({ addresses: [a, ...s.addresses.filter((x) => x.id !== a.id)] })),
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    { name: "mq-account" },
  ),
);
