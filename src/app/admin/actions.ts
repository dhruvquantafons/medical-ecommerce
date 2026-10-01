"use server";

import { and, count, eq, inArray, isNotNull, isNull, ne, notInArray, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { categories, orderItems, orders, productImages, products, session, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { currentUser } from "@/lib/session";
import { MAX_PRODUCT_IMAGES } from "@/lib/files";
import { ICON_NAMES } from "@/components/ui/Icon";

// Every action re-checks the admin role: server actions are public HTTP endpoints.

export type ActionResult<T = null> = { ok: true; data: T; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

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

// ---- Orders

const RX_GATED: string[] = ["packed", "shipped", "delivered"];

/** Adds an order's quantities back to stock (used when a stock-deducted order is cancelled). */
async function restock(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], orderId: string) {
  const items = await tx.select({ productId: orderItems.productId, qty: orderItems.qty }).from(orderItems).where(eq(orderItems.orderId, orderId));
  for (const i of items) await tx.update(products).set({ stock: sql`${products.stock} + ${i.qty}` }).where(eq(products.id, i.productId));
  await tx.update(orders).set({ stockDeducted: false }).where(eq(orders.id, orderId));
}

const statusInput = z.object({
  orderId: z.string().min(1),
  status: z.enum(["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"]),
});

export async function updateOrderStatus(input: unknown): Promise<ActionResult> {
  await assertAdmin();
  const parsed = statusInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid status" };
  const { orderId, status } = parsed.data;

  const result = await db.transaction(async (tx): Promise<ActionResult> => {
    const [o] = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update");
    if (!o) return { ok: false, error: "Order not found" };
    if (o.status === status) return { ok: true, data: null };
    if (o.status === "delivered" || o.status === "cancelled") return { ok: false, error: `A ${o.status} order can't be changed.` };
    if (o.paymentMethod === "online" && o.paymentStatus !== "paid" && status !== "cancelled") {
      return { ok: false, error: "This online order hasn't been paid yet." };
    }
    if (RX_GATED.includes(status) && (o.rxStatus === "pending" || o.rxStatus === "rejected")) {
      return { ok: false, error: "Approve the prescription before packing or shipping this order." };
    }
    await tx.update(orders).set({ status }).where(eq(orders.id, orderId));
    if (status === "cancelled" && o.stockDeducted) await restock(tx, orderId);
    const refund = status === "cancelled" && o.paymentStatus === "paid" ? " Refund the payment from the Razorpay dashboard." : "";
    return { ok: true, data: null, message: `Order marked ${status}.${refund}` };
  });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return result;
}

const rxInput = z.discriminatedUnion("decision", [
  z.object({ orderId: z.string().min(1), decision: z.literal("approve"), note: z.string().max(500).optional() }),
  z.object({ orderId: z.string().min(1), decision: z.literal("reject"), note: z.string().trim().min(3, "Tell the customer why").max(500) }),
]);

/** Approving confirms a newly placed order; rejecting cancels it (and restocks). */
export async function reviewPrescription(input: unknown): Promise<ActionResult> {
  await assertAdmin();
  const parsed = rxInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);
  const { orderId, decision, note } = parsed.data;

  const result = await db.transaction(async (tx): Promise<ActionResult> => {
    const [o] = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update");
    if (!o) return { ok: false, error: "Order not found" };
    if (o.rxStatus === "not_required") return { ok: false, error: "This order doesn't need a prescription." };
    if (o.status === "cancelled" || o.status === "delivered") return { ok: false, error: `This order is already ${o.status}.` };
    if (decision === "approve") {
      await tx
        .update(orders)
        .set({ rxStatus: "approved", rxNote: note || null, status: o.status === "placed" ? "confirmed" : o.status })
        .where(eq(orders.id, orderId));
      return { ok: true, data: null, message: "Prescription approved and order confirmed." };
    }
    await tx.update(orders).set({ rxStatus: "rejected", rxNote: note, status: "cancelled" }).where(eq(orders.id, orderId));
    if (o.stockDeducted) await restock(tx, orderId);
    const refund = o.paymentStatus === "paid" ? " Refund the payment from the Razorpay dashboard." : "";
    return { ok: true, data: null, message: `Prescription rejected and order cancelled.${refund}` };
  });
  revalidatePath("/admin/prescriptions");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return result;
}

// ---- Products

const lines = (v: unknown) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const httpsUrl = z.string().trim().url("Enter a full https:// URL").startsWith("https://", "Use an https:// URL").max(2000);

/** Ordered photos: an uploaded photo by id, or an external image URL. */
const imageList = z
  .array(z.union([z.object({ id: z.string().uuid() }), z.object({ url: httpsUrl })]))
  .max(MAX_PRODUCT_IMAGES, `Up to ${MAX_PRODUCT_IMAGES} photos per product`);

const money = z.coerce.number().min(0, "Must be 0 or more").max(1_000_000);

const productInput = z
  .object({
    name: z.string().trim().min(2, "Enter a product name").max(160),
    slug: z.string().trim().max(160).optional(),
    brand: z.string().trim().min(1, "Enter the brand").max(80),
    manufacturer: z.string().trim().min(1, "Enter the manufacturer").max(120),
    categoryId: z.coerce.number().int().positive("Choose a collection"),
    form: z.enum(["tablet", "capsule", "syrup", "cream", "drops", "powder", "device", "pack", "bottle"]),
    packSize: z.string().trim().min(1, "Enter the pack size").max(80),
    mrp: money.refine((v) => v > 0, "MRP must be more than 0"),
    price: money,
    stock: z.coerce.number().int("Whole numbers only").min(0).max(1_000_000),
    rxRequired: z.boolean(),
    active: z.boolean(),
    composition: z.string().trim().max(300).default(""),
    description: z.string().trim().max(4000).default(""),
    howToUse: z.string().trim().max(2000).default(""),
    storage: z.string().trim().max(500).default(""),
    uses: z.array(z.string().max(200)).max(30),
    sideEffects: z.array(z.string().max(200)).max(30),
    safetyAdvice: z.array(z.string().max(300)).max(30),
    tags: z.array(z.string().max(40)).max(30),
    images: imageList,
  })
  .refine((d) => d.price <= d.mrp, { message: "Selling price can't be more than MRP", path: ["price"] });

function parseJson(v: FormDataEntryValue | null) {
  try {
    return JSON.parse(String(v ?? "[]"));
  } catch {
    return null;
  }
}

function readProduct(form: FormData) {
  const get = (k: string) => form.get(k);
  return productInput.safeParse({
    name: get("name"),
    slug: get("slug") || undefined,
    brand: get("brand"),
    manufacturer: get("manufacturer"),
    categoryId: get("categoryId"),
    form: get("form"),
    packSize: get("packSize"),
    mrp: get("mrp"),
    price: get("price"),
    stock: get("stock"),
    rxRequired: get("rxRequired") === "on",
    active: get("active") === "on",
    composition: get("composition") ?? "",
    description: get("description") ?? "",
    howToUse: get("howToUse") ?? "",
    storage: get("storage") ?? "",
    uses: lines(get("uses")),
    sideEffects: lines(get("sideEffects")),
    safetyAdvice: lines(get("safetyAdvice")),
    tags: String(get("tags") ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    images: parseJson(get("images")),
  });
}

/** Product table values; photos are saved separately by saveProductImages. */
function productValues({ images, ...d }: z.infer<typeof productInput>) {
  void images;
  const { mrp, price, slug, ...rest } = d;
  return {
    ...rest,
    slug: slugify(slug || d.name),
    mrpPaise: Math.round(mrp * 100),
    pricePaise: Math.round(price * 100),
  };
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Makes the product's photos exactly `images`, in that order: attaches staged uploads,
 * removes photos no longer listed, and re-creates external URL rows.
 */
async function saveProductImages(tx: Tx, productId: string, images: z.infer<typeof imageList>) {
  const uploadIds = images.flatMap((i) => ("id" in i ? [i.id] : []));
  await tx
    .delete(productImages)
    .where(
      and(
        eq(productImages.productId, productId),
        uploadIds.length ? or(isNotNull(productImages.url), notInArray(productImages.id, uploadIds)) : undefined,
      ),
    );
  if (uploadIds.length) {
    const usable = await tx
      .select({ id: productImages.id })
      .from(productImages)
      .where(and(inArray(productImages.id, uploadIds), isNotNull(productImages.data), or(isNull(productImages.productId), eq(productImages.productId, productId))));
    if (usable.length !== new Set(uploadIds).size) throw new MissingImageError();
  }
  for (const [sortOrder, img] of images.entries()) {
    if ("id" in img) await tx.update(productImages).set({ productId, sortOrder }).where(eq(productImages.id, img.id));
    else await tx.insert(productImages).values({ productId, sortOrder, url: img.url });
  }
}

class MissingImageError extends Error {}
const missingImage: ActionResult<never> = {
  ok: false,
  error: "Please fix the highlighted fields.",
  fieldErrors: { images: "A photo could not be found (it may have expired). Remove it and upload it again." },
};

async function slugTaken(table: typeof products | typeof categories, slug: string, exceptId?: string | number) {
  const [row] =
    table === products
      ? await db.select({ n: count() }).from(products).where(exceptId ? and(eq(products.slug, slug), ne(products.id, String(exceptId))) : eq(products.slug, slug))
      : await db.select({ n: count() }).from(categories).where(exceptId ? and(eq(categories.slug, slug), ne(categories.id, Number(exceptId))) : eq(categories.slug, slug));
  return row.n > 0;
}

function revalidateStore(slug?: string) {
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function createProduct(form: FormData): Promise<ActionResult<{ id: string }>> {
  await assertAdmin();
  const parsed = readProduct(form);
  if (!parsed.success) return fail(parsed.error);
  const values = productValues(parsed.data);
  if (!values.slug) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Enter a URL slug" } };
  if (await slugTaken(products, values.slug)) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Another product already uses this URL" } };
  let id: string;
  try {
    id = await db.transaction(async (tx) => {
      const [row] = await tx.insert(products).values(values).returning({ id: products.id });
      await saveProductImages(tx, row.id, parsed.data.images);
      return row.id;
    });
  } catch (e) {
    if (e instanceof MissingImageError) return missingImage;
    throw e;
  }
  revalidateStore(values.slug);
  return { ok: true, data: { id }, message: "Product created." };
}

export async function updateProduct(id: string, form: FormData): Promise<ActionResult<{ id: string }>> {
  await assertAdmin();
  const parsed = readProduct(form);
  if (!parsed.success) return fail(parsed.error);
  const values = productValues(parsed.data);
  if (!values.slug) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Enter a URL slug" } };
  if (await slugTaken(products, values.slug, id)) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Another product already uses this URL" } };
  let found: boolean;
  try {
    found = await db.transaction(async (tx) => {
      const updated = await tx.update(products).set(values).where(eq(products.id, id)).returning({ id: products.id });
      if (updated.length) await saveProductImages(tx, id, parsed.data.images);
      return updated.length > 0;
    });
  } catch (e) {
    if (e instanceof MissingImageError) return missingImage;
    throw e;
  }
  if (!found) return { ok: false, error: "Product not found" };
  revalidateStore(values.slug);
  return { ok: true, data: { id }, message: "Product saved." };
}

/** Deletes a product, or deactivates it if it appears in past orders (so order history stays intact). */
export async function deleteProduct(id: string): Promise<ActionResult<{ deactivated: boolean }>> {
  await assertAdmin();
  const [{ n }] = await db.select({ n: count() }).from(orderItems).where(eq(orderItems.productId, String(id)));
  if (n > 0) {
    await db.update(products).set({ active: false }).where(eq(products.id, String(id)));
    revalidateStore();
    return { ok: true, data: { deactivated: true }, message: "This product is in past orders, so it was deactivated (hidden from the store) instead of deleted." };
  }
  await db.delete(products).where(eq(products.id, String(id)));
  revalidateStore();
  return { ok: true, data: { deactivated: false }, message: "Product deleted." };
}

// ---- Categories

const categoryInput = z.object({
  name: z.string().trim().min(2, "Enter a collection name").max(60),
  slug: z.string().trim().max(60).optional(),
  description: z.string().trim().max(200).default(""),
  icon: z.enum(ICON_NAMES as [string, ...string[]]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Pick a colour"),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function saveCategory(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  await assertAdmin();
  const parsed = categoryInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error);
  const values = { ...parsed.data, slug: slugify(parsed.data.slug || parsed.data.name) };
  if (!values.slug) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Enter a URL slug" } };
  if (await slugTaken(categories, values.slug, id ?? undefined)) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { slug: "Another collection already uses this URL" } };
  }
  let savedId = id;
  if (id) {
    const updated = await db.update(categories).set(values).where(eq(categories.id, id)).returning({ id: categories.id });
    if (!updated.length) return { ok: false, error: "Collection not found" };
  } else {
    const [row] = await db.insert(categories).values(values).returning({ id: categories.id });
    savedId = row.id;
  }
  revalidateStore();
  revalidatePath("/admin/categories");
  return { ok: true, data: { id: savedId! }, message: id ? "Collection saved." : "Collection created." };
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  await assertAdmin();
  const [{ n }] = await db.select({ n: count() }).from(products).where(eq(products.categoryId, Number(id)));
  if (n > 0) return { ok: false, error: `This collection still has ${n} product${n === 1 ? "" : "s"}. Move or delete them first.` };
  await db.delete(categories).where(eq(categories.id, Number(id)));
  revalidateStore();
  revalidatePath("/admin/categories");
  return { ok: true, data: null, message: "Collection deleted." };
}

// ---- Customers

const banInput = z.object({ userId: z.string().min(1), banned: z.boolean(), reason: z.string().trim().max(200).optional() });

/** Bans (and signs out) or unbans a customer, using Better Auth's admin API. */
export async function setCustomerBanned(input: unknown): Promise<ActionResult> {
  const me = await assertAdmin();
  const parsed = banInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request" };
  const { userId, banned, reason } = parsed.data;
  if (userId === me.id) return { ok: false, error: "You can't ban yourself." };
  const [target] = await db.select({ role: user.role }).from(user).where(eq(user.id, userId));
  if (!target) return { ok: false, error: "Customer not found" };
  if (target.role === "admin") return { ok: false, error: "Admins can't be banned here. Remove their admin role first." };

  const h = await headers();
  if (banned) {
    await auth.api.banUser({ body: { userId, banReason: reason || "Banned by admin" }, headers: h });
    await db.delete(session).where(eq(session.userId, userId)); // sign them out everywhere now
  } else {
    await auth.api.unbanUser({ body: { userId }, headers: h });
  }
  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath("/admin/customers");
  return { ok: true, data: null, message: banned ? "Customer banned and signed out." : "Customer unbanned." };
}
