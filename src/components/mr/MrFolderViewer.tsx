"use client";

import { ArrowLeft, FolderOpen, Images, Maximize2, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { MrFolderDetail } from "@/lib/mr-folder-types";
import { Button } from "@/components/ui/Button";
import { MrFolderCard } from "./MrFolderCard";
import { MrSlideShow } from "./MrSlideShow";

export function MrFolderViewer({ detail }: { detail: MrFolderDetail }) {
  const [slideIndex, setSlideIndex] = useState<number | null>(null);
  const parentCrumb = detail.breadcrumbs.length > 1 ? detail.breadcrumbs[detail.breadcrumbs.length - 2] : null;
  const backHref = parentCrumb ? `/mr/${parentCrumb.slug}` : "/mr";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-muted">
        <Link href="/mr" className="text-brand-700 hover:underline">
          Medicine Folders
        </Link>
        {detail.breadcrumbs.map((b, i) => {
          const isLast = i === detail.breadcrumbs.length - 1;
          return (
            <span key={b.id} className="inline-flex items-center gap-1.5">
              <span>/</span>
              {isLast ? (
                <span className="text-ink">{b.name}</span>
              ) : (
                <Link href={`/mr/${b.slug}`} className="text-brand-700 hover:underline">
                  {b.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href={backHref}
            aria-label="Back"
            className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white text-ink shadow-xs transition hover:border-brand-400 hover:text-brand-700"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="display text-2xl text-ink md:text-3xl">{detail.folder.name}</h1>
            {detail.folder.description ? (
              <p className="mt-1 text-sm text-muted">{detail.folder.description}</p>
            ) : (
              <p className="mt-1 text-sm text-muted">
                {detail.pages.length} {detail.pages.length === 1 ? "page" : "pages"}
                {detail.subfolders.length > 0
                  ? ` · ${detail.subfolders.length} ${detail.subfolders.length === 1 ? "subfolder" : "subfolders"}`
                  : ""}
              </p>
            )}
          </div>
        </div>

        {detail.pages.length > 0 && (
          <Button type="button" size="lg" onClick={() => setSlideIndex(0)}>
            <Play className="size-4 fill-current" />
            <span>Present to Doctor</span>
          </Button>
        )}
      </div>

      {detail.subfolders.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
            <FolderOpen className="size-4 text-brand-600" />
            <span>Folders inside {detail.folder.name}</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(180px,215px))]">
            {detail.subfolders.map((sub) => (
              <MrFolderCard key={sub.id} folder={sub} />
            ))}
          </div>
        </section>
      )}

      <section>
        {detail.pages.length > 0 ? (
          <>
            {detail.subfolders.length > 0 && (
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
                <Images className="size-4 text-brand-600" />
                <span>Pages ({detail.pages.length})</span>
              </h2>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(180px,215px))]">
              {detail.pages.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSlideIndex(index)}
                  className="group card flex flex-col overflow-hidden text-left transition active:scale-[0.99] hover:border-brand-300 hover:shadow-md"
                >
                  <div className="relative h-28 w-full shrink-0 overflow-hidden bg-tile">
                    {/* eslint-disable-next-line @next/next/no-img-element -- served from /api/mr-images/[id] */}
                    <img
                      src={page.src}
                      alt={page.title || `${detail.folder.name} page ${index + 1}`}
                      loading={index < 6 ? "eager" : "lazy"}
                      className="absolute inset-0 size-full object-contain p-2 transition duration-200 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      Page {index + 1}
                    </span>
                    <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
                      <Maximize2 className="size-3 text-brand-600" />
                      <span>Present</span>
                    </span>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="truncate text-xs font-bold text-ink">{page.title || `Page ${index + 1}`}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : detail.subfolders.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Images className="size-12 text-brand-300" />
            <p className="text-base font-bold text-ink">This folder has no pages yet</p>
            <p className="text-sm text-muted">High-quality pages added by the admin will appear here.</p>
          </div>
        ) : null}
      </section>

      {slideIndex !== null && (
        <MrSlideShow
          folderName={detail.folder.name}
          pages={detail.pages}
          initialIndex={slideIndex}
          onClose={() => setSlideIndex(null)}
        />
      )}
    </>
  );
}

