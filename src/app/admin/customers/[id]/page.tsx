import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/admin.server";
import { requireAdmin } from "@/lib/session";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/lib/order-labels";
import { EmptyState, PageHeader, StatCard } from "@/components/admin/ui";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { BanControl } from "@/components/admin/BanControl";

export const metadata: Metadata = { title: "Customer" };

export default async function AdminCustomerPage({ params }: PageProps<"/admin/customers/[id]">) {
  const { id } = await params;
  const [me, data] = await Promise.all([requireAdmin(), getCustomer(id)]);
  if (!data) notFound();
  const { customer: c, orders, stats } = data;

  return (
    <>
      <Link href="/admin/customers" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        <ChevronLeft className="size-4" /> Customers
      </Link>
      <PageHeader
        title={c.name}
        subtitle={
          <>
            <a href={`mailto:${c.email}`} className="hover:text-brand-700">{c.email}</a> · joined {formatDateTime(c.createdAt)}
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Orders" value={String(stats.orders)} />
            <StatCard label="Total spent" value={formatPrice(stats.spent)} hint="Excludes cancelled orders" />
          </div>
          <h2 className="pt-2 text-lg font-bold">Orders</h2>
          {orders.length ? <OrdersTable rows={orders} showCustomer={false} /> : <EmptyState title="No orders yet" />}
        </div>
        <div className="card space-y-3 self-start p-5">
          <h2 className="font-bold">Account</h2>
          {c.banned && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Banned{c.banReason ? `: ${c.banReason}` : ""}
            </p>
          )}
          <BanControl
            userId={c.id}
            banned={c.banned}
            disabledReason={c.id === me.id ? "This is your own account." : c.role === "admin" ? "Admins can't be banned from here." : undefined}
          />
        </div>
      </div>
    </>
  );
}
