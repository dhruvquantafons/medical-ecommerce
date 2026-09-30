import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { PRESCRIPTION_MAX_BYTES, sniffType } from "@/lib/files";

/** Upload a prescription (multipart form field "file"). Returns the stored prescription. */
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Please log in to upload a prescription." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file uploaded." }, { status: 400 });
  if (file.size > PRESCRIPTION_MAX_BYTES) return Response.json({ error: `${file.name}: file is larger than 2 MB` }, { status: 413 });

  const data = Buffer.from(await file.arrayBuffer());
  const type = sniffType(data);
  if (!type) return Response.json({ error: `${file.name}: only JPG, PNG, WEBP or PDF files are allowed` }, { status: 415 });

  const name = file.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || "prescription";
  const [row] = await db
    .insert(prescriptions)
    .values({ userId: user.id, fileName: name, mimeType: type, sizeBytes: data.length, data })
    .returning({ id: prescriptions.id, createdAt: prescriptions.createdAt });

  return Response.json({ id: row.id, name, type, url: `/api/prescriptions/${row.id}`, uploadedAt: row.createdAt.toISOString() }, { status: 201 });
}
