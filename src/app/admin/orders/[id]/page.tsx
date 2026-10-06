import { ChevronLeft, Mail, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/admin.server";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { OrderActions } from "@/components/admin/OrderActions";
import { ShipmentPanel } from "@/components/admin/ShipmentPanel";

export const metadata: Metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const data = await getAdminOrder(id);
  if (!data) notFound();
  const { order, customer } = data;

  return (
    <>
      <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        <ChevronLeft className="size-4" /> Orders
      </Link>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <OrderDetailView order={order} admin />
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="card p-5 text-sm">
            <h2 className="mb-2 font-bold">Customer</h2>
            {customer ? (
              <>
                <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-2 font-semibold hover:text-brand-700">
                  <User className="size-4 text-muted" /> {customer.name}
                </Link>
                <a href={`mailto:${customer.email}`} className="mt-1 flex items-center gap-2 text-muted hover:text-brand-700">
                  <Mail className="size-4" /> {customer.email}
                </a>
              </>
            ) : (
              <p className="text-muted">Customer account not found.</p>
            )}
          </div>
          <OrderActions order={order} />
          <ShipmentPanel order={order} />
        </div>
      </div>
    </>
  );
}
