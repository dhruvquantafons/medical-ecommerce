"use client";

import { ExternalLink, FolderPlus, Tablet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MrFolderSummary } from "@/lib/mr-folder-types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "./ui";
import { CopyLinkButton } from "./CopyLinkButton";
import { MrFolderGrid, toFolderDraft } from "./MrFolderGrid";
import { MrFolderModal, type FolderDraft } from "./MrFolderModal";

export function MrFolderManager({ folders }: { folders: MrFolderSummary[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<FolderDraft | null>(null);

  const openNew = () =>
    setDraft({
      id: null,
      parentId: null,
      name: "",
      slug: "",
      description: "",
      sortOrder: (folders.at(-1)?.sortOrder ?? -1) + 1,
      active: true,
    });

  return (
    <>
      <div className="card mb-5 flex flex-wrap items-center justify-between gap-4 bg-brand-50/60 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white">
            <Tablet className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">MR Tablet Presentation Link</p>
            <p className="text-xs text-muted">
              Share <code className="rounded bg-white px-1.5 py-0.5 font-semibold text-brand-800">/mr</code> with employees — opens directly on tablets with no login needed.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CopyLinkButton path="/mr" label="Copy tablet link" />
          <ButtonLink href="/mr" target="_blank" variant="ghost" size="sm">
            <ExternalLink className="size-3.5" />
            <span>Open MR view</span>
          </ButtonLink>
          <Button type="button" size="sm" onClick={openNew}>
            <FolderPlus className="size-4" />
            <span>New folder</span>
          </Button>
        </div>
      </div>

      {folders.length === 0 ? (
        <EmptyState
          title="No medicine folders yet"
          text="Create a folder (for example, a medicine name) and upload high-quality visual-aid pages inside it for your MRs."
          action={
            <Button type="button" onClick={openNew}>
              <FolderPlus className="size-4" />
              <span>Create first folder</span>
            </Button>
          }
        />
      ) : (
        <MrFolderGrid folders={folders} onEdit={(f) => setDraft(toFolderDraft(f))} />
      )}

      <MrFolderModal
        draft={draft}
        onClose={() => setDraft(null)}
        onCreated={(created) => router.push(`/admin/mr-folders/${created.id}`)}
      />
    </>
  );
}
