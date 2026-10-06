"use client";

import { ExternalLink, Printer, RefreshCw, Truck } from "lucide-react";
import { useState } from "react";
import type { OrderDetail } from "@/data/types";
import { site } from "@/config/site";
import { formatDateTime } from "@/lib/order-labels";
import { getShippingLabel, refreshShipment, shipWithShiprocket } from "@/app/admin/actions";
import { Button, buttonClass } from "@/components/ui/Button";
import { inputClass } from "./ui";
import { useAdminAction } from "./useAdminAction";

const { parcel } = site;

/** Shiprocket shipping for one order: create the shipment, print the label, refresh tracking. */
export function ShipmentPanel({ order }: { order: OrderDetail }) {
  const { run, pending } = useAdminAction();
  const s = order.shipment;
  const [dims, setDims] = useState({
    weightKg: String(Math.max(parcel.minWeightKg, order.itemCount * parcel.weightPerItemKg)),
    lengthCm: String(parcel.lengthCm),
    breadthCm: String(parcel.breadthCm),
    heightCm: String(parcel.heightCm),
  });

  const unpaid = order.paymentMethod === "online" && order.paymentStatus !== "paid";
  const rxBlocking = order.rxStatus === "pending" || order.rxStatus === "rejected";
  const closed = order.status === "cancelled" || order.status === "delivered";
  const finished = Boolean(s?.awbCode && s.pickupRequested);
  const blockedReason = unpaid ? "Waiting for online payment." : rxBlocking ? "Approve the prescription first." : null;

  return (
    <div className="card p-5 text-sm">
      <h2 className="flex items-center gap-2 font-bold">
        <Truck className="size-4 text-brand-600" /> Shipping (Shiprocket)
      </h2>

      {s && (
        <dl className="mt-3 space-y-1.5">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Status</dt>
            <dd className="text-right font-semibold">{s.status ?? "—"}</dd>
          </div>
          {s.courierName && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Courier</dt>
              <dd className="text-right">{s.courierName}</dd>
            </div>
          )}
          {s.awbCode && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">AWB</dt>
              <dd className="font-mono">{s.awbCode}</dd>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Shiprocket order</dt>
            <dd className="font-mono">{s.shiprocketOrderId}</dd>
          </div>
          {s.updatedAt && <p className="text-xs text-muted">Updated {formatDateTime(s.updatedAt)}</p>}
        </dl>
      )}

      {!s && closed && <p className="mt-2 text-muted">No shipment was created for this order.</p>}

      {!closed && !finished && (
        <>
          {!s?.shiprocketOrderId && (
            <>
              <p className="mt-2 text-xs text-muted">Package size (couriers bill on these). Defaults are in src/config/site.ts.</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {(
                  [
                    ["weightKg", "Weight kg"],
                    ["lengthCm", "L cm"],
                    ["breadthCm", "B cm"],
                    ["heightCm", "H cm"],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k} className="block">
                    <span className="mb-1 block text-[11px] font-semibold text-gray-600">{label}</span>
                    <input
                      value={dims[k]}
                      onChange={(e) => setDims({ ...dims, [k]: e.target.value })}
                      inputMode="decimal"
                      className={`${inputClass} w-full px-2`}
                    />
                  </label>
                ))}
              </div>
            </>
          )}
          <Button
            className="mt-3 w-full"
            disabled={pending || Boolean(blockedReason)}
            title={blockedReason ?? undefined}
            onClick={() => run(() => shipWithShiprocket({ orderId: order.id, ...dims }))}
          >
            {s ? "Retry: assign courier & pickup" : "Ship with Shiprocket"}
          </Button>
          {blockedReason ? (
            <p className="mt-2 text-xs text-amber-700">{blockedReason}</p>
          ) : (
            <p className="mt-2 text-xs text-muted">Creates the order in Shiprocket, assigns the recommended courier and schedules pickup. The shipping charge comes from your Shiprocket wallet.</p>
          )}
        </>
      )}

      {s?.awbCode && (
        <div className="mt-4 flex flex-wrap gap-2">
          {s.labelUrl ? (
            <a href={s.labelUrl} target="_blank" rel="noopener" className={buttonClass("outline", "sm")}>
              <Printer className="size-4" /> Print label
            </a>
          ) : (
            <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => getShippingLabel(order.id))}>
              <Printer className="size-4" /> Generate label
            </Button>
          )}
          <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => refreshShipment(order.id))}>
            <RefreshCw className="size-4" /> Refresh
          </Button>
          {s.trackingUrl && (
            <a href={s.trackingUrl} target="_blank" rel="noopener" className="inline-flex h-8 items-center gap-1 px-2 text-sm font-semibold text-brand-700 hover:underline">
              Track <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
