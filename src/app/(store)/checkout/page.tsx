import type { Metadata } from "next";
import { listAddresses, listPrescriptions } from "@/lib/account.server";
import { requireUser } from "@/lib/session";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const [addresses, prescriptions] = await Promise.all([listAddresses(user.id), listPrescriptions(user.id)]);
  return <CheckoutView initialAddresses={addresses} initialPrescriptions={prescriptions} />;
}
