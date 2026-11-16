"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/data/types';
import { Button } from './ui/button';
import { DotPattern } from './ui/dot-pattern';
import { TextAnimate } from './ui/text-animate';
import { NumberTicker } from './ui/number-ticker';
import { Container, Reveal } from './site';

export interface HomeFacts {
  formulations: number;
  storeProducts: number;
  areas: number;
}

interface HeroSectionProps {
  /** Store products with photos, best sellers first. The first three form the hero still. */
  products: Product[];
  /** Therapeutic areas as plain words, e.g. ["liver care", "gut health"]. */
  areas: string[];
  hasPrescription: boolean;
  facts: HomeFacts;
}

function listInWords(words: string[]): string {
  if (words.length <= 2) return words.join(' and ');
  return `${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}`;
}

/*
  Headline options (changeui.md, Problem 10 asks the owner to choose):
  1. "Medicines and daily supplements, with every ingredient listed."  <- in use
  2. "Our own medicines and supplements, labelled in full."
  3. "Pharmaceutical and nutraceutical formulations you can read in full."
*/
const HEADLINE = 'Medicines and daily supplements, with every ingredient listed.';

export function HeroSection({ products, areas, hasPrescription, facts }: HeroSectionProps) {
  const [main, ...rest] = products.filter(p => p.images.length > 0).slice(0, 3);
  const lead =
    `Formulations for ${listInWords(areas)}` +
    (hasPrescription ? ', alongside a range of prescription medicines.' : '.');

  const factRows = [
    { value: facts.formulations, label: 'formulations in our catalogue' },
    { value: facts.storeProducts, label: 'products in the online store' },
    { value: facts.areas, label: 'therapeutic areas' },
  ].filter(f => f.value > 0);

  return (
    <section aria-labelledby="pf-hero-title" className="relative overflow-hidden border-b border-border">
      <DotPattern
        width={22}
        height={22}
        cr={1.1}
        aria-hidden="true"
        className="text-border [mask-image:radial-gradient(ellipse_at_top_left,black_0%,transparent_55%)]"
      />
      <Container className="relative py-16 md:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Pharmaceuticals and nutraceuticals
            </p>
            <TextAnimate
              as="h1"
              id="pf-hero-title"
              by="word"
              animation="blurIn"
              once
              duration={0.5}
              className="max-w-[16ch] text-[44px] leading-[1.06] md:text-[60px]"
            >
              {HEADLINE}
            </TextAnimate>
            <p className="mt-6 max-w-[52ch] text-lg text-muted-foreground">{lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/shop">
                  Shop the range
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/portfolio/catalog">View all products</Link>
              </Button>
            </div>
          </div>

          {main && (
            <Reveal>
              {/* Composed still of real packs: no rotation, no floating. */}
              <div className="relative pb-24 sm:pb-28">
                <div className="aspect-[5/4] overflow-hidden rounded-lg border border-border bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={main.images[0]} alt={`${main.name} pack`} className="size-full object-cover" />
                </div>
                {rest.length > 0 && (
                  <div className="absolute right-0 bottom-0 left-[18%] grid grid-cols-2 gap-4">
                    {rest.map(p => (
                      <div key={p.id} className="aspect-square overflow-hidden rounded-lg border border-border bg-background">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={`${p.name} pack`} className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </div>

        {/* Proof row: only counts taken from the product data. */}
        {factRows.length >= 3 && (
          <dl className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
            {factRows.map(f => (
              <div key={f.label} className="flex flex-col-reverse sm:px-8 sm:first:pl-0">
                <dt className="mt-2 text-[15px] text-muted-foreground">{f.label}</dt>
                <dd className="font-display text-[44px] leading-none text-foreground">
                  <NumberTicker value={f.value} className="tabular-nums tracking-[-0.02em] text-foreground" />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
