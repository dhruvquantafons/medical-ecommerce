import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";

export type RangeTile = {
  name: string;
  description: string;
  count: number;
  /** What the count counts, singular, e.g. "product" or "prescription formulation". */
  unit: string;
  href: string;
  /** One photo, or several shown side by side (used for the catalogue packs, which sit on white with wide margins). */
  images?: { src: string; alt: string }[];
  wide?: boolean;
};

/*
 * "What we make" (changeui.md Problem 11), replacing the old "Precision Pharmaceutical Excellence" section.
 * One tile per therapeutic area found in the store data, plus a wider tile for the prescription
 * formulations in the catalogue. Every name, description, photo and count comes from the database.
 */
export function RangeSection({ tiles }: { tiles: RangeTile[] }) {
  if (tiles.length === 0) return null;
  return (
    <Section id="range">
      <SectionHeading
        eyebrow="Range"
        title="What we make"
        lead="The therapeutic areas in our store, and the prescription formulations in our product catalogue."
      />
      <BentoGrid className="mt-10">
        {tiles.map((t) => (
          <BentoCard
            key={t.name}
            name={t.name}
            description={t.description}
            meta={`${t.count} ${t.unit}${t.count === 1 ? "" : "s"}`}
            href={t.href}
            className={t.wide ? "sm:col-span-2" : undefined}
            image={
              t.images?.length ? (
                <div className="flex size-full">
                  {t.images.map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element -- product photos are served from the database API or admin URLs
                    <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className="h-full min-w-0 flex-1 object-cover" />
                  ))}
                </div>
              ) : null
            }
          />
        ))}
      </BentoGrid>
      <Link href="/about" className="mt-8 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-brand hover:underline hover:underline-offset-4">
        About the company <ArrowRight aria-hidden className="size-4" />
      </Link>
    </Section>
  );
}
