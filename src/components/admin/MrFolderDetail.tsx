"use client";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  EyeOff,
  FolderPlus,
  ImagePlus,
  Loader2,
  Maximize2,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type DragEvent } from "react";
import clsx from "clsx";
import { MR_IMAGE_TYPES } from "@/lib/files";
import { formatBytes, type MrFolderDetail as MrFolderDetailData, type MrFolderPage } from "@/lib/mr-folder-types";
import { filterValidMrImages, uploadMrImageFile } from "@/lib/mr-image-upload";
import { deleteMrImage, reorderMrImages, updateMrImageTitle } from "@/app/admin/mr-folders/actions";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { CopyLinkButton } from "./CopyLinkButton";
import { MrFolderGrid, toFolderDraft } from "./MrFolderGrid";
import { MrFolderModal, type FolderDraft } from "./MrFolderModal";
import { inputClass } from "./ui";
import { useAdminAction } from "./useAdminAction";

const ALLOWED: readonly string[] = MR_IMAGE_TYPES;

interface PendingUpload {
  key: string;
  name: string;
  previewSrc: string;
}

function reorderList<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function MrFolderDetail({ detail }: { detail: MrFolderDetailData }) {
  const router = useRouter();
  const toast = useToast((s) => s.show);
  const { run, pending } = useAdminAction();
  const fileInput = useRef<HTMLInputElement>(null);

  const [addedPages, setAddedPages] = useState<MrFolderPage[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [orderOverride, setOrderOverride] = useState<string[] | null>(null);
  const [titleEdits, setTitleEdits] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<PendingUpload[]>([]);
  const [dropActive, setDropActive] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [folderDraft, setFolderDraft] = useState<FolderDraft | null>(null);
  const [previewPage, setPreviewPage] = useState<MrFolderPage | null>(null);

  const pages = useMemo(() => {
    const serverIds = new Set(detail.pages.map((p) => p.id));
    const removedSet = new Set(removedIds);
    const merged = [
      ...detail.pages,
      ...addedPages.filter((p) => !serverIds.has(p.id)),
    ].filter((p) => !removedSet.has(p.id));

    if (!orderOverride) return merged;
    const rank = new Map(orderOverride.map((id, i) => [id, i]));
    return [...merged].sort((a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER));
  }, [detail.pages, addedPages, removedIds, orderOverride]);

  async function uploadOne(item: PendingUpload, file: File) {
    try {
      const created = await uploadMrImageFile(detail.folder.id, file);
      setAddedPages((prev) => [...prev, created]);
      return true;
    } catch (e) {
      toast(e instanceof Error ? e.message : `${file.name}: upload failed`, "error");
      return false;
    } finally {
      URL.revokeObjectURL(item.previewSrc);
      setUploading((prev) => prev.filter((u) => u.key !== item.key));
    }
  }

  async function handleFiles(fileList: FileList | File[]) {
    const accepted = filterValidMrImages([...fileList], (msg) => toast(msg, "error"));
    if (!accepted.length) return;

    const queued = accepted.map((file) => ({
      file,
      pending: { key: crypto.randomUUID(), name: file.name, previewSrc: URL.createObjectURL(file) },
    }));
    setUploading((prev) => [...prev, ...queued.map((q) => q.pending)]);

    let uploadedCount = 0;
    // Upload 3 at a time so large batches stay fast without exhausting DB connections.
    for (let i = 0; i < queued.length; i += 3) {
      const results = await Promise.all(queued.slice(i, i + 3).map((q) => uploadOne(q.pending, q.file)));
      uploadedCount += results.filter(Boolean).length;
    }
    if (uploadedCount > 0) {
      toast(`${uploadedCount} high-quality ${uploadedCount === 1 ? "image" : "images"} added.`);
      router.refresh();
    }
  }

  async function movePage(from: number, to: number) {
    if (to < 0 || to >= pages.length || from === to) return;
    const nextIds = reorderList(pages, from, to).map((p) => p.id);
    setOrderOverride(nextIds);
    const res = await run(() =>
      reorderMrImages({ folderId: detail.folder.id, orderedImageIds: nextIds }),
    );
    if (!res.ok) setOrderOverride(null);
  }

  async function saveTitle(page: MrFolderPage) {
    if (!(page.id in titleEdits)) return;
    const nextTitle = titleEdits[page.id].trim();
    if (nextTitle === page.title) return;
    await run(() => updateMrImageTitle({ imageId: page.id, title: nextTitle }));
  }

  async function removePage(page: MrFolderPage, index: number) {
    const label = titleEdits[page.id] ?? page.title;
    if (!confirm(`Remove Page ${index + 1}${label ? ` (${label})` : ""}?`)) return;
    setRemovedIds((prev) => [...prev, page.id]);
    const res = await run(() => deleteMrImage(page.id));
    if (!res.ok) setRemovedIds((prev) => prev.filter((id) => id !== page.id));
  }

  function onDropZone(e: DragEvent) {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
  }

  const openNewSubfolder = () =>
    setFolderDraft({
      id: null,
      parentId: detail.folder.id,
      name: "",
      slug: "",
      description: "",
      sortOrder: (detail.subfolders.at(-1)?.sortOrder ?? -1) + 1,
      active: true,
    });

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-muted">
        <Link href="/admin/mr-folders" className="text-brand-700 hover:underline">
          MR Folders
        </Link>
        {detail.breadcrumbs.map((b, i) => {
          const isLast = i === detail.breadcrumbs.length - 1;
          return (
            <span key={b.id} className="inline-flex items-center gap-1.5">
              <span>/</span>
              {isLast ? (
                <span className="text-ink">{b.name}</span>
              ) : (
                <Link href={`/admin/mr-folders/${b.id}`} className="text-brand-700 hover:underline">
                  {b.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight">{detail.folder.name}</h1>
            {!detail.folder.active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                <EyeOff className="size-3" /> Hidden from MRs
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {detail.folder.description || `Direct link: /mr/${detail.folder.slug}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CopyLinkButton path={`/mr/${detail.folder.slug}`} label="Copy folder link" />
          <ButtonLink href={`/mr/${detail.folder.slug}`} target="_blank" variant="outline" size="sm">
            <ExternalLink className="size-3.5" />
            <span>Tablet view</span>
          </ButtonLink>
          <Button type="button" variant="outline" size="sm" onClick={() => setFolderDraft(toFolderDraft(detail.folder))}>
            <Pencil className="size-3.5" />
            <span>Edit folder</span>
          </Button>
          <Button type="button" size="sm" onClick={openNewSubfolder}>
            <FolderPlus className="size-4" />
            <span>New subfolder</span>
          </Button>
        </div>
      </div>

      {/* High-quality image upload dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (e.dataTransfer.types.includes("Files")) setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={onDropZone}
        className={clsx(
          "card mb-6 border-2 border-dashed p-6 text-center transition",
          dropActive ? "border-brand-500 bg-brand-50" : "border-line bg-white",
        )}
      >
        <div className="mx-auto flex max-w-lg flex-col items-center gap-2">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
            <ImagePlus className="size-6" />
          </span>
          <p className="font-bold text-ink">Add high-quality visual-aid pages</p>
          <p className="text-xs text-muted">
            Drop multiple JPG, PNG or WEBP images here (max <strong>4 MB</strong> per image). Images are stored at full original quality for crisp tablet display.
          </p>
          <Button type="button" size="sm" className="mt-2" onClick={() => fileInput.current?.click()}>
            <ImagePlus className="size-4" />
            <span>Select images</span>
          </Button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept={ALLOWED.join(",")}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Pages / slides inside this folder */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Pages in folder ({pages.length})</h2>
          {pages.length > 1 && <p className="text-xs text-muted">Drag cards or use arrows to reorder pages</p>}
        </div>

        {pages.length === 0 && uploading.length === 0 ? (
          <div className="card px-4 py-12 text-center text-sm text-muted">
            No pages uploaded in this folder yet. Add high-quality images above.
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(180px,210px))]">
            {pages.map((page, index) => {
              const titleValue = titleEdits[page.id] ?? page.title;
              return (
                <li
                  key={page.id}
                  draggable
                  onDragStart={() => setDragFrom(index)}
                  onDragEnd={() => setDragFrom(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragFrom !== null) void movePage(dragFrom, index);
                    setDragFrom(null);
                  }}
                  className={clsx(
                    "card flex flex-col overflow-hidden transition",
                    dragFrom === index && "opacity-40",
                  )}
                >
                  <div className="group relative h-28 w-full shrink-0 overflow-hidden bg-tile">
                    {/* eslint-disable-next-line @next/next/no-img-element -- served from /api/mr-images/[id] */}
                    <img
                      src={page.src}
                      alt={titleValue || `Page ${index + 1}`}
                      draggable={false}
                      className="absolute inset-0 size-full cursor-pointer object-contain p-2"
                      onClick={() => setPreviewPage(page)}
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      Page {index + 1}
                    </span>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewPage(page)}
                        aria-label={`Preview page ${index + 1}`}
                        className="grid size-6 place-items-center rounded-full bg-white/95 text-gray-700 shadow hover:text-brand-700"
                      >
                        <Maximize2 className="size-3" />
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void removePage(page, index)}
                        aria-label={`Remove page ${index + 1}`}
                        className="grid size-6 place-items-center rounded-full bg-white/95 text-gray-700 shadow hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 p-2.5">
                    <input
                      value={titleValue}
                      onChange={(e) => setTitleEdits((prev) => ({ ...prev, [page.id]: e.target.value }))}
                      onBlur={() => void saveTitle(page)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
                      }}
                      placeholder={`Page ${index + 1} title (optional)`}
                      aria-label={`Title for page ${index + 1}`}
                      className={clsx(inputClass, "h-8 w-full text-xs")}
                    />

                    <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
                      <span className="truncate" title={page.fileName}>
                        {page.width && page.height ? `${page.width}×${page.height} · ` : ""}
                        {formatBytes(page.sizeBytes)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0 || pending}
                          onClick={() => void movePage(index, index - 1)}
                          aria-label={`Move page ${index + 1} left`}
                          className="grid size-6 place-items-center rounded-lg border border-line bg-white hover:border-brand-500 disabled:opacity-30"
                        >
                          <ChevronLeft className="size-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === pages.length - 1 || pending}
                          onClick={() => void movePage(index, index + 1)}
                          aria-label={`Move page ${index + 1} right`}
                          className="grid size-6 place-items-center rounded-lg border border-line bg-white hover:border-brand-500 disabled:opacity-30"
                        >
                          <ChevronRight className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}

            {uploading.map((u) => (
              <li key={u.key} className="card flex flex-col overflow-hidden opacity-80">
                <div className="relative h-28 w-full shrink-0 overflow-hidden bg-tile">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                  <img src={u.previewSrc} alt={u.name} className="absolute inset-0 size-full object-contain p-2 opacity-50" />
                  <div className="absolute inset-0 grid place-items-center">
                    <Loader2 className="size-6 animate-spin text-brand-700" />
                  </div>
                </div>
                <div className="truncate p-2.5 text-xs font-semibold text-muted">Uploading {u.name}…</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Nested subfolders if created */}
      {detail.subfolders.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Subfolders ({detail.subfolders.length})</h2>
          <MrFolderGrid folders={detail.subfolders} onEdit={(f) => setFolderDraft(toFolderDraft(f))} />
        </section>
      )}

      <MrFolderModal
        draft={folderDraft}
        onClose={() => setFolderDraft(null)}
        onCreated={(created) => router.push(`/admin/mr-folders/${created.id}`)}
      />

      <Modal open={!!previewPage} onClose={() => setPreviewPage(null)} title={previewPage?.title || previewPage?.fileName || "Preview"}>
        {previewPage && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution image preview */}
            <img src={previewPage.src} alt={previewPage.title || previewPage.fileName} className="max-h-[70vh] w-full rounded-xl bg-tile object-contain" />
            <p className="text-xs text-muted">
              {previewPage.fileName}
              {previewPage.width && previewPage.height ? ` · ${previewPage.width}×${previewPage.height}` : ""}
              {` · ${formatBytes(previewPage.sizeBytes)}`}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
