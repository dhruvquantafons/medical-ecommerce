"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import clsx from "clsx";
import { MAX_PRODUCT_IMAGES, PRODUCT_IMAGE_MAX_BYTES, PRODUCT_IMAGE_TYPES } from "@/lib/files";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { inputClass } from "./ui";

/** One photo in the admin form. `uploadId` = stored upload; otherwise `src` is an external URL. */
export interface ImageItem {
  key: string;
  src: string;
  uploadId?: string;
  uploading?: boolean;
}

/** What the server action receives in the "images" form field. */
export const serializeImages = (items: ImageItem[]) =>
  JSON.stringify(items.filter((i) => !i.uploading).map((i) => (i.uploadId ? { id: i.uploadId } : { url: i.src })));

const ACCEPT: readonly string[] = PRODUCT_IMAGE_TYPES;
const MAX_EDGE = 2000;
const SHRINK_ABOVE = 1024 * 1024;

const toBlob = (canvas: HTMLCanvasElement, type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.88));

/** Downscales big photos in the browser (longest edge 2000px) so uploads stay small. Falls back to the original. */
async function shrink(file: File): Promise<Blob> {
  if (file.size <= SHRINK_ABOVE) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    // Safari can't encode WebP and silently returns PNG; use JPEG there.
    let blob = await toBlob(canvas, "image/webp");
    if (blob?.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg");
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ProductImagesField({
  items,
  update,
  error,
}: {
  items: ImageItem[];
  update: (fn: (prev: ImageItem[]) => ImageItem[]) => void;
  error?: string;
}) {
  const toast = useToast((s) => s.show);
  const fileInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const room = MAX_PRODUCT_IMAGES - items.length;

  async function upload(item: ImageItem, file: File) {
    try {
      const blob = await shrink(file);
      if (blob.size > PRODUCT_IMAGE_MAX_BYTES) throw new Error(`${file.name}: photo is larger than 3 MB`);
      const body = new FormData();
      body.append("file", blob, file.name);
      const res = await fetch("/api/admin/product-images", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `${file.name}: upload failed`);
      update((prev) => prev.map((i) => (i.key === item.key ? { key: item.key, src: json.src, uploadId: json.id } : i)));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed", "error");
      update((prev) => prev.filter((i) => i.key !== item.key));
    } finally {
      URL.revokeObjectURL(item.src);
    }
  }

  function addFiles(files: FileList | File[]) {
    const all = [...files];
    const valid = all.filter((f) => ACCEPT.includes(f.type));
    if (valid.length < all.length) toast("Only JPG, PNG or WEBP photos can be uploaded.", "error");
    if (valid.length > room) toast(`A product can have up to ${MAX_PRODUCT_IMAGES} photos.`, "error");
    const accepted = valid.slice(0, Math.max(0, room));
    if (!accepted.length) return;
    const pending = accepted.map((f) => ({ key: crypto.randomUUID(), src: URL.createObjectURL(f), uploading: true }));
    update((prev) => [...prev, ...pending]);
    pending.forEach((item, i) => upload(item, accepted[i]));
  }

  function addUrl() {
    const value = url.trim();
    if (!/^https:\/\/\S+$/.test(value)) return toast("Enter a full https:// image URL.", "error");
    if (room <= 0) return toast(`A product can have up to ${MAX_PRODUCT_IMAGES} photos.`, "error");
    update((prev) => [...prev, { key: crypto.randomUUID(), src: value }]);
    setUrl("");
  }

  const reorder = (from: number, to: number) => update((prev) => (to < 0 || to >= prev.length ? prev : move(prev, from, to)));

  function onDrop(e: DragEvent, to?: number) {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    else if (dragFrom !== null && to !== undefined) reorder(dragFrom, to);
    setDragFrom(null);
  }

  return (
    <div className="sm:col-span-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (e.dataTransfer.types.includes("Files")) setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(e) => onDrop(e)}
        className={clsx("rounded-xl border-2 border-dashed p-3 transition", dropActive ? "border-brand-500 bg-brand-50" : error ? "border-red-300" : "border-line")}
      >
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item.key}
              draggable={!item.uploading}
              onDragStart={() => setDragFrom(i)}
              onDragEnd={() => setDragFrom(null)}
              onDrop={(e) => {
                e.stopPropagation();
                onDrop(e, i);
              }}
              className={clsx("group relative aspect-square overflow-hidden rounded-lg border bg-tile", i === 0 ? "border-brand-500" : "border-line", dragFrom === i && "opacity-40")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- uploads, blob previews and admin URLs on any host */}
              <img src={item.src} alt={`Photo ${i + 1}`} className={clsx("size-full object-contain p-1.5", item.uploading && "opacity-50")} draggable={false} />
              {i === 0 && <span className="absolute top-1.5 left-1.5 rounded-full bg-brand-800 px-2 py-0.5 text-[10px] font-semibold text-white">Main</span>}
              {item.uploading ? (
                <span className="absolute inset-0 grid place-items-center">
                  <Loader2 className="size-6 animate-spin text-brand-800" aria-label="Uploading" />
                </span>
              ) : (
                <>
                  <button type="button" onClick={() => update((prev) => prev.filter((p) => p.key !== item.key))} aria-label={`Remove photo ${i + 1}`} className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-white/90 text-gray-700 shadow hover:text-red-600">
                    <X className="size-3.5" />
                  </button>
                  <span className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                    <button type="button" onClick={() => reorder(i, i - 1)} disabled={i === 0} aria-label={`Move photo ${i + 1} left`} className="grid size-6 place-items-center rounded-full bg-white/90 shadow disabled:invisible">
                      <ChevronLeft className="size-3.5" />
                    </button>
                    {i > 0 && (
                      <button type="button" onClick={() => reorder(i, 0)} aria-label={`Make photo ${i + 1} the main photo`} className="flex items-center gap-1 rounded-full bg-white/90 px-2 text-[10px] font-semibold shadow">
                        <Star className="size-3" /> Main
                      </button>
                    )}
                    <button type="button" onClick={() => reorder(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move photo ${i + 1} right`} className="grid size-6 place-items-center rounded-full bg-white/90 shadow disabled:invisible">
                      <ChevronRight className="size-3.5" />
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
          {room > 0 && (
            <li>
              <button type="button" onClick={() => fileInput.current?.click()} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-line bg-white text-xs font-semibold text-brand-700 hover:border-brand-500 hover:bg-brand-50">
                <ImagePlus className="size-6" />
                Add photos
              </button>
            </li>
          )}
        </ul>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="mt-3 text-xs text-muted">
          Up to {MAX_PRODUCT_IMAGES} JPG, PNG or WEBP photos. Drop files here, or drag photos to reorder; the first is the main photo. Square photos on a plain light background look best. With no photos, a drawn placeholder is shown.
        </p>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="…or paste an https:// image URL"
          aria-label="Image URL"
          className={clsx(inputClass, "min-w-0 flex-1")}
        />
        <Button type="button" variant="outline" onClick={addUrl} disabled={!url.trim() || room <= 0}>
          Add URL
        </Button>
      </div>
    </div>
  );
}
