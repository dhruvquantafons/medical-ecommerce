"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useQueryNav } from "./useQueryNav";

export interface FilterPanelProps {
  basePath: string;
  params: Record<string, string>;
  brands: { name: string; count: number }[];
  resultCount: number;
}

const typeOptions = [
  { v: "", l: "All" },
  { v: "otc", l: "OTC" },
  { v: "rx", l: "Rx" },
];
const priceRanges = [
  { label: "Under ₹100", min: "", max: "100" },
  { label: "₹100 – ₹500", min: "100", max: "500" },
  { label: "₹500 – ₹1,000", min: "500", max: "1000" },
  { label: "Above ₹1,000", min: "1000", max: "" },
];
const discounts = ["10", "20", "30"];
const filterKeys = ["brand", "min", "max", "discount", "type", "stock"];
const clearAll = Object.fromEntries(filterKeys.map((k) => [k, null]));

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group/g border-b border-line py-4 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold tracking-wider text-gray-500 uppercase">
        {title}
        <ChevronDown className="size-4 transition group-open/g:rotate-180" />
      </summary>
      <div className="mt-3 space-y-2.5">{children}</div>
    </details>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
        active ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-gray-700 ring-line hover:ring-brand-500",
      )}
    >
      {children}
    </button>
  );
}

function Filters({ basePath, params: current, brands, showHeader = true }: FilterPanelProps & { showHeader?: boolean }) {
  const { params, update, pending } = useQueryNav(basePath, current);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [brandQuery, setBrandQuery] = useState("");
  const selectedBrands = params.brand ? params.brand.split(",") : [];
  const active = filterKeys.some((k) => params[k]);

  const toggleBrand = (b: string) => {
    const next = selectedBrands.includes(b) ? selectedBrands.filter((x) => x !== b) : [...selectedBrands, b];
    update({ brand: next.join(",") });
  };
  const matchingBrands = brands.filter((b) => b.name.toLowerCase().includes(brandQuery.toLowerCase()));
  const visibleBrands = showAllBrands || brandQuery ? matchingBrands : matchingBrands.slice(0, 8);

  return (
    <div className={clsx("transition-opacity", pending && "opacity-60")}>
      {showHeader && (
        <div className="flex items-center justify-between pb-1">
          <p className="flex items-center gap-2 font-bold">
            <SlidersHorizontal className="size-4 text-brand-600" /> Filters
          </p>
          {active && (
            <button className="text-xs font-semibold text-brand-700 hover:underline" onClick={() => update(clearAll)}>
              Clear all
            </button>
          )}
        </div>
      )}

      <Group title="Product type">
        <div className="flex rounded-lg bg-gray-100 p-1">
          {typeOptions.map((o) => (
            <button
              key={o.v}
              type="button"
              aria-pressed={(params.type ?? "") === o.v}
              onClick={() => update({ type: o.v })}
              className={clsx(
                "flex-1 rounded-md py-1.5 text-xs font-semibold transition",
                (params.type ?? "") === o.v ? "bg-white text-brand-700 shadow-sm" : "text-gray-600 hover:text-ink",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Group>

      {brands.length > 0 && (
        <Group title="Brand">
          {brands.length > 8 && (
            <label className="flex h-9 items-center gap-2 rounded-lg border border-line px-2.5 focus-within:border-brand-500">
              <Search className="size-4 text-muted" />
              <input
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                placeholder="Search brands"
                aria-label="Search brands"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
          )}
          {visibleBrands.map((b) => (
            <label key={b.name} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700">
              <span className="flex items-center gap-2.5">
                <input type="checkbox" checked={selectedBrands.includes(b.name)} onChange={() => toggleBrand(b.name)} className="size-4 rounded accent-brand-600" />
                {b.name}
              </span>
              <span className="text-xs text-muted">{b.count}</span>
            </label>
          ))}
          {brandQuery && !matchingBrands.length && <p className="text-xs text-muted">No brands match “{brandQuery}”</p>}
          {!brandQuery && brands.length > 8 && (
            <button onClick={() => setShowAllBrands((v) => !v)} className="text-xs font-semibold text-brand-700 hover:underline">
              {showAllBrands ? "Show less" : `Show ${brands.length - 8} more`}
            </button>
          )}
        </Group>
      )}

      <Group title="Price">
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((r) => {
            const on = (params.min ?? "") === r.min && (params.max ?? "") === r.max;
            return (
              <Pill key={r.label} active={on} onClick={() => update(on ? { min: null, max: null } : { min: r.min, max: r.max })}>
                {r.label}
              </Pill>
            );
          })}
        </div>
      </Group>

      <Group title="Discount">
        <div className="flex flex-wrap gap-2">
          {discounts.map((d) => (
            <Pill key={d} active={params.discount === d} onClick={() => update({ discount: params.discount === d ? null : d })}>
              {d}% or more
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Availability">
        <label className="flex cursor-pointer items-center justify-between text-sm text-gray-700">
          In stock only
          <input
            type="checkbox"
            role="switch"
            checked={params.stock === "1"}
            onChange={() => update({ stock: params.stock === "1" ? null : "1" })}
            className="peer sr-only"
          />
          <span aria-hidden className="relative h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-brand-600 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500" />
        </label>
      </Group>
    </div>
  );
}

export function FilterSidebar(props: FilterPanelProps) {
  return (
    <aside className="card sticky top-32 hidden max-h-[calc(100vh-9rem)] w-64 shrink-0 self-start overflow-y-auto p-4 lg:block">
      <Filters {...props} />
    </aside>
  );
}

export function MobileFilterButton(props: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const { update } = useQueryNav(props.basePath, props.params);
  const count = filterKeys.filter((k) => props.params[k]).length;
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold lg:hidden">
        <SlidersHorizontal className="size-4" /> Filters
        {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[10px] text-white">{count}</span>}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        side="left"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" disabled={!count} onClick={() => update(clearAll)}>
              Clear all
            </Button>
            <Button className="flex-[2]" onClick={() => setOpen(false)}>
              Show {props.resultCount} product{props.resultCount === 1 ? "" : "s"}
            </Button>
          </div>
        }
      >
        <Filters {...props} showHeader={false} />
      </Modal>
    </>
  );
}

const typeLabel: Record<string, string> = { rx: "Prescription (Rx)", otc: "Over the counter" };

/** Removable chips for the filters currently applied. */
export function ActiveFilters({ basePath, params: current }: Pick<FilterPanelProps, "basePath" | "params">) {
  const { params, update } = useQueryNav(basePath, current);
  const chips: { label: string; remove: Record<string, string | null> }[] = [];
  if (params.type) chips.push({ label: typeLabel[params.type] ?? params.type, remove: { type: null } });
  const brands = params.brand ? params.brand.split(",") : [];
  for (const b of brands) chips.push({ label: b, remove: { brand: brands.filter((x) => x !== b).join(",") || null } });
  if (params.min || params.max) {
    const range = priceRanges.find((r) => r.min === (params.min ?? "") && r.max === (params.max ?? ""));
    chips.push({ label: range?.label ?? "Price", remove: { min: null, max: null } });
  }
  if (params.discount) chips.push({ label: `${params.discount}% or more off`, remove: { discount: null } });
  if (params.stock) chips.push({ label: "In stock only", remove: { stock: null } });
  if (!chips.length) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={() => update(c.remove)}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-2 pl-3 text-xs font-semibold text-brand-800 ring-1 ring-brand-200 transition hover:bg-brand-100"
        >
          {c.label} <X className="size-3.5" aria-label="Remove" />
        </button>
      ))}
      {chips.length > 1 && (
        <button onClick={() => update(clearAll)} className="text-xs font-semibold text-muted hover:text-ink hover:underline">
          Clear all
        </button>
      )}
    </div>
  );
}
