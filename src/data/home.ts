import type { Banner, Coupon, HealthConcern } from "./types";

export const banners: Banner[] = [
  { id: "b1", title: "Flat 25% off on medicines", subtitle: "Use code FLAT25 on your first order above ₹999", cta: "Order now", href: "/category/medicines", from: "#0f847e", to: "#14b8a6" },
  { id: "b2", title: "Upload prescription, we do the rest", subtitle: "Our pharmacists call you to confirm your order", cta: "Upload Rx", href: "/upload-prescription", from: "#1d4ed8", to: "#60a5fa" },
  { id: "b3", title: "Save up to 60% with generic substitutes", subtitle: "Same salt, same quality, lower price", cta: "Explore", href: "/category/medicines", from: "#b45309", to: "#f59e0b" },
  { id: "b4", title: "Healthcare devices from ₹199", subtitle: "BP monitors, glucometers, oximeters and more", cta: "Shop devices", href: "/category/healthcare-devices", from: "#7c3aed", to: "#c084fc" },
];

export const coupons: Coupon[] = [
  { code: "FLAT25", description: "25% off on orders above ₹999 (max ₹300)", type: "percent", value: 25, minOrder: 999, maxDiscount: 300 },
  { code: "NEW15", description: "15% off on your first order (max ₹150)", type: "percent", value: 15, minOrder: 299, maxDiscount: 150 },
  { code: "SAVE100", description: "Flat ₹100 off on orders above ₹1,499", type: "flat", value: 100, minOrder: 1499 },
];

export const concerns: HealthConcern[] = [
  { slug: "fever", name: "Fever & Pain", icon: "Thermometer", tag: "fever" },
  { slug: "diabetes", name: "Diabetes", icon: "Droplet", tag: "diabetes" },
  { slug: "heart", name: "Heart Care", icon: "HeartPulse", tag: "heart" },
  { slug: "stomach", name: "Stomach Care", icon: "Salad", tag: "stomach" },
  { slug: "cold", name: "Cold & Cough", icon: "Wind", tag: "cold" },
  { slug: "bone", name: "Bone & Joint", icon: "Bone", tag: "bone" },
  { slug: "skin", name: "Skin Care", icon: "Sun", tag: "skin" },
  { slug: "immunity", name: "Immunity", icon: "ShieldCheck", tag: "immunity" },
];

export const featuredBrands = [
  "Himalaya", "Dabur", "Cipla", "Sun Pharma", "Abbott", "Dr. Morepen", "Omron", "Accu-Chek", "Cetaphil", "Pampers", "Dettol", "Revital",
];

export const stats = [
  { value: "1 Cr+", label: "Happy customers" },
  { value: "1 Lakh+", label: "Products" },
  { value: "22,000+", label: "Pincodes served" },
  { value: "100%", label: "Genuine medicines" },
];

export const faqs = [
  { q: "Are the medicines genuine?", a: "Yes. All products are sourced directly from licensed distributors and manufacturers, and every order is checked by a registered pharmacist." },
  { q: "Do I need a prescription?", a: "Prescription (Rx) medicines need a valid prescription from a registered doctor. You can upload it while placing the order or from the Upload Prescription page." },
  { q: "How long does delivery take?", a: "Most orders are delivered within 24–72 hours depending on your pincode." },
  { q: "What payment methods are accepted?", a: "Cash on delivery, UPI, and debit/credit cards." },
  { q: "Can I return a product?", a: "Unopened products can be returned within 7 days of delivery. Some items such as refrigerated medicines are non-returnable." },
];
