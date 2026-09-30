"use client";

import { CircleCheck, FileText, MapPin, Wallet } from "lucide-react";
import { useAccount } from "@/store/account";
import { useHydrated } from "@/lib/useHydrated";
import { formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { PageSkeleton } from "./CartView";

const paymentLabel = { cod: "Cash on delivery", upi: "UPI", card: "Card" };

export function OrderSuccessView({ id }: { id: string }) {
  const hydrated = useHydrated();
  const order = useAccount((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) return <PageSkeleton />;
  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Order not found</h1>
        <p className="mt-2 text-sm text-muted">We couldn&apos;t find order {id} on this device.</p>
        <ButtonLink href="/" className="mt-4">Go home</ButtonLink>
      </div>
    );
  }

  const a = order.address;
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="card flex flex-col items-center p-8 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-green-100">
          <CircleCheck className="size-9 text-save" />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Order placed successfully</h1>
        <p className="mt-1 text-sm text-muted">
          Order ID <span className="font-semibold text-ink">{order.id}</span> ·{" "}
          {new Date(order.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        </p>
        {order.prescriptionIds.length > 0 && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <FileText className="size-4" /> Our pharmacist will verify your prescription and call you before dispatch.
          </p>
        )}
      </div>

      <div className="card mt-4 p-5">
        <h2 className="mb-3 font-bold">Order summary</h2>
        <ul className="divide-y divide-line text-sm">
          {order.items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3 py-2">
              <span>{i.name} <span className="text-muted">× {i.qty}</span></span>
              <span className="font-semibold">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-dashed border-line pt-3 font-bold">
          <span>Total paid{order.payment === "cod" ? " on delivery" : ""}</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        {order.savings > 0 && <p className="mt-1 text-right text-xs font-semibold text-save">You saved {formatPrice(order.savings)}{order.coupon && ` (incl. ${order.coupon})`}</p>}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card p-5 text-sm">
          <p className="mb-2 flex items-center gap-2 font-bold"><MapPin className="size-4 text-brand-600" /> Delivering to</p>
          <p className="font-semibold">{a.name}</p>
          <p className="text-gray-700">{a.line1}{a.line2 && `, ${a.line2}`}, {a.city}, {a.state} {a.pincode}</p>
          <p className="text-muted">{a.phone}</p>
        </div>
        <div className="card p-5 text-sm">
          <p className="mb-2 flex items-center gap-2 font-bold"><Wallet className="size-4 text-brand-600" /> Payment</p>
          <p>{paymentLabel[order.payment]}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <ButtonLink href="/">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}
