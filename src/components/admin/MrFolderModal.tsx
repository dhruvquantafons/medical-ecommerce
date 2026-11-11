"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MR_IMAGE_TYPES } from "@/lib/files";
import { formatBytes } from "@/lib/mr-folder-types";
import { filterValidMrImages, uploadMrImageFile } from "@/lib/mr-image-upload";
import { createMrFolder, updateMrFolder } from "@/app/admin/mr-folders/actions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useAdminAction } from "./useAdminAction";
import { inputClass } from "./ui";

export interface FolderDraft {
  id: string | null;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  active: boolean;
}

interface QueuedFile {
  key: string;
  file: File;
  previewSrc: string;
}

function MrFolderModalForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: FolderDraft;
  onClose: () => void;
  onCreated?: (created: { id: string; slug: string }) => void;
}) {
  const { run, pending } = useAdminAction();
  const toast = useToast((s) => s.show);
  const fileInput = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<FolderDraft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [queued, setQueued] = useState<QueuedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const queuedRef = useRef<QueuedFile[]>([]);

  const set = (patch: Partial<FolderDraft>) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    queuedRef.current = queued;
  }, [queued]);

  useEffect(() => {
    return () => {
      for (const item of queuedRef.current) URL.revokeObjectURL(item.previewSrc);
    };
  }, []);

  function addImages(fileList: FileList | File[]) {
    const valid = filterValidMrImages([...fileList], (msg) => toast(msg, "error"));
    if (!valid.length) return;
    setQueued((prev) => [
      ...prev,
      ...valid.map((file) => ({
        key: crypto.randomUUID(),
        file,
        previewSrc: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeQueued(key: string) {
    setQueued((prev) => {
      const target = prev.find((q) => q.key === key);
      if (target) URL.revokeObjectURL(target.previewSrc);
      return prev.filter((q) => q.key !== key);
    });
  }

  async function save() {
    const payload = {
      name: draft.name,
      slug: draft.slug.trim() || undefined,
      description: draft.description,
      parentId: draft.parentId,
      sortOrder: draft.sortOrder,
      active: draft.active,
    };

    if (draft.id) {
      const res = await run(() => updateMrFolder(draft.id!, payload));
      if (res.ok) onClose();
      else setErrors(res.fieldErrors ?? {});
      return;
    }

    const res = await run(() => createMrFolder(payload));
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      return;
    }

    if (queued.length > 0) {
      let uploaded = 0;
      for (let i = 0; i < queued.length; i += 3) {
        const batch = queued.slice(i, i + 3);
        setUploadStatus(`Uploading images (${Math.min(i + batch.length, queued.length)}/${queued.length})…`);
        const results = await Promise.allSettled(batch.map((q) => uploadMrImageFile(res.data.id, q.file)));
        for (const result of results) {
          if (result.status === "fulfilled") uploaded++;
          else toast(result.reason instanceof Error ? result.reason.message : "Image upload failed", "error");
        }
      }
      setUploadStatus(null);
      if (uploaded > 0) toast(`${uploaded} high-quality ${uploaded === 1 ? "image" : "images"} uploaded.`);
    }

    onClose();
    onCreated?.(res.data);
  }

  const busy = pending || uploadStatus !== null;

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-gray-600">Folder name</span>
        <input
          value={draft.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="e.g. Calcitium-D3"
          className={clsx(inputClass, "w-full", errors.name && "border-red-400")}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void save();
            }
          }}
        />
        {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
      </label>

      {/* Direct image upload section when creating a folder */}
      {!draft.id && (
        <div>
          <span className="mb-1 block text-xs font-semibold text-gray-600">
            Images / visual-aid pages <span className="font-normal text-muted">(JPG, PNG, WEBP · max 4 MB each)</span>
          </span>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length) addImages(e.dataTransfer.files);
            }}
            className="rounded-xl border-2 border-dashed border-line bg-gray-50/70 p-3"
          >
            {queued.length > 0 && (
              <ul className="mb-3 grid grid-cols-3 gap-2">
                {queued.map((q, idx) => (
                  <li key={q.key} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                    <img src={q.previewSrc} alt={q.file.name} className="size-full object-contain p-1" />
                    <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQueued(q.key)}
                      aria-label={`Remove ${q.file.name}`}
                      className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-white/95 text-gray-700 shadow hover:text-red-600"
                    >
                      <X className="size-3" />
                    </button>
                    <span className="absolute inset-x-1 bottom-1 truncate rounded bg-white/90 px-1 text-[10px] text-gray-700">
                      {formatBytes(q.file.size)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-xs font-semibold text-brand-700 hover:border-brand-500 hover:bg-brand-50"
            >
              <ImagePlus className="size-4" />
              <span>{queued.length ? "Add more images" : "Select or drop high-quality images"}</span>
            </button>
            <input
              ref={fileInput}
              type="file"
              accept={MR_IMAGE_TYPES.join(",")}
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) addImages(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-gray-600">
          Description <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          rows={2}
          value={draft.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Short note shown to MRs on the folder card"
          className={clsx(
            "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
            errors.description && "border-red-400",
          )}
        />
        {errors.description && <span className="text-xs text-red-600">{errors.description}</span>}
      </label>

      <details className="rounded-lg border border-line/80 bg-gray-50/60 px-3 py-2">
        <summary className="cursor-pointer text-xs font-semibold text-gray-600">
          Link slug & display options
        </summary>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">
              Link slug <span className="font-normal text-muted">(auto-generated if blank)</span>
            </span>
            <input
              value={draft.slug}
              onChange={(e) => set({ slug: e.target.value })}
              placeholder="e.g. calcitium-d3"
              className={clsx(inputClass, "w-full", errors.slug && "border-red-400")}
            />
            <span className={clsx("text-xs", errors.slug ? "text-red-600" : "text-muted")}>
              {errors.slug || `/mr/${draft.slug.trim() || "auto-from-name"}`}
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Order</span>
              <input
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(e) => set({ sortOrder: Number(e.target.value) })}
                className={clsx(inputClass, "w-full")}
              />
            </label>

            <label className="flex cursor-pointer items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => set({ active: e.target.checked })}
                className="size-4 rounded border-line accent-brand-600"
              />
              <span className="text-sm font-semibold">Visible to MRs</span>
            </label>
          </div>
        </div>
      </details>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button type="button" onClick={() => void save()} disabled={busy}>
          {uploadStatus ?? (pending ? "Saving…" : draft.id ? "Save" : queued.length ? `Create & upload (${queued.length})` : "Create folder")}
        </Button>
      </div>
    </div>
  );
}

export function MrFolderModal({
  draft,
  onClose,
  onCreated,
}: {
  draft: FolderDraft | null;
  onClose: () => void;
  onCreated?: (created: { id: string; slug: string }) => void;
}) {
  return (
    <Modal
      open={!!draft}
      onClose={onClose}
      title={draft?.id ? "Edit folder" : draft?.parentId ? "New subfolder" : "New medicine folder"}
    >
      {draft && (
        <MrFolderModalForm
          key={`${draft.id ?? "new"}:${draft.parentId ?? "root"}`}
          initial={draft}
          onClose={onClose}
          onCreated={onCreated}
        />
      )}
    </Modal>
  );
}
