"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/** Toasts styled to the design tokens. The site is light-only, so no theme switching. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group [--border-radius:var(--radius-card)] [--normal-bg:var(--popover)] [--normal-border:var(--border)] [--normal-text:var(--popover-foreground)]"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-brand" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-danger" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "cn-toast font-sans shadow-overlay",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
