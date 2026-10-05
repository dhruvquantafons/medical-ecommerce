"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { employees } from "@/db/schema";
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

const employeeInput = z.object({
  name: z.string().trim().min(2, "Enter a name").max(120),
  role: z.string().trim().min(1, "Enter a role").max(120),
  bio: z.string().trim().max(1000).default(""),
  photoUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null)
    .pipe(
      z.string().url("Enter a valid https:// URL").startsWith("https://", "Use an https:// URL").nullable(),
    ),
  sortOrder: z.coerce.number().int("Whole numbers only").min(0).max(999).default(0),
  active: z.boolean().default(true),
});

export async function createEmployee(input: unknown): Promise<ActionResult<{ id: string }>> {
  await assertAdmin();
  const parsed = employeeInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const [row] = await db
    .insert(employees)
    .values(parsed.data)
    .returning({ id: employees.id });

  revalidatePath("/admin/employees");
  return { ok: true, data: { id: row.id }, message: "Employee created." };
}

export async function updateEmployee(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await assertAdmin();
  const parsed = employeeInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const updated = await db
    .update(employees)
    .set(parsed.data)
    .where(eq(employees.id, id))
    .returning({ id: employees.id });

  if (!updated.length) return { ok: false, error: "Employee not found." };

  revalidatePath("/admin/employees");
  return { ok: true, data: { id }, message: "Employee saved." };
}

export async function deleteEmployee(id: string): Promise<ActionResult<null>> {
  await assertAdmin();

  await db.delete(employees).where(eq(employees.id, id));

  revalidatePath("/admin/employees");
  return { ok: true, data: null, message: "Employee deleted." };
}
