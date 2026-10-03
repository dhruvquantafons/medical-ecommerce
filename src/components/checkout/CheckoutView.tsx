"use client";

import { AlertTriangle, Banknote, CircleCheck, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import type { Address, PaymentMethod, Prescription } from "@/data/types";
import { useCart } from "@/store/cart";
import { useLocation } from "@/store/location";
import { useHydrated } from "@/lib/useHydrated";
import { formatPrice } from "@/lib/format";
import { placeCodOrder, saveAddress } from "@/app/actions/account";
import { loadRazorpay, openRazorpay } from "@/lib/razorpayCheckout";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { RxBadge } from "@/components/product/Badges";
import { RxDropzone, RxThumb } from "@/components/rx/RxDropzone";
import { AddressForm } from "./AddressForm";
import { BillSummary } from "./BillSummary";
import { EmptyCart, PageSkeleton } from "./CartView";
import { useCartBill } from "./useCartBill";

const payments: { id: PaymentMethod; label: string; note: string; icon: typeof Banknote }[] = [
  { id: "online", label: "Pay online", note: "UPI, cards, netbanking and wallets via Razorpay", icon: CreditCard },
  { id: "cod", label: "Cash on delivery", note: "Pay when your order arrives", icon: Banknote },
];

function Step({ n, title, done, children }: { n: number; title: string; done?: boolean; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold">
        <span className={clsx("grid size-8 place-items-center rounded-full text-sm", done ? "bg-brand-800 text-lime" : "bg-tile text-ink")}>
          {done ? <CircleCheck className="size-4" /> : n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutView({ initialAddresses, initialPrescriptions }: { initialAddresses: Address[]; initialPrescriptions: Prescription[] }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { lines, bill, hasRx, couponCode, loading } = useCartBill();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const pincode = useLocation((s) => s.pincode);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const [addressId, setAddressId] = useState<string>();
  const [addingAddress, setAddingAddress] = useState(false);
  const [rxIds, setRxIds] = useState<string[]>([]);
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [placing, setPlacing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string>();

  if (!hydrated || placing || loading) return <PageSkeleton />;
  if (!lines.length) return <EmptyCart />;

  const selectedAddress = addresses.find((a) => a.id === (addressId ?? addresses[0]?.id));
  const attachedRx = rxIds.filter((id) => prescriptions.some((p) => p.id === id));
  const rxOk = !hasRx || attachedRx.length > 0;
  const canPlace = !!selectedAddress && rxOk && !paying;
  const showForm = addingAddress || addresses.length === 0;

  /** Order saved (and paid, for online): empty the cart and show the confirmation. */
  function finish(orderId: string) {
    setPlacing(true);
    clearCart();
    router.replace(`/order-success/${orderId}`);
  }

  const checkoutBody = () => ({
    cart: { items, couponCode },
    addressId: selectedAddress?.id,
    prescriptionIds: hasRx ? attachedRx : [],
  });

  async function placeCod() {
    setPaying(true);
    setPayError(undefined);
    const res = await placeCodOrder(checkoutBody());
    if (res.ok) return finish(res.data.orderId);
    setPaying(false);
    setPayError(res.error);
  }

  async function payOnline() {
    if (!selectedAddress) return;
    setPaying(true);
    setPayError(undefined);
    try {
      await loadRazorpay();
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutBody()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment");

      openRazorpay(
        {
          key: data.keyId,
          order_id: data.razorpayOrderId,
          amount: data.amount,
          currency: data.currency,
          name: site.name,
          description: `Order of ${bill.itemCount} item${bill.itemCount === 1 ? "" : "s"}`,
          prefill: { name: selectedAddress.name, contact: `+91${selectedAddress.phone}` },
          theme: { color: "#10847e" },
          handler: async (success) => {
            try {
              const v = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(success),
              });
              const result = await v.json();
              if (!v.ok || !result.verified) throw new Error(result.error ?? "Payment could not be verified");
              finish(result.orderId);
            } catch (e) {
              setPaying(false);
              setPayError(`${(e as Error).message}. If money was deducted, it will be refunded automatically. Payment ID: ${success.razorpay_payment_id}`);
            }
          },
          modal: {
            ondismiss: () => setPaying(false),
          },
        },
        // Razorpay keeps its window open on failure so the customer can retry; we just surface the reason.
        (failure) => setPayError(failure.error.description || "Payment failed. Please try again."),
      );
    } catch (e) {
      setPaying(false);
      setPayError((e as Error).message);
    }
  }

  function placeOrder() {
    if (!selectedAddress || !rxOk || paying) return;
    if (payment === "cod") placeCod();
    else payOnline();
  }

  let n = 1;
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-10 pt-10 pb-6 md:pt-14">
      <h1 className="display text-3xl md:text-4xl">Checkout</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div className="space-y-4">
          <Step n={n++} title="Delivery address" done={!!selectedAddress && !showForm}>
            {addresses.length > 0 && (
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <label key={a.id} className={clsx("flex cursor-pointer gap-3 rounded-lg border p-3", selectedAddress?.id === a.id ? "border-brand-600 bg-brand-50" : "border-line")}>
                    <input type="radio" name="address" className="mt-1 accent-brand-600" checked={selectedAddress?.id === a.id} onChange={() => setAddressId(a.id)} />
                    <span className="text-sm">
                      <span className="flex items-center gap-2 font-semibold">{a.name} <span className="rounded bg-gray-100 px-1.5 text-[10px] font-bold uppercase text-muted">{a.label}</span></span>
                      <span className="block text-gray-700">{a.line1}{a.line2 && `, ${a.line2}`}</span>
                      <span className="block text-gray-700">{a.city}, {a.state} {a.pincode}</span>
                      <span className="block text-muted">{a.phone}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {showForm ? (
              <AddressForm
                defaultPincode={pincode}
                onCancel={addresses.length ? () => setAddingAddress(false) : undefined}
                onSave={async (fields) => {
                  const res = await saveAddress(fields);
                  if (!res.ok) return res.error;
                  setAddresses((list) => [res.data, ...list]);
                  setAddressId(res.data.id);
                  setAddingAddress(false);
                }}
              />
            ) : (
              <Button variant="outline" size="sm" onClick={() => setAddingAddress(true)}>+ Add new address</Button>
            )}
          </Step>

          {hasRx && (
            <Step n={n++} title="Attach prescription" done={rxOk}>
              <p className="mb-3 text-sm text-muted">
                These items need a valid prescription:{" "}
                {lines.filter((l) => l.product.rxRequired).map((l) => l.product.name).join(", ")}
              </p>
              {prescriptions.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {prescriptions.map((p) => {
                    const on = attachedRx.includes(p.id);
                    return (
                      <label key={p.id} className={clsx("relative cursor-pointer rounded-lg ring-2", on ? "ring-brand-600" : "ring-transparent")}>
                        <input
                          type="checkbox"
                          className="absolute top-2 left-2 z-10 size-4 accent-brand-600"
                          checked={on}
                          onChange={() => setRxIds((ids) => (on ? ids.filter((x) => x !== p.id) : [...ids, p.id]))}
                          aria-label={`Attach ${p.name}`}
                        />
                        <RxThumb rx={p} />
                      </label>
                    );
                  })}
                </div>
              )}
              <RxDropzone
                compact
                onAdded={(p) => {
                  setPrescriptions((list) => [p, ...list]);
                  setRxIds((ids) => [...ids, p.id]);
                }}
              />
              {!rxOk && <p className="mt-2 text-xs font-medium text-red-600">Attach at least one prescription to continue.</p>}
            </Step>
          )}

          <Step n={n++} title="Payment method" done>
            <div className="space-y-2">
              {payments.map(({ id, label, note, icon: I }) => (
                <label key={id} className={clsx("flex cursor-pointer items-center gap-3 rounded-lg border p-3", payment === id ? "border-brand-600 bg-brand-50" : "border-line")}>
                  <input type="radio" name="payment" className="accent-brand-600" checked={payment === id} onChange={() => setPayment(id)} />
                  <I className="size-5 text-brand-600" />
                  <span className="text-sm">
                    <span className="block font-semibold">{label}</span>
                    <span className="text-xs text-muted">{note}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <Lock className="size-3.5" /> Payments are processed securely by Razorpay (test mode).
            </p>
          </Step>

          <Step n={n++} title={`Review items (${bill.itemCount})`}>
            <ul className="divide-y divide-line text-sm">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate">{p.name}</span>
                    {p.rxRequired && <RxBadge />}
                    <span className="shrink-0 text-muted">× {qty}</span>
                  </span>
                  <span className="shrink-0 font-semibold">{formatPrice(p.price * qty)}</span>
                </li>
              ))}
            </ul>
            <Link href="/cart" className="mt-2 inline-block text-xs font-semibold text-brand-700 hover:underline">Edit cart</Link>
          </Step>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BillSummary bill={bill}>
            <Button size="lg" className="w-full" disabled={!canPlace} onClick={placeOrder}>
              {paying ? "Processing payment…" : payment === "cod" ? "Place order" : `Pay ${formatPrice(bill.total)}`}
            </Button>
            {payError && (
              <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                <AlertTriangle className="size-4 shrink-0" /> <span>{payError}</span>
              </p>
            )}
            {!canPlace && !paying && (
              <p className="mt-2 text-center text-xs text-muted">
                {!selectedAddress ? "Add a delivery address to continue" : "Attach a prescription to continue"}
              </p>
            )}
          </BillSummary>
        </div>
      </div>
    </div>
  );
}
