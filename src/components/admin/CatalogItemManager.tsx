"use client";

import { Pencil, Trash2, FlaskConical } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import type { CatalogItem } from "@/lib/catalog-item-types";
import { parseSalts } from "@/lib/catalog-item-types";
import { createCatalogItem, updateCatalogItem, deleteCatalogItem } from "@/app/admin/catalog/actions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAdminAction } from "./useAdminAction";
import { inputClass } from "./ui";

const CATEGORIES = ["Prescription (Rx)", "Over-The-Counter (OTC)", "Biotech Formulations", "Nutraceuticals"] as const;
const DOSE_FORMS = ["Capsule", "Tablet", "Syrup", "Injectable", "Ointment"] as const;
const AVAILABILITIES = ["In Stock", "Prescription Required", "Limited Batch"] as const;

type Draft = {
  id: string | null;
  name: string;
  brand: string;
  category: string;
  description: string;
  dosageForm: string;
  digitalVerifiedId: string;
  googleIndexed: boolean;
  eCommerceReady: boolean;
  rating: number;
  reviewsCount: number;
  priceEstimate: string;
  availability: string;
  imageUrl: string;
  imageGradient: string;
  molecularFormula: string;
  bioavailability: string;
  halfLife: string;
  saltsRaw: string;
  sortOrder: number;
  active: boolean;
};

/** Serialize a salt array back to one-JSON-per-line for the textarea. */
function saltsToRaw(json: string): string {
  const arr = parseSalts(json);
  return arr.map((s) => JSON.stringify(s)).join("\n");
}

const blank = (sortOrder: number): Draft => ({
  id: null, name: "", brand: "", category: "Prescription (Rx)",
  description: "", dosageForm: "Tablet", digitalVerifiedId: "",
  googleIndexed: true, eCommerceReady: true, rating: 0, reviewsCount: 0,
  priceEstimate: "", availability: "In Stock", imageUrl: "", imageGradient: "",
  molecularFormula: "", bioavailability: "", halfLife: "", saltsRaw: "", sortOrder, active: true,
});

const fromItem = (item: CatalogItem): Draft => ({
  id: item.id, name: item.name, brand: item.brand, category: item.category,
  description: item.description, dosageForm: item.dosageForm,
  digitalVerifiedId: item.digitalVerifiedId, googleIndexed: item.googleIndexed,
  eCommerceReady: item.eCommerceReady, rating: item.rating, reviewsCount: item.reviewsCount,
  priceEstimate: item.priceEstimate, availability: item.availability,
  imageUrl: item.imageUrl ?? "", imageGradient: item.imageGradient,
  molecularFormula: item.molecularFormula, bioavailability: item.bioavailability,
  halfLife: item.halfLife, saltsRaw: saltsToRaw(item.salts),
  sortOrder: item.sortOrder, active: item.active,
});

export function CatalogItemManager({ items }: { items: CatalogItem[] }) {
  const { run, pending } = useAdminAction();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const open = (d: Draft) => { setDraft(d); setErrors({}); };
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  async function save() {
    if (!draft) return;
    const input = { ...draft, imageUrl: draft.imageUrl || undefined };
    const res = draft.id
      ? await run(() => updateCatalogItem(draft.id!, input))
      : await run(() => createCatalogItem(input));
    if (res.ok) setDraft(null);
    else setErrors(res.fieldErrors ?? {});
  }

  const field = (label: string, key: keyof Draft, type: "text" | "number" | "url" = "text", placeholder?: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-600">{label}</span>
      <input
        type={type}
        value={String(draft?.[key] ?? "")}
        onChange={(e) => set({ [key]: type === "number" ? Number(e.target.value) : e.target.value })}
        placeholder={placeholder}
        className={clsx(inputClass, "w-full", errors[key] && "border-red-400")}
      />
      {errors[key] && <span className="text-xs text-red-600">{errors[key]}</span>}
    </label>
  );

  const select = (label: string, key: keyof Draft, options: readonly string[]) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-600">{label}</span>
      <select
        value={String(draft?.[key] ?? "")}
        onChange={(e) => set({ [key]: e.target.value })}
        className={clsx(inputClass, "w-full", errors[key] && "border-red-400")}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[key] && <span className="text-xs text-red-600">{errors[key]}</span>}
    </label>
  );

  const checkbox = (label: string, key: keyof Draft) => (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={!!draft?.[key]}
        onChange={(e) => set({ [key]: e.target.checked })}
        className="size-4 rounded border-line accent-brand-600"
      />
      <span className="text-sm font-semibold">{label}</span>
    </label>
  );

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => open(blank((items.at(-1)?.sortOrder ?? -1) + 1))}>
          + New item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-4 py-14 text-center">
          <p className="font-semibold">No catalog items yet</p>
          <p className="text-sm text-muted">Add your first medicine above.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="card flex items-center gap-3 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gray-100 text-gray-400">
                <FlaskConical className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="truncate text-xs text-muted">
                  {item.brand} · {item.category}
                  {!item.active && (
                    <span className="ml-2 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Inactive
                    </span>
                  )}
                </p>
              </div>
              <button
                aria-label={`Edit ${item.name}`}
                onClick={() => open(fromItem(item))}
                className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-ink"
              >
                <Pencil className="size-4" />
              </button>
              <button
                aria-label={`Delete ${item.name}`}
                disabled={pending}
                onClick={() => confirm(`Delete "${item.name}"?`) && run(() => deleteCatalogItem(item.id))}
                className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit catalog item" : "New catalog item"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
          </div>
        }
      >
        {draft && (
          <div className="space-y-4">
            {/* Identity */}
            {field("Name", "name")}
            {field("Brand", "brand")}
            <div className="grid grid-cols-2 gap-3">
              {select("Category", "category", CATEGORIES)}
              {select("Dosage form", "dosageForm", DOSE_FORMS)}
            </div>

            {/* Pricing & availability */}
            <div className="grid grid-cols-2 gap-3">
              {field("Price estimate", "priceEstimate", "text", "$29.50")}
              {select("Availability", "availability", AVAILABILITIES)}
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-3">
              {field("Rating (0–5)", "rating", "number")}
              {field("Review count", "reviewsCount", "number")}
            </div>

            {/* Technical */}
            {field("Molecular formula", "molecularFormula")}
            <div className="grid grid-cols-2 gap-3">
              {field("Bioavailability", "bioavailability", "text", "89.6%")}
              {field("Half-life", "halfLife", "text", "3.8 - 5.5 Hours")}
            </div>
            {field("Digital verified ID", "digitalVerifiedId", "text", "SNC-PTH-88301-V")}

            {/* Visuals */}
            {field("Image URL", "imageUrl", "url", "/portfolio/assets/synspas.jpg or https://…")}
            {field("Image gradient (CSS)", "imageGradient", "text", "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)")}

            {/* Description */}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => set({ description: e.target.value })}
                rows={4}
                className={clsx("w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100", errors.description && "border-red-400")}
              />
            </label>

            {/* Salts */}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Active salts <span className="font-normal text-muted">(one JSON object per line)</span>
              </span>
              <textarea
                value={draft.saltsRaw}
                onChange={(e) => set({ saltsRaw: e.target.value })}
                rows={5}
                placeholder={`{"name":"Paracetamol","amount":"500 mg","percentage":100,"purpose":"Analgesic","casNumber":"103-90-2"}`}
                className={clsx("w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100", errors.salts && "border-red-400")}
              />
              {errors.salts && <span className="text-xs text-red-600">{errors.salts}</span>}
            </label>

            {/* Flags */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {checkbox("Google indexed", "googleIndexed")}
              {checkbox("E-commerce ready", "eCommerceReady")}
              {checkbox("Active", "active")}
            </div>

            {/* Sort order */}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Sort order</span>
              <input
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(e) => set({ sortOrder: Number(e.target.value) })}
                className={clsx(inputClass, "w-full")}
              />
            </label>
          </div>
        )}
      </Modal>
    </>
  );
}
