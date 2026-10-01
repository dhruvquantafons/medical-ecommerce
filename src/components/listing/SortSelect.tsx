"use client";

import type { SortKey } from "@/lib/catalog-types";
import { useQueryNav } from "./useQueryNav";

const options: { v: SortKey; l: string }[] = [
  { v: "featured", l: "Featured" },
  { v: "rating", l: "Top rated" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
];

export function SortSelect({ basePath, params: current }: { basePath: string; params: Record<string, string> }) {
  const { params, update } = useQueryNav(basePath, current);
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sort</span>
      <select
        value={params.sort ?? "featured"}
        onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
        className="h-10 rounded-full border border-line bg-white px-4 text-sm font-medium outline-none focus:border-brand-500"
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
