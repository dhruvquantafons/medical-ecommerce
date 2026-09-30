"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Prescription } from "@/data/types";

interface RxState {
  prescriptions: Prescription[];
  add: (p: Prescription) => void;
  remove: (id: string) => void;
}

export const useRx = create<RxState>()(
  persist(
    (set) => ({
      prescriptions: [],
      add: (p) => set((s) => ({ prescriptions: [p, ...s.prescriptions] })),
      remove: (id) => set((s) => ({ prescriptions: s.prescriptions.filter((p) => p.id !== id) })),
    }),
    { name: "mq-rx" },
  ),
);
