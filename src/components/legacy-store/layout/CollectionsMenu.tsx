"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Category } from "@/data/types";
import { Icon } from "@/components/ui/Icon";

export function CollectionsMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
      >
        Collections <ChevronDown className={clsx("size-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 pt-2">
          <div className="w-72 rounded-2xl border border-line bg-white p-2 shadow-xl">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-ink hover:bg-brand-50"
              >
                <span className="grid size-9 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <Icon name={c.icon} className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{c.name}</span>
                  <span className="line-clamp-1 text-xs text-muted">{c.description}</span>
                </span>
              </Link>
            ))}
            <Link href="/shop" onClick={() => setOpen(false)} className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-800 hover:bg-brand-50">
              Shop all products →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
