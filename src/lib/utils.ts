import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes (used by the shadcn/ui components in components/portfolio/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
