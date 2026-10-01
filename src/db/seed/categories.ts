import type { Category } from "@/data/types";

// Demo collections used by `npm run db:seed`. `icon` is a lucide-react icon name resolved by components/ui/Icon.
export const categories: Category[] = [
  { slug: "gut-health", name: "Gut Health", icon: "Sprout", color: "#3f6b4e", description: "Probiotics and fibre for a happier, calmer gut." },
  { slug: "immunity-energy", name: "Immunity & Energy", icon: "ShieldCheck", color: "#5b7f3a", description: "Daily essentials to keep you resilient and energised." },
  { slug: "skin-hair", name: "Skin & Hair", icon: "Sparkles", color: "#7a8f5a", description: "Beauty from within: collagen, biotin and zinc." },
  { slug: "sleep-stress", name: "Sleep & Stress", icon: "Moon", color: "#35584a", description: "Adaptogens and minerals to unwind and rest well." },
];
