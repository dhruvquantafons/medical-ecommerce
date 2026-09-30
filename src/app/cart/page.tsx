import type { Metadata } from "next";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return <CartView />;
}
