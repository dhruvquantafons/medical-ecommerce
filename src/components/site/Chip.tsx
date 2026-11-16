import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "border-line bg-background text-ink",
  brand: "border-transparent bg-brand-tint text-brand",
  success: "border-transparent bg-success/10 text-success",
  warning: "border-transparent bg-warning/10 text-warning",
  danger: "border-transparent bg-danger/10 text-danger",
} as const;

type ChipProps = ComponentProps<"span"> & { tone?: keyof typeof tones };

/** A small fully-rounded label, e.g. an ingredient, a dosage form or a status. */
export function Chip({ tone = "neutral", className, ...props }: ChipProps) {
  return (
    <span
      className={cn("inline-flex h-7 max-w-full items-center gap-1 truncate rounded-full border px-3 text-sm", tones[tone], className)}
      {...props}
    />
  );
}
