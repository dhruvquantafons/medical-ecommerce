import { and, isNull, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { productImages } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { PRODUCT_IMAGE_MAX_BYTES, PRODUCT_IMAGE_TYPES, productImagePath, sniffType } from "@/lib/files";

const ALLOWED: readonly string[] = PRODUCT_IMAGE_TYPES;

/**
 * Admin upload of one product photo (multipart field "file"). The photo is staged (no product yet)
 * until the product form is saved, which attaches it. Returns { id, src }.
 */
export async function POST(request: Request) {
  const user = await currentUser();
  if (user?.role !== "admin") return Response.json({ error: "Not authorised" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file uploaded." }, { status: 400 });
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) return Response.json({ error: `${file.name}: photo is larger than 3 MB` }, { status: 413 });

  const data = Buffer.from(await file.arrayBuffer());
  const type = sniffType(data);
  if (!type || !ALLOWED.includes(type)) return Response.json({ error: `${file.name}: only JPG, PNG or WEBP photos are allowed` }, { status: 415 });

  // Clear out photos that were uploaded but never saved with a product.
  await db.delete(productImages).where(and(isNull(productImages.productId), lt(productImages.createdAt, sql`now() - interval '1 day'`)));

  const [row] = await db.insert(productImages).values({ mimeType: type, sizeBytes: data.length, data }).returning({ id: productImages.id });
  return Response.json({ id: row.id, src: productImagePath(row.id) }, { status: 201 });
}
