"use client";

import type { ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

/**
 * The one entrance animation on the site (CLAUDE.md, Motion): Magic UI Blur Fade configured as a 200ms
 * fade with an 8px rise, run once when the section scrolls into view. No blur. Under
 * prefers-reduced-motion the children render immediately.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <BlurFade inView direction="up" offset={8} duration={0.2} delay={0} blur="0px" inViewMargin="0px 0px -10% 0px" className={className}>
      {children}
    </BlurFade>
  );
}
