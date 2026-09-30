import {
  Activity, Baby, Bone, Droplet, Heart, HeartPulse, Leaf, Pill, Salad, ShieldCheck, ShieldPlus, Smile, Sparkles, Sun, Thermometer, Wind,
  type LucideProps,
} from "lucide-react";

const icons = { Activity, Baby, Bone, Droplet, Heart, HeartPulse, Leaf, Pill, Salad, ShieldCheck, ShieldPlus, Smile, Sparkles, Sun, Thermometer, Wind };

/** Resolves the icon names used in mock data (src/data) to lucide components. */
export function Icon({ name, ...props }: LucideProps & { name: string }) {
  const C = icons[name as keyof typeof icons] ?? Pill;
  return <C {...props} />;
}
