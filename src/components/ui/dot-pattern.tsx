import { useId, type SVGProps } from "react"

import { cn } from "@/lib/utils"

/*
 * Magic UI "Dot Pattern", reduced to its static form for this site (CLAUDE.md, Motion: no looping
 * decoration). The animated `glow` option is removed, and the dots are drawn with an SVG <pattern>
 * instead of one element per dot, so it renders on the server and needs no resize listener.
 * Dot colour follows `currentColor` (default: the border token).
 */
interface DotPatternProps extends SVGProps<SVGSVGElement> {
  /** Horizontal spacing between dots. */
  width?: number
  /** Vertical spacing between dots. */
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  /** Dot radius. */
  cr?: number
}

export function DotPattern({ width = 16, height = 16, x = 0, y = 0, cx = 1, cy = 1, cr = 1, className, ...props }: DotPatternProps) {
  const id = useId()
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full text-line", className)} {...props}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
