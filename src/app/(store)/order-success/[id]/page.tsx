import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/orders.server";
import { requireUser } from "@/lib/session";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default async function OrderSuccessPage({ params }: PageProps<"/order-success/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/order-success/${id}`);
  const order = await getOrderDetail(id, user.id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-8">
      <div className="card mb-4 flex flex-col items-center p-8 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-green-100">
          <CircleCheck className="size-9 text-save" />
        </span>
        <h1 className="display mt-4 text-3xl md:text-4xl">Thank you, order placed</h1>
        <p className="mt-1 text-sm text-muted">We&apos;ve received your order and will keep you updated at every step.</p>
      </div>
      <OrderDetailView order={order} />
      <div className="mt-6 flex justify-center gap-2">
        <ButtonLink href="/account/orders" variant="outline">My orders</ButtonLink>
        <ButtonLink href="/">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}
