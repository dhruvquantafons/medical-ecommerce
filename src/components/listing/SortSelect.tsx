"use client";

import { useQueryNav } from "./useQueryNav";

const options = [
  { v: "relevance", l: "Relevance" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
  { v: "discount", l: "Discount" },
  { v: "rating", l: "Customer rating" },
];

export function SortSelect({ basePath, params: current }: { basePath: string; params: Record<string, string> }) {
  const { params, update } = useQueryNav(basePath, current);
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-muted sm:inline">Sort by</span>
      <select
        value={params.sort ?? "relevance"}
        onChange={(e) => update({ sort: e.target.value === "relevance" ? null : e.target.value })}
        className="h-9 rounded-lg border border-line bg-white px-2 text-sm font-medium outline-none focus:border-brand-500"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}
