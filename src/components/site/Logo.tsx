import Image from "next/image";
import Link from "next/link";
import { company } from "@/content/site";
import { cn } from "@/lib/utils";

/*
 * public/brand/logo.png is the horizontal lockup (mark left, wordmark right), composed from the
 * original stacked artwork and cropped to the ink with no transparent padding. 237×67px source.
 * TODO(owner): supply the logo as a vector (SVG) file, plus a white version for dark surfaces.
 * The source artwork is small, so the wordmark softens above ~32px tall.
 */
const LOGO = { src: "/brand/logo.png", width: 237, height: 67 } as const;

const heights = { header: "h-7", footer: "h-8" } as const;

/** The Syncytium Health logo. 28px tall in the header, 32px in the footer; width follows the artwork. */
export function Logo({ size = "header", href = "/", className }: { size?: keyof typeof heights; href?: string | null; className?: string }) {
  const img = (
    <Image
      src={LOGO.src}
      alt={company.name}
      width={LOGO.width}
      height={LOGO.height}
      sizes="120px"
      priority={size === "header"}
      className={cn("w-auto", heights[size])}
    />
  );
  if (!href) return <span className={cn("inline-flex", className)}>{img}</span>;
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center rounded-control", className)}>
      {img}
    </Link>
  );
}
