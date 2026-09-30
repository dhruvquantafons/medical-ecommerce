"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useRx } from "@/store/rx";
import { useHydrated } from "@/lib/useHydrated";
import { useToast } from "@/components/ui/Toast";
import { ButtonLink } from "@/components/ui/Button";
import { RxDropzone, RxThumb } from "./RxDropzone";

const valid = [
  "Doctor's name, registration number and signature",
  "Patient's name and age",
  "Date of the prescription (recent)",
  "Medicine names with dosage",
];
const steps = [
  { t: "Upload prescription", d: "Take a clear photo or upload a PDF" },
  { t: "Add medicines to cart", d: "Search and add the medicines on your prescription" },
  { t: "Attach at checkout", d: "Select the prescription and place your order" },
  { t: "Pharmacist verifies", d: "We verify and dispatch within 24 hours" },
];

export function UploadPrescriptionView() {
  const hydrated = useHydrated();
  const prescriptions = useRx((s) => s.prescriptions);
  const remove = useRx((s) => s.remove);
  const toast = useToast((s) => s.show);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold md:text-2xl">Upload prescription</h1>
      <p className="mt-1 text-sm text-muted">Upload a valid prescription to order Rx medicines. Your files are stored only on this device.</p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="card p-5">
            <RxDropzone onAdded={() => toast("Prescription uploaded")} />
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Your prescriptions</h2>
              {hydrated && prescriptions.length > 0 && <ButtonLink href="/cart" size="sm" variant="outline">Go to cart</ButtonLink>}
            </div>
            {!hydrated ? (
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            ) : prescriptions.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {prescriptions.map((p) => <RxThumb key={p.id} rx={p} onRemove={() => remove(p.id)} />)}
              </div>
            ) : (
              <p className="text-sm text-muted">No prescriptions uploaded yet.</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-bold">How it works</h2>
            <ol className="grid gap-4 sm:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.t} className="flex gap-3 sm:flex-col">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{s.t}</span>
                    <span className="text-xs text-muted">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="card space-y-4 self-start p-5">
          <h2 className="font-bold">A valid prescription contains</h2>
          <ul className="space-y-2">
            {valid.map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-save" /> {v}
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-4">
            <p className="mb-2 text-sm font-semibold">Please avoid</p>
            <ul className="space-y-2">
              {["Blurry or cropped images", "Expired prescriptions", "Handwritten notes without a doctor's signature"].map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-gray-700">
                  <CircleX className="mt-0.5 size-4 shrink-0 text-red-500" /> {v}
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
            As per government regulations, Rx medicines are dispensed only against a valid prescription from a registered medical practitioner.
          </p>
        </aside>
      </div>
    </div>
  );
}
