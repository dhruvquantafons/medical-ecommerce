"use client";

/*
 * Aceternity UI "Stateful Button", restyled to the Syncytium tokens (CLAUDE.md): the solid brand
 * button from components/ui/button, 44px tall, 8px radius. Same idea as the original (a spinner while
 * the action runs, then a check), rebuilt on React state instead of DOM-selector animations and a
 * shared layoutId, so several buttons on one page never animate into each other. The status is
 * announced to screen readers, and the spinner and check appear without motion under reduced motion.
 */

import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

type Status = "idle" | "loading" | "success";

export interface StatefulButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> {
  children: ReactNode;
  /** The action. Return a promise to keep the loading state until it settles; throw to skip the success state. */
  onClick?: () => unknown | Promise<unknown>;
  /** Label shown with the check after success, e.g. "Added". Defaults to the children. */
  successLabel?: ReactNode;
  /** Label shown while loading, e.g. "Sending…". Defaults to the children. */
  loadingLabel?: ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "lg" | "sm";
  /** Controlled loading state, for forms submitted elsewhere (e.g. react-hook-form). */
  loading?: boolean;
  /** How long the success state stays, in ms. */
  successFor?: number;
}

export function StatefulButton({
  children,
  onClick,
  successLabel,
  loadingLabel,
  variant = "default",
  size = "default",
  loading,
  successFor = 1600,
  className,
  disabled,
  type = "button",
  ...props
}: StatefulButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const shown: Status = loading ? "loading" : status;

  async function handleClick() {
    if (!onClick || shown === "loading") return;
    setStatus("loading");
    try {
      await onClick();
      setStatus("success");
      timer.current = setTimeout(() => setStatus("idle"), successFor);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <button
      type={type}
      {...props}
      disabled={disabled || shown === "loading"}
      aria-busy={shown === "loading" || undefined}
      onClick={onClick ? handleClick : undefined}
      className={cn(buttonClass(variant, size), "min-w-24 disabled:opacity-100", shown === "loading" && "cursor-progress", className)}
    >
      {shown === "loading" && <Loader2 aria-hidden className="animate-spin" />}
      {shown === "success" && <Check aria-hidden />}
      <span>{shown === "loading" ? (loadingLabel ?? children) : shown === "success" ? (successLabel ?? children) : children}</span>
      <span className="sr-only" aria-live="polite">
        {shown === "success" ? "Done" : ""}
      </span>
    </button>
  );
}
