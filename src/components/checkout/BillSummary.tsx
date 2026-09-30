import type { ReactNode } from "react";
import { site } from "@/config/site";
import type { BillSummary as Bill } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

function Row({ label, value, className = "" }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={`flex justify-between gap-3 text-sm ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function BillSummary({ bill, children }: { bill: Bill; children?: ReactNode }) {
  const toFree = site.freeDeliveryAbove - bill.subtotal;
  return (
    <div className="card p-5">
      <h2 className="mb-3 font-bold">Bill summary</h2>
      <div className="space-y-2 text-gray-700">
        <Row label={`Item total (MRP) · ${bill.itemCount} item${bill.itemCount === 1 ? "" : "s"}`} value={formatPrice(bill.mrpTotal)} />
        <Row label="Price discount" value={`− ${formatPrice(bill.productDiscount)}`} className="text-save" />
        {bill.couponDiscount > 0 && <Row label={`Coupon (${bill.coupon?.code})`} value={`− ${formatPrice(bill.couponDiscount)}`} className="text-save" />}
        <Row label="Delivery fee" value={bill.deliveryFee ? formatPrice(bill.deliveryFee) : <span className="font-semibold text-save">FREE</span>} />
      </div>
      <div className="mt-3 flex justify-between border-t border-dashed border-line pt-3 font-bold">
        <span>To pay</span>
        <span>{formatPrice(bill.total)}</span>
      </div>
      {bill.savings > 0 && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-xs font-semibold text-save">
          You save {formatPrice(bill.savings)} on this order
        </p>
      )}
      {bill.deliveryFee > 0 && toFree > 0 && (
        <p className="mt-2 text-center text-xs text-muted">Add items worth {formatPrice(toFree)} more for free delivery</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
