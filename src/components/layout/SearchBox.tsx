"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { suggest } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { RxBadge } from "@/components/product/Badges";

export function SearchBox({ size = "md", autoFocus }: { size?: "md" | "lg"; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 150);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const results = suggest(debounced);

  function go(href: string) {
    setOpen(false);
    setActive(-1);
    router.push(href);
  }

  function submit() {
    if (active >= 0 && results[active]) return go(`/product/${results[active].slug}`);
    if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div ref={wrap} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={clsx(
          "flex items-center gap-2 rounded-lg border border-line bg-white pl-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100",
          size === "lg" ? "h-14" : "h-10",
        )}
      >
        <Search className="size-5 shrink-0 text-muted" />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            } else if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Search for medicines, health products and more"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        <button
          type="submit"
          className={clsx(
            "h-full rounded-r-lg bg-brand-600 font-semibold text-white hover:bg-brand-700",
            size === "lg" ? "px-6" : "px-4 text-sm",
          )}
        >
          Search
        </button>
      </form>

      {open && debounced.trim() && (
        <div className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-lg border border-line bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No matches for “{debounced}”</p>
          ) : (
            <ul id={listId} role="listbox">
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/product/${p.slug}`)}
                    className={clsx("flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left", i === active && "bg-brand-50")}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span className="truncate">{p.name}</span>
                        {p.rxRequired && <RxBadge />}
                      </span>
                      <span className="block truncate text-xs text-muted">{p.composition}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">{formatPrice(p.price)}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => go(`/search?q=${encodeURIComponent(debounced.trim())}`)}
                  className="w-full border-t border-line px-4 py-2.5 text-left text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  See all results for “{debounced.trim()}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
