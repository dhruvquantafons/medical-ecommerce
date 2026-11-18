/**
 * Radix portals render into <body> by default, outside the company pages' [data-portfolio]
 * wrapper, which holds the fonts and token overrides. Portal into the wrapper instead.
 */
export function portfolioContainer(): HTMLElement | undefined {
  if (typeof document === "undefined") return undefined;
  return document.querySelector<HTMLElement>("[data-portfolio]") ?? undefined;
}
