import type { Metadata } from "next";
import { and, count, eq, ne, or } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  const [{ n: pendingRx }] = await db
    .select({ n: count() })
    .from(orders)
    .where(and(eq(orders.rxStatus, "pending"), ne(orders.status, "cancelled"), or(eq(orders.paymentMethod, "cod"), eq(orders.paymentStatus, "paid"))));
  return (
    <AdminShell user={{ name: admin.name, email: admin.email }} pendingRx={pendingRx}>
      {children}
    </AdminShell>
  );
}
