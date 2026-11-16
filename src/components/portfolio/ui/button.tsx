import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-[15px] font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** Solid brand. */
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        /** Outline: secondary actions. */
        outline: "border border-input bg-background text-foreground hover:border-foreground hover:bg-accent",
        /** Text only. */
        ghost: "text-foreground hover:bg-accent",
        link: "h-auto px-0 text-primary underline underline-offset-4 decoration-1 hover:decoration-2",
      },
      size: {
        /** 44px: the minimum touch target. */
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
