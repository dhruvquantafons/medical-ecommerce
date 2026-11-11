"use client";

import { FolderOpen, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { MrFolderSummary } from "@/lib/mr-folder-types";
import { MrFolderCard } from "./MrFolderCard";

export function MrFolderBrowser({
  roots,
  all,
}: {
  roots: MrFolderSummary[];
  all: MrFolderSummary[];
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const displayed = useMemo(() => {
    if (!trimmed) return roots;
    return all.filter(
      (f) => f.name.toLowerCase().includes(trimmed) || f.description.toLowerCase().includes(trimmed),
    );
  }, [trimmed, roots, all]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-2xl text-ink md:text-3xl">Medicine Folders</h1>
          <p className="mt-1 text-sm text-muted">
            Tap any folder to view visual-aid pages and present full-screen to doctors.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine folders…"
            aria-label="Search medicine folders"
            className="h-11 w-full rounded-full border border-line bg-white pr-10 pl-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-gray-100 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
          <FolderOpen className="size-12 text-brand-300" />
          <p className="text-base font-bold text-ink">
            {trimmed ? `No folders match "${query.trim()}"` : "No medicine folders available yet"}
          </p>
          <p className="text-sm text-muted">
            {trimmed
              ? "Try a different medicine name or clear your search."
              : "Folders uploaded by the admin will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayed.map((folder) => (
            <MrFolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      )}
    </>
  );
}

