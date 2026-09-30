import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/orders.server";
import { requireUser } from "@/lib/session";
import { OrderDetailView } from "@/components/orders/OrderDetailView";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

export default async function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/account/orders/${id}`);
  const order = await getOrderDetail(id, user.id);
  if (!order) notFound();
  return (
    <>
      <Link href="/account/orders" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        <ChevronLeft className="size-4" /> All orders
      </Link>
      <OrderDetailView order={order} />
    </>
  );
}
