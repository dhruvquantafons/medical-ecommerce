import Link from "next/link";
import type { AdminOrderRow } from "@/lib/admin.server";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/lib/order-labels";
import { StatusBadge } from "@/components/orders/OrderDetailView";
import { RxBadge } from "@/components/product/Badges";
import { PaymentBadge, Table, td, th } from "./ui";

export function OrdersTable({ rows, showCustomer = true }: { rows: AdminOrderRow[]; showCustomer?: boolean }) {
  return (
    <Table>
      <thead>
        <tr>
          <th className={th}>Order</th>
          {showCustomer && <th className={th}>Customer</th>}
          <th className={th}>Status</th>
          <th className={th}>Payment</th>
          <th className={`${th} text-right`}>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((o) => (
          <tr key={o.id} className="hover:bg-brand-50/40">
            <td className={td}>
              <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs font-bold text-brand-700 hover:underline">
                {o.id}
              </Link>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                {formatDateTime(o.createdAt)} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"}
                {o.rxStatus !== "not_required" && <RxBadge />}
              </p>
            </td>
            {showCustomer && (
              <td className={td}>
                <Link href={`/admin/customers/${o.userId}`} className="font-medium hover:text-brand-700">{o.customerName}</Link>
                <p className="text-xs text-muted">{o.customerEmail}</p>
              </td>
            )}
            <td className={td}>
              <StatusBadge status={o.status} />
            </td>
            <td className={td}>
              <PaymentBadge status={o.paymentStatus} />
            </td>
            <td className={`${td} text-right font-semibold tabular-nums`}>{formatPrice(o.total)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
