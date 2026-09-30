import type { OrderStatus, PaymentMethod, PaymentStatus, RxStatus } from "@/data/types";

export const ORDER_FLOW: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "delivered"];

export const orderStatusLabel: Record<OrderStatus, string> = {
  placed: "Order placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const orderStatusTone: Record<OrderStatus, string> = {
  placed: "bg-blue-50 text-blue-700 ring-blue-200",
  confirmed: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  packed: "bg-amber-50 text-amber-800 ring-amber-200",
  shipped: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  delivered: "bg-green-50 text-green-700 ring-green-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = { online: "Paid online (Razorpay)", cod: "Cash on delivery" };

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  cod: "Pay on delivery",
};

export const rxStatusLabel: Record<RxStatus, string> = {
  not_required: "Not required",
  pending: "Awaiting pharmacist review",
  approved: "Prescription approved",
  rejected: "Prescription rejected",
};

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
}
