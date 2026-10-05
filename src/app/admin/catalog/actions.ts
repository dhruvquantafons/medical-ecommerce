"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { catalogItems } from "@/db/schema";
import { currentUser } from "@/lib/session";
import type { ActionResult } from "@/app/admin/actions";

async function assertAdmin() {
  const u = await currentUser();
  if (u?.role !== "admin") throw new Error("Not authorised");
  return u;
}

function fail(error: z.ZodError): ActionResult<never> {
  const fieldErrors = Object.fromEntries(
    error.issues.map((i) => [String(i.path[0] ?? "form"), i.message]),
  );
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
}

type ParseSaltsResult =
  | { ok: true; salts: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

/** Parse one-salt-per-line JSON textarea into a validated array. */
function parseSaltsInput(raw: string): ParseSaltsResult {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const saltSchema = z.object({
    name: z.string().min(1),
    amount: z.string().min(1),
    percentage: z.number().min(0).max(100),
    purpose: z.string().min(1),
    casNumber: z.string().min(1),
  });
  const parsed = [];
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      const result = saltSchema.safeParse(obj);
      if (!result.success) {
        return { ok: false, error: `Invalid salt line: ${line.slice(0, 60)}`, fieldErrors: { salts: result.error.issues[0]?.message ?? "Invalid salt" } };
      }
      parsed.push(result.data);
    } catch {
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { salts: `Could not parse line as JSON: ${line.slice(0, 60)}` } };
    }
  }
  return { ok: true, salts: JSON.stringify(parsed) };
}

const CATEGORIES = ["Prescription (Rx)", "Over-The-Counter (OTC)", "Biotech Formulations", "Nutraceuticals"] as const;
const DOSE_FORMS = ["Capsule", "Tablet", "Syrup", "Injectable", "Ointment"] as const;
const AVAILABILITIES = ["In Stock", "Prescription Required", "Limited Batch"] as const;

const catalogInput = z.object({
  name: z.string().trim().min(2, "Enter a name").max(160),
  brand: z.string().trim().min(1, "Enter the brand").max(160),
  category: z.enum(CATEGORIES, { message: "Choose a category" }),
  description: z.string().trim().max(4000).default(""),
  dosageForm: z.enum(DOSE_FORMS, { message: "Choose a dosage form" }),
  digitalVerifiedId: z.string().trim().max(100).default(""),
  googleIndexed: z.boolean().default(true),
  eCommerceReady: z.boolean().default(true),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewsCount: z.coerce.number().int().min(0).default(0),
  priceEstimate: z.string().trim().max(40).default(""),
  availability: z.enum(AVAILABILITIES).default("In Stock"),
  imageUrl: z.string().trim().max(2000).optional().transform((v) => v || null).pipe(
    z.string().url("Enter a valid URL").nullable(),
  ),
  imageGradient: z.string().trim().max(500).default(""),
  molecularFormula: z.string().trim().max(300).default(""),
  bioavailability: z.string().trim().max(80).default(""),
  halfLife: z.string().trim().max(80).default(""),
  saltsRaw: z.string().default(""),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(true),
});

function revalidateAll() {
  revalidatePath("/admin/catalog");
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/catalog");
}

export async function createCatalogItem(input: unknown): Promise<ActionResult<{ id: string }>> {
  await assertAdmin();
  const parsed = catalogInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const saltsResult = parseSaltsInput(parsed.data.saltsRaw);
  if (!saltsResult.ok) return saltsResult as ActionResult<never>;

  const { saltsRaw: _, ...values } = parsed.data;
  const [row] = await db
    .insert(catalogItems)
    .values({ ...values, salts: saltsResult.salts })
    .returning({ id: catalogItems.id });

  revalidateAll();
  return { ok: true, data: { id: row.id }, message: "Catalog item created." };
}

export async function updateCatalogItem(id: string, input: unknown): Promise<ActionResult<{ id: string }>> {
  await assertAdmin();
  const parsed = catalogInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const saltsResult = parseSaltsInput(parsed.data.saltsRaw);
  if (!saltsResult.ok) return saltsResult as ActionResult<never>;

  const { saltsRaw: _, ...values } = parsed.data;
  const updated = await db
    .update(catalogItems)
    .set({ ...values, salts: saltsResult.salts })
    .where(eq(catalogItems.id, id))
    .returning({ id: catalogItems.id });

  if (!updated.length) return { ok: false, error: "Item not found." };

  revalidateAll();
  return { ok: true, data: { id }, message: "Catalog item saved." };
}

export async function deleteCatalogItem(id: string): Promise<ActionResult<null>> {
  await assertAdmin();
  await db.delete(catalogItems).where(eq(catalogItems.id, id));
  revalidateAll();
  return { ok: true, data: null, message: "Catalog item deleted." };
}
