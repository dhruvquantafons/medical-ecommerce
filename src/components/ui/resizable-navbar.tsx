"use client";

/*
 * Aceternity UI "Resizable Navbar", restyled to the Syncytium design tokens (CLAUDE.md):
 * solid white with a bottom border, 64px tall on desktop and 56px on mobile, easing to 56px on
 * desktop after the page scrolls. The original's backdrop blur, floating width animation, glow
 * shadows, gradient button and @tabler icons are removed. Links are next/link and mark the
 * current page with aria-current.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ScrolledContext = createContext(false);

/** Sticky header shell. Tracks whether the page has scrolled so NavBody can shrink. */
export function Navbar({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  return (
    <ScrolledContext.Provider value={scrolled}>
      <header className={cn("sticky inset-x-0 top-0 z-40 w-full border-b border-line bg-background", className)}>{children}</header>
    </ScrolledContext.Provider>
  );
}

/** The header row: 56px on mobile, 64px on desktop easing to 56px once scrolled. */
export function NavBody({ children, className }: { children: ReactNode; className?: string }) {
  const scrolled = useContext(ScrolledContext);
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={false}
      animate={{ "--nav-h": scrolled ? "56px" : "64px" } as Record<string, string>}
      transition={reduce ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
      style={{ "--nav-h": "64px" } as React.CSSProperties}
      className={cn("mx-auto flex h-14 w-full max-w-site items-center gap-4 px-4 md:px-6 lg:h-(--nav-h)", className)}
    >
      {children}
    </motion.div>
  );
}

export type NavItem = { name: string; link: string; /** Path prefixes that also count as this item. */ match?: string[] };

export function isCurrent(path: string, item: NavItem) {
  const prefixes = [item.link, ...(item.match ?? [])];
  return prefixes.some((p) => (p === "/" ? path === "/" : path === p || path.startsWith(`${p}/`)));
}

const itemClass =
  "relative inline-flex h-11 items-center rounded-control px-3 text-[15px] font-medium text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-2 aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-brand";

/** A plain nav link with the current-page underline. Exported for items that sit beside custom menus. */
export function NavLink({ item, className }: { item: NavItem; className?: string }) {
  const path = usePathname();
  return (
    <Link href={item.link} aria-current={isCurrent(path, item) ? "page" : undefined} className={cn(itemClass, className)}>
      {item.name}
    </Link>
  );
}

export const navItemClass = itemClass;
