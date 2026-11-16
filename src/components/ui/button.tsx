import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * Buttons: solid brand primary (`default`), outline secondary (`outline`), text-only ghost (`ghost`).
 * 44px tall by default. Add an arrow icon only when the button leaves the page.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-control border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-foreground hover:bg-brand-hover",
        outline: "border-line bg-background text-ink hover:border-ink-subtle hover:bg-surface aria-expanded:bg-surface",
        secondary: "bg-surface text-ink hover:bg-line aria-expanded:bg-line",
        ghost: "text-ink hover:bg-brand-tint hover:text-brand aria-expanded:bg-brand-tint",
        destructive: "bg-danger text-white hover:bg-danger/90",
        link: "h-auto! px-0! text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3.5",
        lg: "h-11 px-6 text-base",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

/** @deprecated Names from the pre-shadcn store Button. Use `default`, `outline`, `secondary` or `ghost`. */
type LegacyVariant = "primary" | "accent" | "dark"
/** @deprecated Use `default` instead of `md`. */
type LegacySize = "md"

const legacyVariant: Record<LegacyVariant, ButtonVariant> = { primary: "default", dark: "default", accent: "secondary" }

function resolveVariant(v?: ButtonVariant | LegacyVariant | null): ButtonVariant | undefined {
  if (!v) return undefined
  return v in legacyVariant ? legacyVariant[v as LegacyVariant] : (v as ButtonVariant)
}
function resolveSize(s?: ButtonSize | LegacySize | null): ButtonSize | undefined {
  if (!s) return undefined
  return s === "md" ? "default" : s
}

type ButtonStyleProps = {
  variant?: ButtonVariant | LegacyVariant | null
  size?: ButtonSize | LegacySize | null
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & ButtonStyleProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  const v = resolveVariant(variant) ?? "default"
  const s = resolveSize(size) ?? "default"

  return (
    <Comp
      data-slot="button"
      data-variant={v}
      data-size={s}
      className={cn(buttonVariants({ variant: v, size: s }), className)}
      {...props}
    />
  )
}

/** A Next.js `<Link>` styled as a button. Equivalent to `<Button asChild><Link/></Button>`. */
function ButtonLink({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}

/** Class string for elements that cannot use <Button> directly. */
function buttonClass(
  variant?: ButtonVariant | LegacyVariant | null,
  size?: ButtonSize | LegacySize | null,
  className?: string
) {
  return cn(buttonVariants({ variant: resolveVariant(variant), size: resolveSize(size) }), className)
}

export { Button, ButtonLink, buttonClass, buttonVariants }
