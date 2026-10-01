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
  /** Collection display name (filled in by the catalogue queries). */
  categoryName?: string;
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
  stock: number;
  tags: string[];
  /** Photo URLs in display order (the first is the main image). Empty = drawn placeholder. */
  images: string[];
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  /** Headline; the part in `emphasis` is set in italic. */
  title: string;
  emphasis: string;
  cta: string;
  href: string;
  /** Image path under /public. Replace placeholders with real photography. */
  image: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  maxDiscount?: number;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Prescription {
  id: string;
  name: string;
  type: string;
  /** Authenticated URL that serves the file (owner or admin only). */
  url: string;
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
export type OrderStatus = "placed" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "cod";
export type RxStatus = "not_required" | "pending" | "approved" | "rejected";

export interface OrderItemView {
  productId: string;
  slug: string | null;
  name: string;
  packSize: string;
  rxRequired: boolean;
  qty: number;
  price: number;
  mrp: number;
}

/** An order as shown to customers and admins (money in rupees). */
export interface OrderDetail {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  rxStatus: RxStatus;
  rxNote: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  couponCode: string | null;
  itemCount: number;
  mrpTotal: number;
  subtotal: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
  address: Omit<Address, "id">;
  createdAt: string;
  paidAt: string | null;
  items: OrderItemView[];
  prescriptions: Prescription[];
}
