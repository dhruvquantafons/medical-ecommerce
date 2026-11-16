"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface SearchEntry {
  id: string;
  name: string;
  /** Composition or ingredient list, shown under the name and searched. */
  detail: string;
  href: string;
  group: "shop" | "products";
}

/**
 * Site-wide product search (shadcn command dialog). Searches store products and the product
 * catalogue by name and ingredient. Opens from the header button or with Ctrl/⌘ K.
 */
export function SearchCommand({ entries, className }: { entries: SearchEntry[]; className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const groups = [
    { key: "shop", heading: "Shop", items: entries.filter((e) => e.group === "shop") },
    { key: "products", heading: "Product catalogue", items: entries.filter((e) => e.group === "products") },
  ];
  const q = query.trim();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className={cn("grid size-11 place-items-center rounded-control text-ink hover:bg-surface", className)}
      >
        <Search aria-hidden className="size-5" />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search products" description="Search by product name or ingredient">
        {/* Match on name and ingredients only (the keywords), never on the internal ids inside `value`. */}
        <Command filter={(_value, search, keywords) => (keywords ?? []).join(" ").toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0}>
          <CommandInput placeholder="Search by name or ingredient" value={query} onValueChange={setQuery} />
          <CommandList className="max-h-[min(24rem,60svh)]">
            <CommandEmpty className="text-ink-muted">No products match “{q}”.</CommandEmpty>
            {groups.map(
              (g) =>
                g.items.length > 0 && (
                  <CommandGroup key={g.key} heading={g.heading}>
                    {g.items.map((e) => (
                      <CommandItem key={e.id} value={`${e.group}-${e.id} ${e.name}`} keywords={[e.name, e.detail]} onSelect={() => go(e.href)}>
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] text-ink">{e.name}</span>
                          {e.detail && <span className="block truncate text-sm text-ink-muted">{e.detail}</span>}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ),
            )}
            {q && (
              <CommandGroup heading="Store search">
                <CommandItem value={`__search ${q}`} keywords={[q]} onSelect={() => go(`/search?q=${encodeURIComponent(q)}`)}>
                  <span className="text-[15px] text-ink">Search the store for “{q}”</span>
                  <ArrowRight aria-hidden className="ml-auto" />
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
