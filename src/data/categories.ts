import type { Category } from "./types";

// `icon` is a lucide-react icon name resolved in components/ui/CategoryIcon.
export const categories: Category[] = [
  { slug: "medicines", name: "Medicines", icon: "Pill", color: "#0f847e", description: "Prescription and OTC medicines delivered to your door" },
  { slug: "healthcare-devices", name: "Healthcare Devices", icon: "Activity", color: "#2563eb", description: "BP monitors, glucometers, thermometers and more" },
  { slug: "vitamins-supplements", name: "Vitamins & Supplements", icon: "Sparkles", color: "#d97706", description: "Multivitamins, calcium, protein and immunity boosters" },
  { slug: "diabetes-care", name: "Diabetes Care", icon: "Droplet", color: "#dc2626", description: "Test strips, sugar substitutes and diabetic nutrition" },
  { slug: "personal-care", name: "Personal Care", icon: "Smile", color: "#7c3aed", description: "Oral care, hygiene, feminine care and more" },
  { slug: "skin-care", name: "Skin Care", icon: "Sun", color: "#db2777", description: "Moisturisers, sunscreens, cleansers and treatments" },
  { slug: "ayurveda", name: "Ayurveda", icon: "Leaf", color: "#16a34a", description: "Trusted Ayurvedic and herbal remedies" },
  { slug: "baby-mom-care", name: "Baby & Mom Care", icon: "Baby", color: "#0891b2", description: "Diapers, baby skincare and maternal nutrition" },
  { slug: "covid-essentials", name: "Covid Essentials", icon: "ShieldPlus", color: "#475569", description: "Masks, sanitisers, oximeters and immunity care" },
  { slug: "sexual-wellness", name: "Sexual Wellness", icon: "Heart", color: "#e11d48", description: "Condoms, lubricants and wellness products" },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
