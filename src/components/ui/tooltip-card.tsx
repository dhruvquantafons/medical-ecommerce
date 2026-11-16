"use client";

/*
 * Aceternity UI "Tooltip Card", restyled to the Syncytium tokens and made accessible: the trigger is a
 * real button, the card opens on hover, keyboard focus or tap, closes on Escape, blur or a second tap,
 * and is linked to the trigger with aria-describedby. The original followed the mouse pointer, which a
 * keyboard or touch user cannot do, so the card now sits under its trigger. A short fade, no spring.
 * The card is portalled to <body> with fixed positioning so scrolling containers (tables) never clip it.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function TooltipCard({
  content,
  children,
  label,
  className,
}: {
  /** The card's content. */
  content: ReactNode;
  /** The trigger's visible content (usually a small info icon). */
  children: ReactNode;
  /** Accessible name for the trigger, e.g. "About pantethine". */
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  // Rendered in a portal with fixed positioning so scrolling containers (tables) never clip it.
  useEffect(() => {
    if (!open || !trigger.current) return;
    const place = () => {
      const r = trigger.current!.getBoundingClientRect();
      const width = Math.min(256, window.innerWidth - 32);
      setPos({ top: r.bottom + 4, left: Math.max(16, Math.min(r.left, window.innerWidth - width - 16)) });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <span ref={wrap} className={cn("relative inline-flex", className)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="grid size-8 place-items-center rounded-full text-ink-subtle hover:text-ink"
      >
        {children}
      </button>
      {open &&
        pos &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.span
                id={id}
                role="tooltip"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ top: pos.top, left: pos.left }}
                className="pointer-events-none fixed z-50 block w-64 max-w-[calc(100vw-2rem)] rounded-card border border-line bg-background p-4 text-sm leading-relaxed text-ink-muted shadow-raised"
              >
                {content}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}
