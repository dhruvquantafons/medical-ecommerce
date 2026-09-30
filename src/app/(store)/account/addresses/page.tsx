import type { Metadata } from "next";
import { listAddresses } from "@/lib/account.server";
import { requireUser } from "@/lib/session";
import { AddressBook } from "@/components/account/AddressBook";

export const metadata: Metadata = { title: "Saved addresses" };

export default async function AddressesPage() {
  const user = await requireUser("/account/addresses");
  return <AddressBook initial={await listAddresses(user.id)} />;
}
