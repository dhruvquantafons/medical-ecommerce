"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import type { Address } from "@/data/types";

export type AddressFields = Omit<Address, "id">;
import { Button } from "@/components/ui/Button";

type Fields = AddressFields;
const empty: Fields = { name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", label: "Home" };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = "Enter the recipient's name";
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (!f.line1.trim()) e.line1 = "Enter house / flat and street";
  if (!f.city.trim()) e.city = "Enter city";
  if (!f.state.trim()) e.state = "Enter state";
  if (!/^[1-9]\d{5}$/.test(f.pincode)) e.pincode = "Enter a valid 6-digit pincode";
  return e;
}

export function AddressForm({
  onSave,
  onCancel,
  defaultPincode,
}: {
  /** Resolves to an error message to show, or nothing on success. */
  onSave: (fields: Fields) => Promise<string | void>;
  onCancel?: () => void;
  defaultPincode?: string;
}) {
  const [f, setF] = useState<Fields>({ ...empty, pincode: defaultPincode ?? "" });
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const uid = useId();
  const [serverError, setServerError] = useState<string>();
  const errors = validate(f);
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === "phone") v = v.replace(/\D/g, "").slice(0, 10);
    if (k === "pincode") v = v.replace(/\D/g, "").slice(0, 6);
    setF((prev) => ({ ...prev, [k]: v }));
  };

  const field = (k: keyof Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, wide = false) => {
    const id = `${uid}-${k}`;
    const err = touched ? errors[k] : undefined;
    return (
      <div className={clsx("block", wide && "sm:col-span-2")}>
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
        <input
          id={id}
          value={f[k]}
          onChange={set(k)}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-error` : undefined}
          className={clsx("h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-brand-500", err ? "border-red-400" : "border-line")}
          {...props}
        />
        {err && <span id={`${id}-error`} className="mt-1 block text-xs text-red-600">{err}</span>}
      </div>
    );
  };

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setTouched(true);
        if (Object.keys(errors).length) return;
        setSaving(true);
        setServerError(await onSave(f) ?? undefined);
        setSaving(false);
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      {field("name", "Full name", { autoComplete: "name" })}
      {field("phone", "Mobile number", { inputMode: "numeric", autoComplete: "tel" })}
      {field("line1", "House / flat no., building, street", { autoComplete: "address-line1" }, true)}
      {field("line2", "Area, landmark (optional)", { autoComplete: "address-line2" }, true)}
      {field("pincode", "Pincode", { inputMode: "numeric", autoComplete: "postal-code" })}
      {field("city", "City", { autoComplete: "address-level2" })}
      {field("state", "State", { autoComplete: "address-level1" })}
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-600">Save as</span>
        <div className="flex gap-2">
          {(["Home", "Work", "Other"] as const).map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setF((p) => ({ ...p, label: l }))}
              className={clsx("h-10 flex-1 rounded-lg border text-sm font-medium", f.label === l ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line")}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {serverError && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{serverError}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save address"}</Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
