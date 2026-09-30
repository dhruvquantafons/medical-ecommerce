"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import type { Address } from "@/data/types";
import { currentUser } from "@/lib/session";
import { toAddress } from "@/lib/account.server";
import { CheckoutError } from "@/lib/checkout.server";
import { insertOrder, prepareOrder } from "@/lib/orders.server";

const addressInput = z.object({
  name: z.string().trim().min(1, "Enter the recipient's name").max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().trim().min(1, "Enter house / flat and street").max(200),
  line2: z.string().trim().max(200).default(""),
  city: z.string().trim().min(1, "Enter city").max(80),
  state: z.string().trim().min(1, "Enter state").max(80),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode"),
  label: z.enum(["Home", "Work", "Other"]),
});

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function saveAddress(input: unknown): Promise<Result<Address>> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  const parsed = addressInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const [row] = await db.insert(addresses).values({ ...parsed.data, userId: user.id }).returning();
  revalidatePath("/account/addresses");
  return { ok: true, data: toAddress(row) };
}

export async function deleteAddress(id: string): Promise<Result<null>> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  await db.delete(addresses).where(and(eq(addresses.id, String(id)), eq(addresses.userId, user.id)));
  revalidatePath("/account/addresses");
  return { ok: true, data: null };
}

const checkoutInput = z.object({
  cart: z.unknown(),
  addressId: z.string().min(1),
  prescriptionIds: z.array(z.string()).max(10).default([]),
});

/** Places a cash-on-delivery order. Online payments go through /api/payments/create-order instead. */
export async function placeCodOrder(input: unknown): Promise<Result<{ orderId: string }>> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  const parsed = checkoutInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid checkout details." };
  try {
    const prepared = await prepareOrder(user.id, parsed.data);
    const orderId = await insertOrder(prepared, { method: "cod" });
    revalidatePath("/account/orders");
    return { ok: true, data: { orderId } };
  } catch (e) {
    if (e instanceof CheckoutError) return { ok: false, error: e.message };
    throw e;
  }
}
