"use client";

import { EyeOff, FolderOpen, Images, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { MrFolderSummary } from "@/lib/mr-folder-types";
import { deleteMrFolder } from "@/app/admin/mr-folders/actions";
import { CopyLinkButton } from "./CopyLinkButton";
import type { FolderDraft } from "./MrFolderModal";
import { useAdminAction } from "./useAdminAction";

export const toFolderDraft = (f: MrFolderSummary): FolderDraft => ({
  id: f.id,
  parentId: f.parentId,
  name: f.name,
  slug: f.slug,
  description: f.description,
  sortOrder: f.sortOrder,
  active: f.active,
});

export function MrFolderGrid({
  folders,
  onEdit,
}: {
  folders: MrFolderSummary[];
  onEdit: (folder: MrFolderSummary) => void;
}) {
  const { run, pending } = useAdminAction();

  return (
    <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(205px,225px))]">
      {folders.map((f) => {
        const countLabel = [
          `${f.imageCount} ${f.imageCount === 1 ? "page" : "pages"}`,
          f.subfolderCount > 0 ? `${f.subfolderCount} ${f.subfolderCount === 1 ? "sub" : "subs"}` : null,
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <li key={f.id} className="card group flex flex-col overflow-hidden transition hover:border-brand-200 hover:shadow-md">
            <Link href={`/admin/mr-folders/${f.id}`} className="relative block h-28 w-full shrink-0 overflow-hidden bg-tile">
              {f.coverSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- served from /api/mr-images/[id]
                <img src={f.coverSrc} alt={f.name} className="absolute inset-0 size-full object-contain p-2 transition duration-200 group-hover:scale-[1.03]" />
              ) : (
                <div className="grid size-full place-items-center text-brand-300">
                  <FolderOpen className="size-10" />
                </div>
              )}
              {!f.active && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <EyeOff className="size-2.5" /> Hidden
                </span>
              )}
              <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
                <Images className="size-3 text-brand-600" />
                {countLabel}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-2.5">
              <Link href={`/admin/mr-folders/${f.id}`} className="truncate text-sm font-bold text-ink hover:text-brand-700">
                {f.name}
              </Link>
              {f.description ? (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">{f.description}</p>
              ) : (
                <p className="mt-0.5 truncate text-xs text-muted">/mr/{f.slug}</p>
              )}

              <div className="mt-2 flex items-center gap-1 border-t border-line pt-2">
                <Link
                  href={`/admin/mr-folders/${f.id}`}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-brand-50 px-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Images className="size-3" />
                  <span>{f.imageCount === 0 ? "Add images" : "Images"}</span>
                </Link>
                <CopyLinkButton path={`/mr/${f.slug}`} label="Link" variant="ghost" size="xs" className="px-2" />
                <div className="ml-auto flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Edit ${f.name}`}
                    onClick={() => onEdit(f)}
                    className="rounded-lg p-1 text-muted hover:bg-gray-100 hover:text-ink"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${f.name}`}
                    disabled={pending}
                    onClick={() =>
                      confirm(`Delete "${f.name}" and all ${f.imageCount} page(s) inside it?`) &&
                      run(() => deleteMrFolder(f.id))
                    }
                    className="rounded-lg p-1 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

