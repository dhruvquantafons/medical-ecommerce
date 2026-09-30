"use client";

import { useState } from "react";
import type { OrderDetail, OrderStatus } from "@/data/types";
import { ORDER_FLOW, orderStatusLabel } from "@/lib/order-labels";
import { reviewPrescription, updateOrderStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useAdminAction } from "./useAdminAction";

/** Status controls and prescription review for one order. The server enforces every rule again. */
export function OrderActions({ order }: { order: OrderDetail }) {
  const { run, pending } = useAdminAction();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string>();
  const closed = order.status === "delivered" || order.status === "cancelled";
  const unpaid = order.paymentMethod === "online" && order.paymentStatus !== "paid";
  const rxBlocking = order.rxStatus === "pending" || order.rxStatus === "rejected";
  const current = ORDER_FLOW.indexOf(order.status);

  const setStatus = (status: OrderStatus) => {
    if (status === "cancelled" && !confirm(`Cancel order ${order.id}? Stock will be returned.`)) return;
    run(() => updateOrderStatus({ orderId: order.id, status }));
  };

  return (
    <div className="space-y-4">
      {order.rxStatus === "pending" && !closed && (
        <div className="card border-amber-200 p-5">
          <h2 className="font-bold">Review prescription</h2>
          <p className="mt-1 text-xs text-muted">Check the attached prescription(s) against the Rx items before approving.</p>
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Note to customer (required when rejecting)</span>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteError(undefined);
              }}
              rows={2}
              maxLength={500}
              className="w-full rounded-lg border border-line p-2 text-sm outline-none focus:border-brand-500"
            />
            {noteError && <span className="text-xs text-red-600">{noteError}</span>}
          </label>
          <div className="mt-3 flex gap-2">
            <Button disabled={pending} onClick={() => run(() => reviewPrescription({ orderId: order.id, decision: "approve", note: note || undefined }))}>
              Approve
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => {
                if (note.trim().length < 3) return setNoteError("Tell the customer why it was rejected.");
                if (confirm("Reject the prescription? The order will be cancelled.")) run(() => reviewPrescription({ orderId: order.id, decision: "reject", note }));
              }}
            >
              Reject & cancel
            </Button>
          </div>
        </div>
      )}

      <div className="card p-5">
        <h2 className="font-bold">Order status</h2>
        {closed ? (
          <p className="mt-2 text-sm text-muted">This order is {order.status} and can no longer be changed.</p>
        ) : unpaid ? (
          <p className="mt-2 text-sm text-muted">Waiting for the customer to complete online payment.</p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {ORDER_FLOW.slice(current + 1).map((s) => {
                const gated = rxBlocking && ["packed", "shipped", "delivered"].includes(s);
                return (
                  <Button key={s} size="sm" variant="outline" disabled={pending || gated} title={gated ? "Approve the prescription first" : undefined} onClick={() => setStatus(s)}>
                    Mark {orderStatusLabel[s].toLowerCase()}
                  </Button>
                );
              })}
            </div>
            {rxBlocking && <p className="mt-2 text-xs text-amber-700">Packing and shipping unlock once the prescription is approved.</p>}
          </>
        )}
        {!closed && (
          <button disabled={pending} onClick={() => setStatus("cancelled")} className="mt-4 text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
            Cancel order
          </button>
        )}
      </div>
    </div>
  );
}
