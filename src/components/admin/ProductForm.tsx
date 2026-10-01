"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import type { Product, ProductForm as Form } from "@/data/types";
import { createProduct, deleteProduct, updateProduct } from "@/app/admin/actions";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { inputClass } from "./ui";
import { ProductImagesField, serializeImages, type ImageItem } from "./ProductImagesField";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  manufacturer: string;
  categoryId: number | "";
  form: Form;
  packSize: string;
  mrp: string;
  price: string;
  stock: string;
  rxRequired: boolean;
  active: boolean;
  composition: string;
  description: string;
  uses: string;
  sideEffects: string;
  howToUse: string;
  safetyAdvice: string;
  storage: string;
  tags: string;
  images: ImageItem[];
}

const FORMS: { v: Form; l: string }[] = [
  { v: "capsule", l: "Capsules (jar)" },
  { v: "tablet", l: "Tablets (jar)" },
  { v: "bottle", l: "Gummies / other (jar)" },
  { v: "powder", l: "Powder (canister)" },
  { v: "drops", l: "Drops (dropper bottle)" },
  { v: "syrup", l: "Liquid (bottle)" },
  { v: "pack", l: "Sachets (pouch)" },
  { v: "cream", l: "Cream (tube)" },
  { v: "device", l: "Other" },
];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function ProductForm({ initial, categories }: { initial: ProductFormValues; categories: { id: number; name: string; slug: string }[] }) {
  const router = useRouter();
  const toast = useToast((s) => s.show);
  const [v, setV] = useState(initial);
  const [slugEdited, setSlugEdited] = useState(!!initial.id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const uid = useId();

  const set = <K extends keyof ProductFormValues>(k: K, value: ProductFormValues[K]) => {
    setV((prev) => ({ ...prev, [k]: value, ...(k === "name" && !slugEdited ? { slug: slugify(String(value)) } : {}) }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  /** Label holds only the name; error/hint are linked with aria-describedby. */
  const describe = (k: string, hint?: string) => {
    const id = `${uid}-${k}`;
    const text = errors[k] || hint;
    return {
      id,
      note: text ? (
        <span id={`${id}-note`} className={clsx("mt-1 block text-xs", errors[k] ? "text-red-600" : "text-muted")}>
          {text}
        </span>
      ) : null,
      aria: { "aria-invalid": !!errors[k], "aria-describedby": text ? `${id}-note` : undefined },
    };
  };

  const field = (k: keyof ProductFormValues, label: string, opts: { type?: string; hint?: string; wide?: boolean; textarea?: number; step?: string } = {}) => {
    const { id, note, aria } = describe(k, opts.hint);
    return (
      <div className={clsx("block", opts.wide && "sm:col-span-2")}>
        <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
        {opts.textarea ? (
          <textarea
            id={id}
            name={k}
            rows={opts.textarea}
            value={String(v[k])}
            onChange={(e) => set(k, e.target.value as never)}
            {...aria}
            className={clsx("w-full rounded-lg border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100", errors[k] ? "border-red-400" : "border-line")}
          />
        ) : (
          <input
            id={id}
            name={k}
            type={opts.type ?? "text"}
            step={opts.step}
            value={String(v[k])}
            onChange={(e) => {
              if (k === "slug") setSlugEdited(true);
              set(k, e.target.value as never);
            }}
            {...aria}
            className={clsx(inputClass, "w-full", errors[k] && "border-red-400")}
          />
        )}
        {note}
      </div>
    );
  };

  const mrp = Number(v.mrp) || 0;
  const price = Number(v.price) || 0;
  const category = categories.find((c) => c.id === v.categoryId);
  const preview: Product = {
    id: v.id ?? "preview",
    slug: v.slug || "preview",
    name: v.name || "Product name",
    brand: v.brand || "Brand",
    manufacturer: v.manufacturer,
    categorySlug: category?.slug ?? "",
    form: v.form,
    packSize: v.packSize || "Pack size",
    mrp,
    price,
    discountPct: mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0,
    rxRequired: v.rxRequired,
    composition: v.composition,
    description: "",
    uses: [],
    sideEffects: [],
    howToUse: "",
    safetyAdvice: [],
    storage: "",
    rating: 0,
    ratingCount: 0,
    inStock: Number(v.stock) > 0,
    stock: Number(v.stock) || 0,
    tags: [],
    images: v.images.map((i) => i.src),
  };
  const uploading = v.images.some((i) => i.uploading);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return toast("Wait for the photos to finish uploading.", "error");
    setSaving(true);
    const data = new FormData(e.currentTarget);
    data.set("images", serializeImages(v.images));
    const res = v.id ? await updateProduct(v.id, data) : await createProduct(data);
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      toast(res.error, "error");
      return;
    }
    toast(res.message ?? "Saved");
    if (!v.id) router.replace(`/admin/products/${res.data.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!v.id || !confirm(`Delete "${v.name}"? If it appears in past orders it will be hidden instead.`)) return;
    const res = await deleteProduct(v.id);
    if (!res.ok) return toast(res.error, "error");
    toast(res.message ?? "Deleted");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <Section title="Basics">
          {field("name", "Product name", { wide: true })}
          {field("slug", "URL slug", { hint: `Store URL: /product/${v.slug || "…"}` })}
          {field("brand", "Brand")}
          {field("manufacturer", "Manufacturer")}
          {(() => {
            const { id, note, aria } = describe("categoryId");
            return (
              <div>
                <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-600">Collection</label>
                <select id={id} name="categoryId" value={v.categoryId} onChange={(e) => set("categoryId", Number(e.target.value) || "")} {...aria} className={clsx(inputClass, "w-full", errors.categoryId && "border-red-400")}>
                  <option value="">Choose…</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {note}
              </div>
            );
          })()}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Pack type (used for the placeholder image)</span>
            <select name="form" value={v.form} onChange={(e) => set("form", e.target.value as Form)} className={clsx(inputClass, "w-full")}>
              {FORMS.map((f) => <option key={f.v} value={f.v}>{f.l}</option>)}
            </select>
          </label>
          {field("packSize", "Pack size", { hint: "e.g. Strip of 15 tablets" })}
        </Section>

        <Section title="Price & stock">
          {field("mrp", "MRP (₹)", { type: "number", step: "0.01" })}
          {field("price", "Selling price (₹)", { type: "number", step: "0.01", hint: mrp > 0 && price <= mrp ? `${preview.discountPct}% off MRP` : undefined })}
          {field("stock", "Units in stock", { type: "number", step: "1" })}
          <div className="flex flex-col justify-center gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="rxRequired" checked={v.rxRequired} onChange={(e) => set("rxRequired", e.target.checked)} className="size-4 accent-brand-600" />
              Prescription required (Rx)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={v.active} onChange={(e) => set("active", e.target.checked)} className="size-4 accent-brand-600" />
              Visible in store
            </label>
          </div>
        </Section>

        <Section title="Product details">
          {field("composition", "Key ingredients", { wide: true })}
          {field("description", "Description", { wide: true, textarea: 3 })}
          {field("uses", "Benefits (one per line)", { textarea: 4 })}
          {field("sideEffects", "Side effects (one per line)", { textarea: 4 })}
          {field("howToUse", "How to use", { wide: true, textarea: 2 })}
          {field("safetyAdvice", "Safety advice (one per line)", { wide: true, textarea: 3 })}
          {field("storage", "Storage", { wide: true })}
          {field("tags", "Search tags (comma separated)", { wide: true, hint: "e.g. gut, sleep. Helps customers find the product in search." })}
        </Section>

        <Section title="Photos">
          <ProductImagesField
            items={v.images}
            update={(fn) => {
              setV((prev) => ({ ...prev, images: fn(prev.images) }));
              setErrors((e) => ({ ...e, images: "" }));
            }}
            error={errors.images}
          />
        </Section>
      </div>

      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Store preview</p>
          <div className="pointer-events-none">
            <ProductCard product={preview} />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={saving || uploading}>
          {saving ? "Saving…" : uploading ? "Uploading photos…" : v.id ? "Save changes" : "Create product"}
        </Button>
        {v.id && (
          <button type="button" onClick={onDelete} className="w-full text-center text-xs font-semibold text-red-600 hover:underline">
            Delete product
          </button>
        )}
      </div>
    </form>
  );
}
