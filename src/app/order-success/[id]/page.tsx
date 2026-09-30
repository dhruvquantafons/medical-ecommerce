import type { Metadata } from "next";
import { OrderSuccessView } from "@/components/checkout/OrderSuccessView";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default async function OrderSuccessPage({ params }: PageProps<"/order-success/[id]">) {
  const { id } = await params;
  return <OrderSuccessView id={id} />;
}
