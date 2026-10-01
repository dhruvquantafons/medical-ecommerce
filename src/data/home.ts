import type { Coupon, HeroSlide } from "./types";

// Home page content. Images are placeholders in /public/images/placeholders/; swap in real photography later.

export const heroSlides: HeroSlide[] = [
  { id: "gut", eyebrow: "Formulations", title: "Whole body health starts", emphasis: "in the gut.", cta: "Shop now", href: "/collections/gut-health", image: "/images/placeholders/hero-gut.svg" },
  { id: "skin", eyebrow: "Beauty from within", title: "Radiant skin is an", emphasis: "inside job.", cta: "Shop skin & hair", href: "/collections/skin-hair", image: "/images/placeholders/hero-skin.svg" },
  { id: "sleep", eyebrow: "Rest & recover", title: "Better days begin with", emphasis: "deeper sleep.", cta: "Shop sleep", href: "/collections/sleep-stress", image: "/images/placeholders/hero-sleep.svg" },
];

/** Collection card art for the home page (keyed by collection slug). */
export const collectionImages: Record<string, string> = {
  "gut-health": "/images/placeholders/collection-gut.svg",
  "immunity-energy": "/images/placeholders/collection-immunity.svg",
  "skin-hair": "/images/placeholders/collection-skin.svg",
  "sleep-stress": "/images/placeholders/collection-sleep.svg",
};

/** Discount codes accepted at checkout (not advertised on the site). */
export const coupons: Coupon[] = [
  { code: "WELCOME10", description: "10% off your first order (max ₹300)", type: "percent", value: 10, minOrder: 499, maxDiscount: 300 },
  { code: "SAVE100", description: "Flat ₹100 off on orders above ₹1,499", type: "flat", value: 100, minOrder: 1499 },
];

export const promises = [
  { icon: "Leaf", stat: "100%", title: "Clean ingredients", text: "No artificial colours, fillers or hidden sugars." },
  { icon: "FlaskConical", stat: "3rd-party", title: "Tested for purity", text: "Every batch checked by an independent lab." },
  { icon: "Stethoscope", stat: "Doctor", title: "Formulated", text: "Developed with doctors and nutritionists." },
  { icon: "ShieldCheck", stat: "FSSAI", title: "Made in India", text: "Manufactured in certified facilities." },
];

/** Sample reviews for the design. Replace with real customer reviews before launch. */
export const reviews = [
  { name: "Priya S.", city: "Bengaluru", product: "Daily Synbiotic", text: "Two weeks in and the bloating after lunch is finally gone. One capsule a day is easy to stick to.", rating: 5 },
  { name: "Arjun M.", city: "Pune", product: "Magnesium Glycinate Night", text: "I fall asleep faster and wake up without feeling groggy. Gentle and no weird aftertaste.", rating: 5 },
  { name: "Neha K.", city: "Delhi", product: "Marine Collagen Glow", text: "Dissolves completely in my morning coffee. My skin feels more hydrated after a month.", rating: 4 },
];

export const faqs = [
  { q: "Are your supplements safe to take every day?", a: "Yes. Our formulations are designed for daily use at the recommended dose. If you are pregnant, nursing, on medication or have a medical condition, please check with your doctor first." },
  { q: "How long before I notice a difference?", a: "Most people notice changes in 2–4 weeks of daily use. Consistency matters more than timing." },
  { q: "Are the products vegetarian?", a: "Most of our range is vegetarian and the gummies are vegan. Marine Collagen is sourced from fish. Details are listed on each product page." },
  { q: "How fast is delivery?", a: "Orders ship within 24 hours and arrive in 2–5 days across India. Delivery is free above ₹499." },
  { q: "Can I return a product?", a: "Unopened products can be returned within 7 days of delivery for a full refund." },
];
