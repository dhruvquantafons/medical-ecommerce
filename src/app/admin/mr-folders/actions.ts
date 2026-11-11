"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { mrFolderImages, mrFolders } from "@/db/schema";
import { currentUser } from "@/lib/session";
import type { ActionResult } from "@/app/admin/actions";

async function assertAdmin() {
  const u = await currentUser();
  if (u?.role !== "admin") throw new Error("Not authorised");
  return u;
}

function fail(error: z.ZodError): ActionResult<never> {
  const fieldErrors = Object.fromEntries(error.issues.map((i) => [String(i.path[0] ?? "form"), i.message]));
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const [row] = await db
    .select({ id: mrFolders.id })
    .from(mrFolders)
    .where(exceptId ? and(eq(mrFolders.slug, slug), ne(mrFolders.id, exceptId)) : eq(mrFolders.slug, slug))
    .limit(1);
  return Boolean(row);
}

async function resolveUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "folder";
  if (!(await isSlugTaken(base))) return base;
  for (let i = 2; i <= 20; i++) {
    const candidate = `${base}-${i}`;
    if (!(await isSlugTaken(candidate))) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

function revalidateMrPaths(folderIds: (string | null | undefined)[], slugs: (string | null | undefined)[]) {
  revalidatePath("/admin/mr-folders");
  revalidatePath("/mr");
  for (const id of folderIds) {
    if (id) revalidatePath(`/admin/mr-folders/${id}`);
  }
  for (const slug of slugs) {
    if (slug) revalidatePath(`/mr/${slug}`);
  }
}

const folderInput = z.object({
  name: z.string().trim().min(1, "Enter a folder name").max(120),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().max(400).default(""),
  parentId: z.string().trim().optional().nullable().transform((v) => v || null),
  sortOrder: z.coerce.number().int("Whole numbers only").min(0).max(9999).default(0),
  active: z.boolean().default(true),
});

export async function createMrFolder(input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  await assertAdmin();
  const parsed = folderInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const { name, slug: rawSlug, description, parentId, sortOrder, active } = parsed.data;
  if (parentId) {
    const [parent] = await db.select({ id: mrFolders.id }).from(mrFolders).where(eq(mrFolders.id, parentId)).limit(1);
    if (!parent) return { ok: false, error: "Parent folder not found." };
  }

  let slug: string;
  if (rawSlug) {
    slug = slugify(rawSlug);
    if (!slug) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Enter a valid URL slug" } };
    if (await isSlugTaken(slug)) {
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Another folder already uses this link slug" } };
    }
  } else {
    slug = await resolveUniqueSlug(name);
  }

  const [row] = await db
    .insert(mrFolders)
    .values({ name, slug, description, parentId, sortOrder, active })
    .returning({ id: mrFolders.id, slug: mrFolders.slug });

  revalidateMrPaths([row.id, parentId], [row.slug]);
  return { ok: true, data: row, message: "Folder created." };
}

export async function updateMrFolder(id: string, input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  await assertAdmin();
  const parsed = folderInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const [existing] = await db
    .select({ id: mrFolders.id, slug: mrFolders.slug, parentId: mrFolders.parentId })
    .from(mrFolders)
    .where(eq(mrFolders.id, id))
    .limit(1);
  if (!existing) return { ok: false, error: "Folder not found." };

  const { name, slug: rawSlug, description, sortOrder, active } = parsed.data;
  const slug = rawSlug ? slugify(rawSlug) : existing.slug;
  if (!slug) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Enter a valid URL slug" } };
  if (await isSlugTaken(slug, id)) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Another folder already uses this link slug" } };
  }

  const [updated] = await db
    .update(mrFolders)
    .set({ name, slug, description, sortOrder, active })
    .where(eq(mrFolders.id, id))
    .returning({ id: mrFolders.id, slug: mrFolders.slug });

  revalidateMrPaths([id, existing.parentId], [existing.slug, updated.slug]);
  return { ok: true, data: updated, message: "Folder saved." };
}

export async function deleteMrFolder(id: string): Promise<ActionResult> {
  await assertAdmin();
  const [existing] = await db
    .select({ id: mrFolders.id, slug: mrFolders.slug, parentId: mrFolders.parentId })
    .from(mrFolders)
    .where(eq(mrFolders.id, id))
    .limit(1);
  if (!existing) return { ok: false, error: "Folder not found." };

  await db.delete(mrFolders).where(eq(mrFolders.id, id));
  revalidateMrPaths([id, existing.parentId], [existing.slug]);
  return { ok: true, data: null, message: "Folder deleted." };
}

const imageTitleInput = z.object({
  imageId: z.string().min(1),
  title: z.string().trim().max(140),
});

export async function updateMrImageTitle(input: unknown): Promise<ActionResult> {
  await assertAdmin();
  const parsed = imageTitleInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);

  const [img] = await db
    .update(mrFolderImages)
    .set({ title: parsed.data.title })
    .where(eq(mrFolderImages.id, parsed.data.imageId))
    .returning({ folderId: mrFolderImages.folderId });
  if (!img) return { ok: false, error: "Image not found." };

  const [folder] = await db.select({ slug: mrFolders.slug }).from(mrFolders).where(eq(mrFolders.id, img.folderId)).limit(1);
  revalidateMrPaths([img.folderId], [folder?.slug]);
  return { ok: true, data: null, message: "Page title saved." };
}

const reorderInput = z.object({
  folderId: z.string().min(1),
  orderedImageIds: z.array(z.string().min(1)).min(1),
});

export async function reorderMrImages(input: unknown): Promise<ActionResult> {
  await assertAdmin();
  const parsed = reorderInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid image order." };

  const { folderId, orderedImageIds } = parsed.data;
  const [folder] = await db.select({ slug: mrFolders.slug }).from(mrFolders).where(eq(mrFolders.id, folderId)).limit(1);
  if (!folder) return { ok: false, error: "Folder not found." };

  await db.transaction(async (tx) => {
    for (const [sortOrder, imageId] of orderedImageIds.entries()) {
      await tx
        .update(mrFolderImages)
        .set({ sortOrder })
        .where(and(eq(mrFolderImages.id, imageId), eq(mrFolderImages.folderId, folderId)));
    }
  });

  revalidateMrPaths([folderId], [folder.slug]);
  return { ok: true, data: null, message: "Page order updated." };
}

export async function deleteMrImage(imageId: string): Promise<ActionResult> {
  await assertAdmin();
  const [img] = await db
    .delete(mrFolderImages)
    .where(eq(mrFolderImages.id, imageId))
    .returning({ folderId: mrFolderImages.folderId });
  if (!img) return { ok: false, error: "Image not found." };

  const [folder] = await db.select({ slug: mrFolders.slug }).from(mrFolders).where(eq(mrFolders.id, img.folderId)).limit(1);
  revalidateMrPaths([img.folderId], [folder?.slug]);
  return { ok: true, data: null, message: "Page removed." };
}

