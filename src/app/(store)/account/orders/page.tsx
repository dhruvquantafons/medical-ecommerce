import { ChevronRight, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { listUserOrders } from "@/lib/orders.server";
import { requireUser } from "@/lib/session";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/lib/order-labels";
import { StatusBadge } from "@/components/orders/OrderDetailView";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "My orders" };

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await listUserOrders(user.id);

  if (!orders.length) {
    return (
      <div className="card flex flex-col items-center gap-3 px-4 py-14 text-center">
        <Package className="size-12 text-gray-300" />
        <p className="font-semibold">No orders yet</p>
        <p className="text-sm text-muted">When you place an order, it will show up here.</p>
        <ButtonLink href="/" className="mt-1">Start shopping</ButtonLink>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`/account/orders/${o.id}`} className="card flex items-center gap-4 p-4 transition hover:border-brand-200 hover:shadow-md">
            <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 sm:grid">
              <Package className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold">{o.id}</span>
                <StatusBadge status={o.status} />
              </span>
              <span className="mt-1 block truncate text-sm text-gray-700">{o.itemNames.join(", ")}</span>
              <span className="text-xs text-muted">
                {formatDateTime(o.createdAt)} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"} · {o.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}
              </span>
            </span>
            <span className="shrink-0 text-right font-bold">{formatPrice(o.total)}</span>
            <ChevronRight className="size-5 shrink-0 text-muted" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
