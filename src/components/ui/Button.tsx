import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "lime" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-800 text-white hover:bg-brand-700 disabled:bg-gray-300",
  lime: "bg-lime text-brand-800 hover:bg-lime-strong disabled:bg-gray-200 disabled:text-gray-500",
  dark: "bg-ink text-white hover:bg-brand-800 disabled:bg-gray-300",
  outline: "border border-brand-800/25 text-brand-800 hover:border-brand-800 hover:bg-brand-50 disabled:border-gray-300 disabled:text-gray-400",
  ghost: "text-brand-800 hover:bg-brand-50",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
