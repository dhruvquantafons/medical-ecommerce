"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { site } from "@/config/site";

/** The delivery pincode chosen in the header; kept per device. */
export const useLocation = create<{ pincode: string; setPincode: (pin: string) => void }>()(
  persist((set) => ({ pincode: site.defaultPincode, setPincode: (pincode) => set({ pincode }) }), { name: "sh-location" }),
);
