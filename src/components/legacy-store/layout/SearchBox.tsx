"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { RxBadge } from "@/components/product/Badges";

interface Suggestion {
  id: string;
  slug: string;
  name: string;
  composition: string;
  price: number;
  rxRequired: boolean;
}

/** Product search with live suggestions. `nav` sits on the dark header; `field` is a light input. */
export function SearchBox({ variant = "field", autoFocus }: { variant?: "nav" | "field"; autoFocus?: boolean }) {
  const nav = variant === "nav";
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [results, setResults] = useState<Suggestion[]>([]);
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

  useEffect(() => {
    const q = debounced.trim();
    if (!q) return;
    const ctrl = new AbortController();
    fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then(setResults)
      .catch(() => {});
    return () => ctrl.abort();
  }, [debounced]);

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
          "flex items-center gap-2",
          nav
            ? "h-10 rounded-full pr-1 pl-3 text-white transition focus-within:bg-white/10"
            : "h-12 rounded-full border border-line bg-white pr-1.5 pl-4 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100",
        )}
      >
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
          placeholder="What are you looking for?"
          aria-label="Search products"
          className={clsx("h-full min-w-0 flex-1 bg-transparent text-sm outline-none", nav ? "placeholder:text-white/75" : "placeholder:text-muted")}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        <button
          type="submit"
          aria-label="Search"
          className={clsx("grid size-9 shrink-0 place-items-center rounded-full", nav ? "hover:bg-white/10" : "bg-ink text-white hover:bg-brand-800")}
        >
          <Search className="size-[18px]" />
        </button>
      </form>

      {open && debounced.trim() && (
        <div className={clsx("absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-xl", nav ? "right-0 w-[22rem]" : "inset-x-0")}>
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
                  className="w-full border-t border-line px-4 py-3 text-left text-sm font-semibold text-brand-800 hover:bg-brand-50"
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
