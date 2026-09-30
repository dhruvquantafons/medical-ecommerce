"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { useQueryNav } from "./useQueryNav";

export interface FilterPanelProps {
  basePath: string;
  params: Record<string, string>;
  brands: { name: string; count: number }[];
}

const priceRanges = [
  { label: "Under ₹100", min: "", max: "100" },
  { label: "₹100 – ₹500", min: "100", max: "500" },
  { label: "₹500 – ₹1,000", min: "500", max: "1000" },
  { label: "Above ₹1,000", min: "1000", max: "" },
];
const discounts = ["10", "20", "30"];
const filterKeys = ["brand", "min", "max", "discount", "type", "stock"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4 last:border-0">
      <legend className="mb-2 text-sm font-bold">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function Option({ checked, onChange, label, type = "checkbox", name }: { checked: boolean; onChange: () => void; label: React.ReactNode; type?: "checkbox" | "radio"; name?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
      <input type={type} name={name} checked={checked} onChange={onChange} className="size-4 accent-brand-600" />
      {label}
    </label>
  );
}

function Filters({ basePath, params: current, brands }: FilterPanelProps) {
  const { params, update, pending } = useQueryNav(basePath, current);
  const radioName = useId();
  const [showAllBrands, setShowAllBrands] = useState(false);
  const selectedBrands = params.brand ? params.brand.split(",") : [];
  const active = filterKeys.some((k) => params[k]);

  const toggleBrand = (b: string) => {
    const next = selectedBrands.includes(b) ? selectedBrands.filter((x) => x !== b) : [...selectedBrands, b];
    update({ brand: next.join(",") });
  };

  return (
    <div className={clsx(pending && "opacity-60")}>
      <div className="flex items-center justify-between pb-2">
        <p className="font-bold">Filters</p>
        {active && (
          <button
            className="text-xs font-semibold text-brand-700 hover:underline"
            onClick={() => update(Object.fromEntries(filterKeys.map((k) => [k, null])))}
          >
            Clear all
          </button>
        )}
      </div>

      <Group title="Product type">
        {[
          { v: "", l: "All" },
          { v: "otc", l: "Over the counter" },
          { v: "rx", l: "Prescription (Rx)" },
        ].map((o) => (
          <Option key={o.v} type="radio" name={radioName} checked={(params.type ?? "") === o.v} onChange={() => update({ type: o.v })} label={o.l} />
        ))}
      </Group>

      {brands.length > 0 && (
        <Group title="Brand">
          {(showAllBrands ? brands : brands.slice(0, 8)).map((b) => (
            <Option
              key={b.name}
              checked={selectedBrands.includes(b.name)}
              onChange={() => toggleBrand(b.name)}
              label={
                <>
                  {b.name} <span className="text-xs text-muted">({b.count})</span>
                </>
              }
            />
          ))}
          {brands.length > 8 && (
            <button onClick={() => setShowAllBrands((v) => !v)} className="text-xs font-semibold text-brand-700">
              {showAllBrands ? "Show less" : `+ ${brands.length - 8} more`}
            </button>
          )}
        </Group>
      )}

      <Group title="Price">
        {priceRanges.map((r) => {
          const checked = (params.min ?? "") === r.min && (params.max ?? "") === r.max;
          return <Option key={r.label} checked={checked} onChange={() => update(checked ? { min: null, max: null } : { min: r.min, max: r.max })} label={r.label} />;
        })}
      </Group>

      <Group title="Discount">
        {discounts.map((d) => (
          <Option key={d} checked={params.discount === d} onChange={() => update({ discount: params.discount === d ? null : d })} label={`${d}% and above`} />
        ))}
      </Group>

      <Group title="Availability">
        <Option checked={params.stock === "1"} onChange={() => update({ stock: params.stock === "1" ? null : "1" })} label="Exclude out of stock" />
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
  const count = filterKeys.filter((k) => props.params[k]).length;
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold lg:hidden">
        <SlidersHorizontal className="size-4" /> Filters
        {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[10px] text-white">{count}</span>}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Filters" side="left">
        <Filters {...props} />
      </Modal>
    </>
  );
}
