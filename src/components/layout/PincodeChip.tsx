"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { useLocation } from "@/store/location";
import { useHydrated } from "@/lib/useHydrated";
import { site } from "@/config/site";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function PincodeChip() {
  const hydrated = useHydrated();
  const pincode = useLocation((s) => s.pincode);
  const setPincode = useLocation((s) => s.setPincode);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const valid = /^[1-9]\d{5}$/.test(value);

  return (
    <>
      <button
        onClick={() => {
          setValue("");
          setOpen(true);
        }}
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-left hover:bg-gray-100"
      >
        <MapPin className="size-5 text-brand-600" />
        <span className="leading-tight">
          <span className="block text-[11px] text-muted">Deliver to</span>
          <span className="flex items-center gap-0.5 text-sm font-semibold">
            {hydrated ? pincode : site.defaultPincode} <ChevronDown className="size-3.5" />
          </span>
        </span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Choose delivery pincode">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            setPincode(value);
            setOpen(false);
          }}
          className="space-y-3"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="Enter 6-digit pincode"
            className="h-11 w-full rounded-lg border border-line px-3 outline-none focus:border-brand-500"
            autoFocus
          />
          <Button type="submit" disabled={!valid} className="w-full">
            Apply
          </Button>
        </form>
      </Modal>
    </>
  );
}
