import {
  Accessibility, Activity, Apple, Baby, Bandage, Bath, Bone, Brain, BriefcaseMedical, Droplet, Droplets, Dumbbell, Ear, Eye,
  FlaskConical, Flower2, Footprints, Glasses, Hand, Heart, HeartPulse, Hospital, Leaf, Microscope, Milk, Moon, Pill, Salad,
  ShieldCheck, ShieldPlus, Smile, Sparkles, Sprout, Stethoscope, Sun, Syringe, Tablets, Thermometer, Weight, Wind,
  type LucideProps,
} from "lucide-react";

const icons = {
  Pill, Tablets, Syringe, Stethoscope, BriefcaseMedical, Hospital, Activity, HeartPulse, Heart, Thermometer, Droplet, Droplets,
  ShieldPlus, ShieldCheck, Sparkles, Leaf, Sprout, Flower2, Baby, Smile, Sun, Moon, Bone, Brain, Eye, Ear, Glasses, Dumbbell,
  Weight, Apple, Salad, Milk, Wind, Bandage, Bath, Hand, Footprints, Accessibility, FlaskConical, Microscope,
};

export type IconName = keyof typeof icons;

/** Icon names an admin can choose for a category (stored in the database as a string). */
export const ICON_NAMES = Object.keys(icons) as IconName[];

/** Resolves an icon name stored in the database to a lucide component (falls back to Pill). */
export function Icon({ name, ...props }: LucideProps & { name: string }) {
  const C = icons[name as IconName] ?? Pill;
  return <C {...props} />;
}
