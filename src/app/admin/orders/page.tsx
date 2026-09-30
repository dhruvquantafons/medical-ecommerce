import type { Metadata } from "next";
import type { OrderStatus, PaymentStatus } from "@/data/types";
import { listOrders } from "@/lib/admin.server";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/order-labels";
import { EmptyState, FilterBar, PageHeader, Pagination, inputClass, pageParam, strParam } from "@/components/admin/ui";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Orders" };

const statuses = Object.keys(orderStatusLabel) as OrderStatus[];
const payments = Object.keys(paymentStatusLabel) as PaymentStatus[];

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const status = statuses.find((s) => s === strParam(sp.status));
  const payment = payments.find((p) => p === strParam(sp.payment));
  const q = strParam(sp.q);
  const page = pageParam(sp.page);
  const { rows, total, pages } = await listOrders({ status, payment, q, page });

  return (
    <>
      <PageHeader title="Orders" subtitle={`${total} order${total === 1 ? "" : "s"}`} />
      <FilterBar>
        <input name="q" defaultValue={q} placeholder="Order ID, customer name or email" aria-label="Search orders" className={`${inputClass} w-72 max-w-full`} />
        <select name="status" defaultValue={status ?? ""} aria-label="Status" className={inputClass}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{orderStatusLabel[s]}</option>)}
        </select>
        <select name="payment" defaultValue={payment ?? ""} aria-label="Payment" className={inputClass}>
          <option value="">All payments</option>
          {payments.map((p) => <option key={p} value={p}>{paymentStatusLabel[p]}</option>)}
        </select>
        <Button type="submit">Filter</Button>
        {(q || status || payment) && <ButtonLink href="/admin/orders" variant="ghost">Clear</ButtonLink>}
      </FilterBar>
      {rows.length ? (
        <>
          <OrdersTable rows={rows} />
          <Pagination page={page} pages={pages} basePath="/admin/orders" params={{ q, status, payment }} />
        </>
      ) : (
        <EmptyState title="No orders match" text="Try a different search or filter." />
      )}
    </>
  );
}
