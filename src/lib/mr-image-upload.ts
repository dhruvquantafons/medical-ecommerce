import { MR_IMAGE_MAX_BYTES, MR_IMAGE_TYPES } from "./files";
import { formatBytes, type MrFolderPage } from "./mr-folder-types";

const ALLOWED: readonly string[] = MR_IMAGE_TYPES;

export function filterValidMrImages(files: File[], onError: (message: string) => void): File[] {
  const accepted: File[] = [];
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      onError(`${file.name}: only JPG, PNG or WEBP images are allowed.`);
      continue;
    }
    if (file.size > MR_IMAGE_MAX_BYTES) {
      onError(`${file.name} is ${formatBytes(file.size)} — maximum image size is 4 MB.`);
      continue;
    }
    accepted.push(file);
  }
  return accepted;
}

export async function readImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  try {
    const bmp = await createImageBitmap(file);
    const dims = { width: bmp.width, height: bmp.height };
    bmp.close();
    return dims;
  } catch {
    return {};
  }
}

/** Uploads one full-resolution MR image (<= 4 MB, unmodified bytes) into `folderId`. */
export async function uploadMrImageFile(folderId: string, file: File): Promise<MrFolderPage> {
  const dims = await readImageDimensions(file);
  const body = new FormData();
  body.append("folderId", folderId);
  body.append("file", file, file.name);
  if (dims.width) body.append("width", String(dims.width));
  if (dims.height) body.append("height", String(dims.height));

  const res = await fetch("/api/admin/mr-images", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `${file.name}: upload failed`);

  return {
    ...json,
    createdAt: new Date(json.createdAt),
  };
}

