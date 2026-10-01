import type { Metadata } from "next";
import Link from "next/link";
import { getDashboard, LOW_STOCK } from "@/lib/admin.server";
import { formatPrice } from "@/lib/format";
import { EmptyState, PageHeader, StatCard } from "@/components/admin/ui";
import { SalesChart } from "@/components/admin/SalesChart";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata: Metadata = { title: "Dashboard" };

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export default async function AdminDashboard() {
  const d = await getDashboard();
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Sales count cash-on-delivery and paid online orders, excluding cancellations. Days are in India time." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Sales today" value={formatPrice(d.today.revenue)} hint={plural(d.today.orders, "order")} />
        <StatCard label="Sales, last 30 days" value={formatPrice(d.last30.revenue)} hint={plural(d.last30.orders, "order")} />
        {d.pendingRx > 0 ? (
          <StatCard label="Prescriptions to review" value={String(d.pendingRx)} hint="Waiting for a pharmacist" tone="warn" href="/admin/prescriptions" />
        ) : (
          <StatCard
            label="Orders to fulfil"
            value={String(d.toFulfil)}
            hint={d.toFulfil ? "Placed, confirmed or packed" : "All shipped"}
            tone={d.toFulfil ? "warn" : "default"}
            href="/admin/orders?status=placed"
          />
        )}
        <StatCard
          label="Low-stock products"
          value={String(d.lowStockCount)}
          hint={`${LOW_STOCK} or fewer in stock · ${plural(d.customers, "customer")}`}
          tone={d.lowStockCount ? "warn" : "default"}
          href="/admin/products?status=low"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="card p-5">
          <h2 className="font-bold">Daily sales</h2>
          <p className="mb-4 text-xs text-muted">Last 14 days</p>
          <SalesChart data={d.daily} />
        </section>
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Low stock</h2>
            <Link href="/admin/products?status=low" className="text-xs font-semibold text-brand-700 hover:underline">View all</Link>
          </div>
          {d.lowStock.length ? (
            <ul className="divide-y divide-line text-sm">
              {d.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 py-2">
                  <Link href={`/admin/products/${p.id}`} className="truncate hover:text-brand-700">{p.name}</Link>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${p.stock === 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>
                    {p.stock === 0 ? "Out" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Everything is well stocked.</p>
          )}
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand-700 hover:underline">All orders</Link>
        </div>
        {d.recent.length ? <OrdersTable rows={d.recent} /> : <EmptyState title="No orders yet" />}
      </section>
    </>
  );
}
