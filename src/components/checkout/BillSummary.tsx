import type { ReactNode } from "react";
import { site } from "@/config/site";
import type { BillSummary as Bill } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

function Row({ label, value, className = "" }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={`flex justify-between gap-3 text-[15px] ${className}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function BillSummary({ bill, children }: { bill: Bill; children?: ReactNode }) {
  const toFree = site.freeDeliveryAbove - bill.subtotal;
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="display text-3xl">Order summary</h2>
      <div className="mt-4 space-y-2.5 text-ink/80">
        <Row label={`Subtotal · ${bill.itemCount} item${bill.itemCount === 1 ? "" : "s"}`} value={formatPrice(bill.mrpTotal)} />
        {bill.productDiscount > 0 && <Row label="Discount" value={`− ${formatPrice(bill.productDiscount)}`} className="text-save" />}
        {bill.couponDiscount > 0 && <Row label={`Code ${bill.coupon?.code}`} value={`− ${formatPrice(bill.couponDiscount)}`} className="text-save" />}
        <Row label="Delivery" value={bill.deliveryFee ? formatPrice(bill.deliveryFee) : "Free"} />
      </div>
      <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{formatPrice(bill.total)}</span>
      </div>
      {bill.deliveryFee > 0 && toFree > 0 && (
        <p className="mt-3 rounded-xl bg-lime/60 px-3 py-2 text-center text-xs font-medium text-brand-800">
          Add {formatPrice(toFree)} more for free delivery
        </p>
      )}
      {bill.savings > 0 && <p className="mt-3 text-center text-xs font-medium text-save">You&apos;re saving {formatPrice(bill.savings)} on this order</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
