import type { Address, Order, PaymentMethod } from "@/data/types";
import type { BillSummary, CartLine } from "./pricing";

export function createOrder(input: {
  lines: CartLine[];
  bill: BillSummary;
  address: Address;
  payment: PaymentMethod;
  prescriptionIds: string[];
}): Order {
  const { lines, bill } = input;
  return {
    id: `MQ${Date.now().toString(36).toUpperCase()}`,
    items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, qty: l.qty, price: l.product.price, mrp: l.product.mrp })),
    address: input.address,
    payment: input.payment,
    prescriptionIds: input.prescriptionIds,
    coupon: bill.couponDiscount > 0 ? bill.coupon?.code : undefined,
    total: bill.total,
    savings: bill.savings,
    placedAt: new Date().toISOString(),
  };
}
