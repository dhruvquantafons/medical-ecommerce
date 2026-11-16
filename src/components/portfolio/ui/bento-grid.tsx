import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

/*
  Magic UI Bento Grid, restyled to the company-page tokens (changeui.md, Problem 11):
  surface tiles with a 1px border, no shadow. On hover the border darkens and the image
  scales to 1.03. The whole tile is one link. No spotlight, glow or tilt.
*/

interface BentoGridProps extends ComponentPropsWithoutRef<"ul"> {
  children: ReactNode
}

function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <ul
      className={cn("grid w-full auto-rows-[20rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

interface BentoCardProps {
  name: string
  description: string
  href: string
  /** Real product photo for this area. */
  image?: { src: string; alt: string; fit?: "cover" | "contain" }
  /** Small line under the description, e.g. "3 products". */
  meta?: string
  className?: string
}

function BentoCard({ name, description, href, image, meta, className }: BentoCardProps) {
  return (
    <li className={cn("min-w-0", className)}>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-foreground/40"
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className={cn("absolute inset-0 size-full transition-transform duration-300 group-hover:scale-[1.03]", image.fit === "contain" ? "object-contain p-2 mix-blend-multiply" : "object-cover")}
            />
          )}
        </div>
        <div className="border-t border-border bg-background px-5 py-4">
          <h3 className="text-lg font-medium text-foreground">{name}</h3>
          <p className="mt-1 line-clamp-2 text-[15px] text-muted-foreground">{description}</p>
          {meta && <p className="mt-2 text-sm text-subtle">{meta}</p>}
        </div>
      </Link>
    </li>
  )
}

export { BentoCard, BentoGrid }
