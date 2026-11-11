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
      {/* Subtle folder tab & stacked-page hint on top */}
      <div className="flex items-center justify-between border-b border-line/70 bg-brand-50/70 px-4 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-800">
          <FolderOpen className="size-3.5 text-brand-600" />
          <span>Medicine Folder</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
          <Images className="size-3" />
          <span>{counts}</span>
        </span>
      </div>

      <div className="relative aspect-[4/3] bg-tile">
        {folder.coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- served from /api/mr-images/[id]
          <img
            src={folder.coverSrc}
            alt={folder.name}
            loading="lazy"
            className="size-full object-contain p-3 transition duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid size-full place-items-center text-brand-300">
            <FolderOpen className="size-16" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center p-4">
        <h2 className="text-base font-extrabold tracking-tight text-ink group-hover:text-brand-700 md:text-lg">
          {folder.name}
        </h2>
        {folder.description && <p className="mt-1 line-clamp-2 text-xs text-muted md:text-sm">{folder.description}</p>}
      </div>
    </Link>
  );
}

