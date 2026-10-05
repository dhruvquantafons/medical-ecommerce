"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import type { AdminCategory } from "@/lib/admin.server";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { ICON_NAMES, Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAdminAction } from "./useAdminAction";
import { inputClass } from "./ui";

type Draft = { id: number | null; name: string; slug: string; description: string; icon: string; color: string; sortOrder: number };
const blank = (sortOrder: number): Draft => ({ id: null, name: "", slug: "", description: "", icon: "Pill", color: "#7c6bf0", sortOrder });
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const { run, pending } = useAdminAction();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const open = (d: Draft) => {
    setDraft(d);
    setSlugEdited(!!d.id);
    setErrors({});
  };
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  async function save() {
    if (!draft) return;
    const res = await run(() => saveCategory(draft.id, draft));
    if (res.ok) setDraft(null);
    else setErrors(res.fieldErrors ?? {});
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => open(blank((categories.at(-1)?.sortOrder ?? -1) + 1))}>+ New collection</Button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <li key={c.id} className="card flex items-center gap-3 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `${c.color}18`, color: c.color }}>
              <Icon name={c.icon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.name}</p>
              <p className="text-xs text-muted">
                <Link href={`/admin/products?category=${c.id}`} className="hover:text-brand-700 hover:underline">
                  {c.productCount} product{c.productCount === 1 ? "" : "s"}
                </Link>{" "}
                · /collections/{c.slug}
              </p>
            </div>
            <button aria-label={`Edit ${c.name}`} onClick={() => open({ ...c })} className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-ink">
              <Pencil className="size-4" />
            </button>
            <button
              aria-label={`Delete ${c.name}`}
              disabled={pending || c.productCount > 0}
              title={c.productCount > 0 ? "Move or delete its products first" : undefined}
              onClick={() => confirm(`Delete the "${c.name}" collection?`) && run(() => deleteCategory(c.id))}
              className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit collection" : "New collection"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
          </div>
        }
      >
        {draft && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <span className="grid size-12 place-items-center rounded-2xl" style={{ background: `${draft.color}18`, color: draft.color }}>
                <Icon name={draft.icon} className="size-6" />
              </span>
              <span className="text-sm font-semibold">{draft.name || "Collection name"}</span>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Name</span>
              <input
                value={draft.name}
                onChange={(e) => set({ name: e.target.value, ...(slugEdited ? {} : { slug: slugify(e.target.value) }) })}
                className={clsx(inputClass, "w-full", errors.name && "border-red-400")}
                autoFocus
              />
              {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">URL slug</span>
              <input
                value={draft.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set({ slug: e.target.value });
                }}
                className={clsx(inputClass, "w-full", errors.slug && "border-red-400")}
              />
              <span className={clsx("text-xs", errors.slug ? "text-red-600" : "text-muted")}>{errors.slug || `/collections/${draft.slug || "…"}`}</span>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Description</span>
              <input value={draft.description} onChange={(e) => set({ description: e.target.value })} className={clsx(inputClass, "w-full")} />
            </label>
            <fieldset>
              <legend className="mb-1 text-xs font-semibold text-gray-600">Icon</legend>
              <div className="grid grid-cols-8 gap-1.5">
                {ICON_NAMES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    title={n}
                    aria-label={n}
                    aria-pressed={draft.icon === n}
                    onClick={() => set({ icon: n })}
                    className={clsx("grid aspect-square place-items-center rounded-lg ring-1", draft.icon === n ? "bg-brand-gradient text-white ring-brand-600" : "text-gray-600 ring-line hover:ring-brand-500")}
                  >
                    <Icon name={n} className="size-4" />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Colour</span>
                <input type="color" value={draft.color} onChange={(e) => set({ color: e.target.value })} className="h-10 w-full cursor-pointer rounded-lg border border-line bg-white p-1" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Order in menus</span>
                <input type="number" min={0} value={draft.sortOrder} onChange={(e) => set({ sortOrder: Number(e.target.value) })} className={clsx(inputClass, "w-full")} />
              </label>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
