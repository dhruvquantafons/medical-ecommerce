"use client";

import { Truck } from "lucide-react";
import { useState } from "react";
import { useAccount } from "@/store/account";
import { useHydrated } from "@/lib/useHydrated";

// Mock serviceability: every valid pincode is serviceable; metros (starting 1–6) get faster delivery.
function estimate(pin: string) {
  const days = "123456".includes(pin[0]) ? 1 : 3;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function DeliveryCheck() {
  const hydrated = useHydrated();
  const saved = useAccount((s) => s.pincode);
  const setPincode = useAccount((s) => s.setPincode);
  const [value, setValue] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const pin = value ?? (hydrated ? saved : "");
  const valid = /^[1-9]\d{5}$/.test(pin);

  return (
    <div className="rounded-xl border border-line p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck className="size-4 text-brand-600" /> Check delivery
      </p>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return setResult("error");
          setPincode(pin);
          setResult(estimate(pin));
        }}
      >
        <input
          value={pin}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
          }}
          inputMode="numeric"
          placeholder="Enter pincode"
          aria-label="Delivery pincode"
          className="h-10 w-36 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500"
        />
        <button className="text-sm font-semibold text-brand-700 hover:underline">Check</button>
      </form>
      {result === "error" && <p className="mt-2 text-xs text-red-600">Please enter a valid 6-digit pincode.</p>}
      {result && result !== "error" && (
        <p className="mt-2 text-xs text-save">
          Delivery by <span className="font-semibold">{result}</span> to {pin}
        </p>
      )}
    </div>
  );
}
