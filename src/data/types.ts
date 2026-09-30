export type ProductForm =
  | "tablet"
  | "capsule"
  | "syrup"
  | "cream"
  | "drops"
  | "powder"
  | "device"
  | "pack"
  | "bottle";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  manufacturer: string;
  categorySlug: string;
  form: ProductForm;
  packSize: string;
  mrp: number;
  price: number;
  discountPct: number;
  rxRequired: boolean;
  composition: string;
  description: string;
  uses: string[];
  sideEffects: string[];
  howToUse: string;
  safetyAdvice: string[];
  storage: string;
  rating: number;
  ratingCount: number;
  inStock: boolean;
  tags: string[];
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  from: string;
  to: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  maxDiscount?: number;
}

export interface HealthConcern {
  slug: string;
  name: string;
  icon: string;
  tag: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Prescription {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  label: "Home" | "Work" | "Other";
}

export type PaymentMethod = "online" | "cod";

export interface Order {
  id: string;
  items: { productId: string; name: string; qty: number; price: number; mrp: number }[];
  address: Address;
  payment: PaymentMethod;
  /** Razorpay references, present for verified online payments. */
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  prescriptionIds: string[];
  coupon?: string;
  total: number;
  savings: number;
  placedAt: string;
}
