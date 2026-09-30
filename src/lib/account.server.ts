import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { addresses, prescriptions } from "@/db/schema";
import type { Address, Prescription } from "@/data/types";

export function toAddress({ id, name, phone, line1, line2, city, state, pincode, label }: typeof addresses.$inferSelect): Address {
  return { id, name, phone, line1, line2, city, state, pincode, label };
}

export async function listAddresses(userId: string): Promise<Address[]> {
  const rows = await db.select().from(addresses).where(eq(addresses.userId, userId)).orderBy(desc(addresses.createdAt));
  return rows.map(toAddress);
}

export async function listPrescriptions(userId: string): Promise<Prescription[]> {
  const rows = await db
    .select({ id: prescriptions.id, fileName: prescriptions.fileName, mimeType: prescriptions.mimeType, createdAt: prescriptions.createdAt })
    .from(prescriptions)
    .where(eq(prescriptions.userId, userId))
    .orderBy(desc(prescriptions.createdAt));
  return rows.map((p) => ({ id: p.id, name: p.fileName, type: p.mimeType, url: `/api/prescriptions/${p.id}`, uploadedAt: p.createdAt.toISOString() }));
}
