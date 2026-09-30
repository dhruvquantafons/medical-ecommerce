"use client";

import { FileText, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import clsx from "clsx";
import type { Prescription } from "@/data/types";
import { PRESCRIPTION_MAX_BYTES, PRESCRIPTION_TYPES } from "@/lib/files";

const ACCEPT: readonly string[] = PRESCRIPTION_TYPES;

/** Uploads prescriptions to the server. Calls `onAdded` with each stored prescription. */
export function RxDropzone({ onAdded, compact }: { onAdded?: (p: Prescription) => void; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    const errs: string[] = [];
    setUploading(true);
    for (const file of Array.from(files)) {
      // Quick client-side checks; the server re-checks the real file type and size.
      if (!ACCEPT.includes(file.type)) {
        errs.push(`${file.name}: only JPG, PNG, WEBP or PDF files are allowed`);
        continue;
      }
      if (file.size > PRESCRIPTION_MAX_BYTES) {
        errs.push(`${file.name}: file is larger than 2 MB`);
        continue;
      }
      const body = new FormData();
      body.append("file", file);
      try {
        const res = await fetch("/api/prescriptions", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) errs.push(data.error ?? `${file.name}: upload failed`);
        else onAdded?.(data as Prescription);
      } catch {
        errs.push(`${file.name}: upload failed. Check your connection and try again.`);
      }
    }
    setUploading(false);
    setErrors(errs);
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files);
        }}
        className={clsx(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
          compact ? "p-5" : "p-10",
          drag ? "border-brand-500 bg-brand-50" : "border-brand-200 bg-white hover:border-brand-500 hover:bg-brand-50/50",
        )}
      >
        <ImagePlus className={clsx("text-brand-600", compact ? "size-8" : "size-12", uploading && "animate-pulse")} />
        <span className="text-sm font-semibold">{uploading ? "Uploading…" : "Drag & drop or click to upload"}</span>
        <span className="text-xs text-muted">JPG, PNG, WEBP or PDF · up to 2 MB each</span>
      </button>
      <input ref={input} type="file" accept={ACCEPT.join(",")} multiple hidden onChange={(e) => handle(e.target.files)} />
      {errors.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-red-600">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
    </div>
  );
}

export function RxThumb({ rx, onRemove }: { rx: Prescription; onRemove?: () => void }) {
  const isImage = rx.type.startsWith("image/");
  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-white">
      <div className="grid aspect-[3/4] place-items-center bg-gray-50">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- authenticated file route, not optimisable
          <img src={rx.url} alt={rx.name} className="size-full object-cover" />
        ) : (
          <FileText className="size-10 text-red-500" />
        )}
      </div>
      <div className="p-2">
        <p className="truncate text-xs font-medium" title={rx.name}>{rx.name}</p>
        <p className="text-[11px] text-muted">{new Date(rx.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
      </div>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Delete ${rx.name}`} className="absolute top-1.5 right-1.5 rounded-full bg-white/90 p-1.5 text-red-600 shadow hover:bg-white">
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}
