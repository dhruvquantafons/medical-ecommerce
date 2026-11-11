import { FolderOpen, Images } from "lucide-react";
import Link from "next/link";
import type { MrFolderSummary } from "@/lib/mr-folder-types";

export function MrFolderCard({ folder }: { folder: MrFolderSummary }) {
  const counts = [
    `${folder.imageCount} ${folder.imageCount === 1 ? "page" : "pages"}`,
    folder.subfolderCount > 0 ? `${folder.subfolderCount} ${folder.subfolderCount === 1 ? "folder" : "folders"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/mr/${folder.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs transition active:scale-[0.99] hover:border-brand-300 hover:shadow-md"
    >
      {/* Subtle folder tab & page count header */}
      <div className="flex items-center justify-between gap-2 border-b border-line/70 bg-brand-50/70 px-3 py-1.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-800">
          <FolderOpen className="size-3 shrink-0 text-brand-600" />
          <span>Folder</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-700 ring-1 ring-brand-200">
          <Images className="size-2.5" />
          <span>{counts}</span>
        </span>
      </div>

      <div className="relative h-28 w-full shrink-0 overflow-hidden bg-tile">
        {folder.coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- served from /api/mr-images/[id]
          <img
            src={folder.coverSrc}
            alt={folder.name}
            loading="lazy"
            className="absolute inset-0 size-full object-contain p-2 transition duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center text-brand-300">
            <FolderOpen className="size-9" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <h2 className="truncate text-sm font-extrabold tracking-tight text-ink group-hover:text-brand-700">
          {folder.name}
        </h2>
        {folder.description && <p className="mt-0.5 line-clamp-1 text-xs text-muted">{folder.description}</p>}
      </div>
    </Link>
  );
}

