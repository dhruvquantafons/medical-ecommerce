import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

const tones = {
  default: "bg-background",
  surface: "bg-surface",
  tint: "bg-brand-tint",
} as const;

type SectionProps = ComponentProps<"section"> & {
  /** Background: white (default), the neutral surface, or the 5% brand tint. */
  tone?: keyof typeof tones;
  /** Wrap children in the 1200px Container. Default true. */
  contained?: boolean;
  /** Play the section's entrance animation. Default true. */
  animate?: boolean;
  containerClassName?: string;
};

/** A page section: 64px vertical padding on mobile, 96px on desktop. */
export function Section({
  tone = "default",
  contained = true,
  animate = true,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  const body = contained ? <Container className={containerClassName}>{children}</Container> : children;
  return (
    <section className={cn("py-16 md:py-24", tones[tone], className)} {...props}>
      {animate ? <Reveal>{body}</Reveal> : body}
    </section>
  );
}
