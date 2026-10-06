"use client";

import { Truck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "@/store/location";
import { useHydrated } from "@/lib/useHydrated";

type Result = { kind: "error" | "unserviceable" | "unknown" } | { kind: "ok"; etd: string; cod: boolean };

/** Live courier estimate from Shiprocket (via /api/shipping/serviceability). */
async function checkPincode(pin: string): Promise<Result> {
  try {
    const res = await fetch(`/api/shipping/serviceability?pincode=${pin}`);
    const data = (await res.json()) as { serviceable?: boolean; etd?: string; cod?: boolean };
    if (!res.ok) return { kind: "unknown" };
    return data.serviceable ? { kind: "ok", etd: data.etd ?? "", cod: Boolean(data.cod) } : { kind: "unserviceable" };
  } catch {
    return { kind: "unknown" };
  }
}

export function DeliveryCheck() {
  const hydrated = useHydrated();
  const saved = useLocation((s) => s.pincode);
  const setPincode = useLocation((s) => s.setPincode);
  const [value, setValue] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [checking, setChecking] = useState(false);
  const pin = value ?? (hydrated ? saved : "");
  const valid = /^[1-9]\d{5}$/.test(pin);

  return (
    <div className="rounded-2xl bg-tile p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck className="size-4 text-brand-600" /> Check delivery
      </p>
      <form
        className="mt-2 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!valid) return setResult({ kind: "error" });
          setPincode(pin);
          setChecking(true);
          setResult(await checkPincode(pin));
          setChecking(false);
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
          className="h-10 w-40 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-brand-500"
        />
        <button disabled={checking} className="rounded-full px-3 text-sm font-semibold text-brand-800 underline-offset-4 hover:underline disabled:opacity-50">
          {checking ? "Checking…" : "Check"}
        </button>
      </form>
      {result?.kind === "error" && <p className="mt-2 text-xs text-red-600">Please enter a valid 6-digit pincode.</p>}
      {result?.kind === "unserviceable" && <p className="mt-2 text-xs text-red-600">Sorry, we don&apos;t deliver to {pin} yet.</p>}
      {result?.kind === "unknown" && <p className="mt-2 text-xs text-muted">We deliver across India, usually within 2–7 days.</p>}
      {result?.kind === "ok" && (
        <p className="mt-2 text-xs text-save">
          {result.etd ? (
            <>
              Delivery by <span className="font-semibold">{result.etd}</span> to {pin}
            </>
          ) : (
            <>We deliver to {pin}</>
          )}
          {!result.cod && <span className="text-muted"> · Cash on delivery not available</span>}
        </p>
      )}
    </div>
  );
}
