import { FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { listRxQueue } from "@/lib/admin.server";
import { formatDateTime } from "@/lib/order-labels";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Prescriptions" };

export default async function PrescriptionQueuePage() {
  const queue = await listRxQueue();
  return (
    <>
      <PageHeader title="Prescriptions to review" subtitle="Oldest first. Orders with Rx medicines can't be packed until their prescription is approved." />
      {queue.length ? (
        <ul className="space-y-3">
          {queue.map((o) => (
            <li key={o.id} className="card flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm font-bold text-brand-700 hover:underline">{o.id}</Link>
                <p className="text-sm">
                  {o.customerName} <span className="text-muted">· {o.customerEmail}</span>
                </p>
                <p className="text-xs text-muted">Placed {formatDateTime(o.createdAt)}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Rx items:</span> {o.rxItems.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {o.files.map((f) => (
                  <a key={f.id} href={f.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold hover:border-brand-500 hover:text-brand-700">
                    <FileText className="size-4" /> {f.name}
                  </a>
                ))}
                <ButtonLink href={`/admin/orders/${o.id}`} size="sm">Review</ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="All caught up" text="No prescriptions are waiting for review." />
      )}
    </>
  );
}
