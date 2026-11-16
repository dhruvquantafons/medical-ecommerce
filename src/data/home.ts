import type { Coupon, HeroSlide } from "./types";

// Store home content.

export const heroSlides: HeroSlide[] = [
  {
    id: "bone",
    eyebrow: "Bone and joint",
    title: "Support for bones and joints",
    cta: "Shop bone and joint",
    href: "/collections/bone-joint",
    image: "/portfolio/assets/medicine_synortho.jpg",
    imageAlt: "Syn Ortho roll-on oil and its carton",
    imageWidth: 872,
    imageHeight: 1024,
  },
  {
    id: "heart",
    eyebrow: "Heart and omega-3",
    title: "Omega-3 for everyday heart health",
    cta: "Shop heart health",
    href: "/collections/heart-omega",
    image: "/portfolio/assets/medicine_lycotium_softgel.png",
    imageAlt: "LYCOTIUM omega-3 softgels jar with loose softgels",
    imageWidth: 878,
    imageHeight: 1048,
  },
];

/** Collection card art for the store home (keyed by collection slug). */
export const collectionImages: Record<string, string> = {
  "liver-care": "/images/placeholders/collection-immunity.svg",
  "gut-health": "/images/placeholders/collection-gut.svg",
  "bone-joint": "/images/placeholders/collection-skin.svg",
  "heart-omega": "/images/placeholders/collection-sleep.svg",
};

/** Discount codes accepted at checkout (not advertised on the site). */
export const coupons: Coupon[] = [
  { code: "WELCOME10", description: "10% off your first order (max ₹300)", type: "percent", value: 10, minOrder: 499, maxDiscount: 300 },
  { code: "SAVE100", description: "Flat ₹100 off on orders above ₹1,499", type: "flat", value: 100, minOrder: 1499 },
];

/**
 * "Why Syncytium" claims. Empty, so the block is not rendered.
 * TODO(owner): the previous claims were unverified and have been removed: "100% clean ingredients, no
 * artificial colours, fillers or hidden sugars", "3rd-party tested: every batch checked by an independent
 * lab", "Doctor formulated: developed with doctors and nutritionists", "FSSAI: manufactured in certified
 * facilities". Restore any of these only with evidence (lab name, licence number).
 */
export const promises: { icon: string; stat: string; title: string; text: string }[] = [];

/*
 * Customer reviews: none. The three previous "sample reviews" were for products the store does not
 * sell (Daily Synbiotic, Magnesium Glycinate Night, Marine Collagen Glow) and have been removed.
 * TODO(owner): add real, attributable customer reviews before any review section is shown.
 */

/** FAQ. Answers mention only products that exist in the catalogue and facts the store states at checkout. */
export const faqs = [
  {
    q: "Are your supplements safe to take every day?",
    a: "Take each product at the dose on its label. If you are pregnant, nursing, on medication or have a medical condition, please check with your doctor first.",
  },
  {
    q: "Do any products need a prescription?",
    a: "Yes, some do. They are marked “Prescription required”, and you upload a valid prescription at checkout before the order is confirmed.",
  },
  {
    q: "Are the products vegetarian?",
    a: "Not all of them. LYCOTIUM softgels contain fish oil, for example. The full ingredients are listed on each product page.",
  },
  { q: "How fast is delivery?", a: "Orders ship within 24 hours and arrive in 2–5 days across India. Delivery is free above ₹499." },
  { q: "Can I return a product?", a: "Unopened products can be returned within 7 days of delivery for a full refund." },
];
