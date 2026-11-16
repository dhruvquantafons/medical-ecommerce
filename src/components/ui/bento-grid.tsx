/*
 * Magic UI "Bento Grid", restyled to the Syncytium tokens (CLAUDE.md): tiles on the surface colour with a
 * 1px border, 14px radius, no shadow. On hover the border darkens and the image scales to 1.03; no
 * spotlight, glow, lift or sliding call-to-action. The whole tile is one link.
 */

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({ children, className, ...props }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className={cn("grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {children}
    </ul>
  );
}

export function BentoCard({
  name,
  description,
  meta,
  href,
  image,
  className,
  headingLevel: H = "h3",
}: {
  name: string;
  description: string;
  /** Short muted line under the description, e.g. "3 products". */
  meta?: ReactNode;
  href: string;
  /** The tile's photo; scaled to 1.03 on hover. */
  image: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <li className={cn("group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-ink-subtle", className)}>
      <div className="relative h-48 overflow-hidden border-b border-line bg-background md:h-56 [&_img]:transition-transform [&_img]:duration-200 group-hover:[&_img]:scale-[1.03]">
        {image}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <H className="text-xl font-medium text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-card">
            {name}
          </Link>
        </H>
        <p className="text-[15px] text-ink-muted">{description}</p>
        {meta && <p className="mt-auto pt-3 text-sm text-ink-subtle">{meta}</p>}
      </div>
    </li>
  );
}
