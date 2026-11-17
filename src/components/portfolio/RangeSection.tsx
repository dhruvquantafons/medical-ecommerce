"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label, Section, SectionHeading, type Tone } from './site';
import type { BackdropProps } from './kit';

export interface RangeTile {
  name: string;
  description: string;
  href: string;
  count: number;
  countNoun: string;
  image?: { src: string; alt: string; fit?: "cover" | "contain" };
  wide?: boolean;
}

const countText = (t: RangeTile) => `${t.count} ${t.count === 1 ? t.countNoun : `${t.countNoun}s`}`;

/**
 * "What we make": one row per therapeutic area from the product data (changeui.md, Problem 11).
 * Large names set like an index; on wide screens the pack for the row under the pointer or focus
 * appears in the panel beside it. On small screens each row carries its own thumbnail.
 */
export function RangeSection({
  tiles,
  tone = 'default',
  curveFrom,
  backdrop,
  showAboutLink = true,
}: {
  tiles: RangeTile[];
  tone?: Tone;
  curveFrom?: Tone;
  backdrop?: BackdropProps;
  showAboutLink?: boolean;
}) {
  const [active, setActive] = useState(0);
  if (tiles.length === 0) return null;
  const current = tiles[Math.min(active, tiles.length - 1)];

  return (
    <Section id="range" labelledBy="pf-range-title" tone={tone} curveFrom={curveFrom} backdrop={backdrop}>
      <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
        <SectionHeading id="pf-range-title" title="What we make" />
        <p className="max-w-[44ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[20px] lg:justify-self-end">
          Our formulations by therapeutic area. Each area opens its products, photographed as they are sold.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <ul className="border-t border-foreground/70">
          {tiles.map((t, i) => (
            <li key={t.href} className="border-b border-border">
              <Link
                href={t.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 rounded-sm py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8 lg:py-6"
              >
                <div className="aspect-square overflow-hidden rounded-lg border border-border bg-white lg:hidden">
                  {t.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image.src} alt="" loading="lazy" className={cn('size-full', t.image.fit === 'contain' ? 'object-contain p-2' : 'object-cover')} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3
                    className={cn(
                      'font-display text-[24px] leading-[1.1] font-medium tracking-[-0.03em] transition-colors duration-200 md:text-[34px]',
                      i === active ? 'text-foreground' : 'text-foreground lg:text-muted-foreground',
                    )}
                  >
                    {t.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[16px] text-muted-foreground lg:line-clamp-1">{t.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden font-mono text-[12px] whitespace-nowrap text-subtle sm:inline">{countText(t)}</span>
                  <ArrowRight
                    className={cn('size-[18px] text-subtle transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground', i === active && 'lg:text-foreground')}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pack preview for the current row (decorative: the row link carries the name). */}
        <div className="hidden lg:block" aria-hidden="true">
          <div className="sticky top-24">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white">
              {tiles.map((t, i) =>
                t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={t.href}
                    src={t.image.src}
                    alt=""
                    loading="lazy"
                    className={cn(
                      'absolute inset-0 size-full transition-opacity duration-300',
                      t.image.fit === 'contain' ? 'object-contain p-10' : 'object-cover',
                      i === active ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                ) : null,
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <Label className="text-foreground">{current.name}</Label>
              <Label>{countText(current)}</Label>
            </div>
          </div>
        </div>
      </div>

      {showAboutLink && (
        <p className="mt-10">
          <Link href="/portfolio/about" className="rounded-sm text-[16px] font-medium text-primary underline underline-offset-4">
            About the company
          </Link>
        </p>
      )}
    </Section>
  );
}
