"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Product } from "@/data/types";
import { ProductRail } from "@/components/product/ProductCard";

/** "Find your supplement" carousel with Best sellers / New arrivals tabs. */
export function ProductTabs({ bestsellers, newArrivals, bestsellerIds }: { bestsellers: Product[]; newArrivals: Product[]; bestsellerIds: string[] }) {
  const [tab, setTab] = useState<"best" | "new">("best");
  const tabs = [
    { id: "best" as const, label: "Best sellers" },
    { id: "new" as const, label: "New arrivals" },
  ];
  return (
    <ProductRail
      key={tab}
      title="Find your supplement"
      products={tab === "best" ? bestsellers : newArrivals}
      bestsellerIds={bestsellerIds}
      aside={
        <div role="tablist" aria-label="Product lists" className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={clsx("rounded-full px-4 py-2 text-sm transition", tab === t.id ? "bg-tile font-medium text-ink" : "text-ink/80 hover:text-ink")}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
    />
  );
}
