"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Category } from "@/data/types";
import { cn } from "@/lib/utils";
import { navItemClass } from "@/components/ui/resizable-navbar";

/** "Shop" disclosure menu in the header: the collections plus "All products". Escape closes it and returns focus. */
export function CollectionsMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const path = usePathname();
  const current = path === "/shop" || path.startsWith("/collections/") || path === "/store";

  // Close when a link inside is followed.
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onFocus = (e: FocusEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={current ? "page" : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(navItemClass, "gap-1")}
      >
        Shop <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id={panelId} className="absolute top-full left-0 z-50 pt-1">
          <ul className="w-72 rounded-card border border-line bg-background p-2 shadow-overlay">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="block rounded-control px-3 py-2.5 hover:bg-surface">
                  <span className="block text-[15px] font-medium text-ink">{c.name}</span>
                  <span className="line-clamp-1 text-sm text-ink-muted">{c.description}</span>
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-line pt-1">
              <Link href="/shop" className="block rounded-control px-3 py-2.5 text-[15px] font-medium text-brand hover:bg-surface">
                All products
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
