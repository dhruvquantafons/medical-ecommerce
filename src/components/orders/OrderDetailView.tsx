import { CircleCheck, ExternalLink, FileText, MapPin, Truck, Wallet } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import type { OrderDetail, OrderStatus } from "@/data/types";
import { formatPrice } from "@/lib/format";
import {
  ORDER_FLOW,
  formatDateTime,
  orderStatusLabel,
  orderStatusTone,
  paymentMethodLabel,
  paymentStatusLabel,
  rxStatusLabel,
} from "@/lib/order-labels";
import { RxBadge } from "@/components/product/Badges";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", orderStatusTone[status])}>
      {orderStatusLabel[status]}
    </span>
  );
}

function Timeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">This order was cancelled.</p>;
  }
  const current = ORDER_FLOW.indexOf(status);
  return (
    <ol className="grid grid-cols-5 gap-1">
      {ORDER_FLOW.map((s, i) => (
        <li key={s} className="flex flex-col items-center gap-1.5 text-center">
          <span className={clsx("h-1.5 w-full rounded-full", i <= current ? "bg-brand-gradient" : "bg-gray-200")} />
          <span className={clsx("text-[11px] font-semibold sm:text-xs", i <= current ? "text-brand-700" : "text-muted")}>{orderStatusLabel[s]}</span>
        </li>
      ))}
    </ol>
  );
}

function Row({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("flex justify-between gap-3 text-sm", className)}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/** Order details shared by the customer pages and the admin panel. */
export function OrderDetailView({ order, admin }: { order: OrderDetail; admin?: boolean }) {
  const a = order.address;
  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-muted">Order ID</p>
            <p className="font-mono text-sm font-bold">{order.id}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={order.status} />
            <p className="mt-1 text-xs text-muted">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <Timeline status={order.status} />
        {order.rxStatus !== "not_required" && (
          <p
            className={clsx(
              "flex items-start gap-2 rounded-lg px-3 py-2 text-xs",
              order.rxStatus === "approved" ? "bg-green-50 text-save" : order.rxStatus === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800",
            )}
          >
            <FileText className="size-4 shrink-0" />
            <span>
              <span className="font-semibold">{rxStatusLabel[order.rxStatus]}.</span>{" "}
              {order.rxStatus === "pending" && "Our pharmacist will verify your prescription before dispatch."}
              {order.rxNote && <> Note: {order.rxNote}</>}
            </span>
          </p>
        )}
      </div>

      {!admin && order.shipment?.awbCode && order.status !== "cancelled" && (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
          <div>
            <p className="flex items-center gap-2 font-bold"><Truck className="size-4 text-brand-600" /> Shipment</p>
            <p className="mt-1 text-gray-700">
              {order.shipment.courierName} · AWB <span className="font-mono">{order.shipment.awbCode}</span>
            </p>
            {order.shipment.status && <p className="text-xs text-muted">{order.shipment.status}</p>}
          </div>
          {order.shipment.trackingUrl && (
            <a href={order.shipment.trackingUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
              Track package <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      )}

      <div className="card p-5">
        <h2 className="mb-3 font-bold">Items ({order.itemCount})</h2>
        <ul className="divide-y divide-line text-sm">
          {order.items.map((i) => (
            <li key={i.productId} className="flex items-center justify-between gap-3 py-2.5">
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  {i.slug ? (
                    <Link href={`/product/${i.slug}`} className="truncate font-medium hover:text-brand-700">{i.name}</Link>
                  ) : (
                    <span className="truncate font-medium">{i.name}</span>
                  )}
                  {i.rxRequired && <RxBadge />}
                </span>
                <span className="text-xs text-muted">{i.packSize} · {formatPrice(i.price)} × {i.qty}</span>
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1.5 border-t border-dashed border-line pt-3 text-gray-700">
          <Row label="Item total (MRP)" value={formatPrice(order.mrpTotal)} />
          <Row label="Price discount" value={`− ${formatPrice(order.mrpTotal - order.subtotal)}`} className="text-save" />
          {order.couponDiscount > 0 && <Row label={`Coupon (${order.couponCode})`} value={`− ${formatPrice(order.couponDiscount)}`} className="text-save" />}
          <Row label="Delivery fee" value={order.deliveryFee ? formatPrice(order.deliveryFee) : "FREE"} />
          <Row label={order.paymentMethod === "cod" ? "To pay on delivery" : "Total paid"} value={formatPrice(order.total)} className="pt-1 text-base font-bold text-ink" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5 text-sm">
          <p className="mb-2 flex items-center gap-2 font-bold"><MapPin className="size-4 text-brand-600" /> Delivery address</p>
          <p className="font-semibold">{a.name} <span className="ml-1 rounded bg-gray-100 px-1.5 text-[10px] font-bold uppercase text-muted">{a.label}</span></p>
          <p className="text-gray-700">{a.line1}{a.line2 && `, ${a.line2}`}, {a.city}, {a.state} {a.pincode}</p>
          <p className="text-muted">{a.phone}</p>
        </div>
        <div className="card p-5 text-sm">
          <p className="mb-2 flex items-center gap-2 font-bold"><Wallet className="size-4 text-brand-600" /> Payment</p>
          <p>{paymentMethodLabel[order.paymentMethod]}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            {order.paymentStatus === "paid" && <CircleCheck className="size-3.5 text-save" />}
            {paymentStatusLabel[order.paymentStatus]}
            {order.paidAt && ` · ${formatDateTime(order.paidAt)}`}
          </p>
          {order.razorpayPaymentId && (
            <p className="mt-1 text-xs text-muted">Payment ID <span className="font-mono text-ink">{order.razorpayPaymentId}</span></p>
          )}
          {admin && order.razorpayOrderId && (
            <p className="mt-1 text-xs text-muted">Razorpay order <span className="font-mono text-ink">{order.razorpayOrderId}</span></p>
          )}
        </div>
      </div>

      {order.prescriptions.length > 0 && (
        <div className="card p-5">
          <h2 className="mb-3 font-bold">Prescriptions</h2>
          <ul className="flex flex-wrap gap-2">
            {order.prescriptions.map((p) => (
              <li key={p.id}>
                <a href={p.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:border-brand-500 hover:text-brand-700">
                  <FileText className="size-4" /> {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
