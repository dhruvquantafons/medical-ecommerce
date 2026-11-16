"use client";

import Link from 'next/link';
import { BentoCard, BentoGrid } from './ui/bento-grid';
import { Section, SectionHeading } from './site';

export interface RangeTile {
  name: string;
  description: string;
  href: string;
  count: number;
  countNoun: string;
  image?: { src: string; alt: string; fit?: "cover" | "contain" };
  wide?: boolean;
}

/** "What we make": one tile per therapeutic area from the product data (changeui.md, Problem 11). */
export function RangeSection({ tiles, compact = false }: { tiles: RangeTile[]; compact?: boolean }) {
  if (tiles.length === 0) return null;
  return (
    <Section id="range" labelledBy="pf-range-title" tone={compact ? 'surface' : 'default'}>
      <SectionHeading
        id="pf-range-title"
        eyebrow="Range"
        title={compact ? 'What we make' : 'What we make, by therapeutic area'}
        lead="Each area links to the products in it, with photographs of the actual packs."
      />
      <BentoGrid className="mt-10">
        {tiles.map(t => (
          <BentoCard
            key={t.href}
            name={t.name}
            description={t.description}
            href={t.href}
            image={t.image}
            meta={`${t.count} ${t.count === 1 ? t.countNoun : `${t.countNoun}s`}`}
            className={t.wide ? 'sm:col-span-2' : undefined}
          />
        ))}
      </BentoGrid>
      {!compact && (
        <p className="mt-8">
          <Link href="/portfolio/about" className="text-[15px] font-medium text-primary underline underline-offset-4">
            About the company
          </Link>
        </p>
      )}
    </Section>
  );
}
