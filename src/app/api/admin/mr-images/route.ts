import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { mrFolderImages, mrFolders } from "@/db/schema";
import { MR_IMAGE_MAX_BYTES, MR_IMAGE_TYPES, mrImagePath, sniffType } from "@/lib/files";
import { currentUser } from "@/lib/session";

const ALLOWED: readonly string[] = MR_IMAGE_TYPES;

function parseDimension(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 && n <= 20000 ? n : null;
}

/**
 * Admin upload of one high-quality MR visual-aid image (multipart field "file" + "folderId").
 * Stores the exact uploaded bytes without re-compression (strictly <= 4 MB).
 */
export async function POST(request: Request) {
  const user = await currentUser();
  if (user?.role !== "admin") return Response.json({ error: "Not authorised" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const folderId = typeof form?.get("folderId") === "string" ? String(form.get("folderId")).trim() : "";
  const title = typeof form?.get("title") === "string" ? String(form.get("title")).trim().slice(0, 140) : "";

  if (!folderId) return Response.json({ error: "Folder id is required." }, { status: 400 });
  if (!(file instanceof File)) return Response.json({ error: "No file uploaded." }, { status: 400 });
  if (file.size > MR_IMAGE_MAX_BYTES) {
    return Response.json({ error: `${file.name}: image must be under 4 MB` }, { status: 413 });
  }

  const [folder] = await db
    .select({ id: mrFolders.id, slug: mrFolders.slug })
    .from(mrFolders)
    .where(eq(mrFolders.id, folderId))
    .limit(1);
  if (!folder) return Response.json({ error: "Folder not found." }, { status: 404 });

  const data = Buffer.from(await file.arrayBuffer());
  const type = sniffType(data);
  if (!type || !ALLOWED.includes(type)) {
    return Response.json({ error: `${file.name}: only JPG, PNG or WEBP images are allowed` }, { status: 415 });
  }

  const width = parseDimension(form?.get("width") ?? null);
  const height = parseDimension(form?.get("height") ?? null);
  const fileName = (file.name || "slide").slice(0, 200);

  const [row] = await db.transaction(async (tx) => {
    const [{ nextOrder }] = await tx
      .select({ nextOrder: sql<number>`coalesce(max(${mrFolderImages.sortOrder}), -1) + 1` })
      .from(mrFolderImages)
      .where(eq(mrFolderImages.folderId, folderId));

    return tx
      .insert(mrFolderImages)
      .values({
        folderId,
        title,
        fileName,
        mimeType: type,
        sizeBytes: data.length,
        width,
        height,
        data,
        sortOrder: Number(nextOrder),
      })
      .returning({
        id: mrFolderImages.id,
        folderId: mrFolderImages.folderId,
        title: mrFolderImages.title,
        fileName: mrFolderImages.fileName,
        mimeType: mrFolderImages.mimeType,
        sizeBytes: mrFolderImages.sizeBytes,
        width: mrFolderImages.width,
        height: mrFolderImages.height,
        sortOrder: mrFolderImages.sortOrder,
        createdAt: mrFolderImages.createdAt,
      });
  });

  revalidatePath("/admin/mr-folders");
  revalidatePath(`/admin/mr-folders/${folderId}`);
  revalidatePath("/mr");
  revalidatePath(`/mr/${folder.slug}`);

  return Response.json({ ...row, src: mrImagePath(row.id) }, { status: 201 });
}

