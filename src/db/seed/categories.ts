import type { Category } from "@/data/types";

// Collections used by `npm run db:seed`. `icon` is a lucide-react icon name resolved by components/ui/Icon.
export const categories: Category[] = [
  { slug: "liver-care", name: "Liver Care", icon: "ShieldPlus", color: "#6a58e0", description: "Targeted nutrition to support liver health and fat metabolism." },
  { slug: "gut-health", name: "Gut Health", icon: "Sprout", color: "#7c6bf0", description: "Probiotics to restore and maintain healthy gut flora." },
  { slug: "bone-joint", name: "Bone & Joint", icon: "Bone", color: "#8b5cf6", description: "Calcium, vitamin D3 and relief for aching muscles and joints." },
  { slug: "heart-omega", name: "Heart & Omega-3", icon: "HeartPulse", color: "#3d2e86", description: "Omega-3 fish oil for heart health and everyday wellbeing." },
];
