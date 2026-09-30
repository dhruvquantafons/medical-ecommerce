import type { Metadata } from "next";
import { getDeals } from "@/lib/catalog";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  return <CartView suggestions={await getDeals(20)} />;
}
