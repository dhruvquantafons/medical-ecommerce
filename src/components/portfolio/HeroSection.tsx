"use client";

import Link from 'next/link';
import { FlaskConical, Layers, ShoppingBag } from 'lucide-react';
import type { Product } from '@/data/types';
import { DotPattern } from './ui/dot-pattern';
import { Container } from './site';
import { ActionButton, CountUp, MoleculeField, parallaxLayer, usePointerParallax } from './kit';

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
  The second clause is set in the brand colour; the words are unchanged.
*/
const HEADLINE = ['Medicines and daily supplements,', 'with every ingredient listed.'] as const;

/** Load entrance delay, in ms, for the hero's staggered rise (CSS only, see .pf-rise). */
const rise = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

/**
 * Home hero, in the layout the owner chose on 2026-11-17: text left, a composed still of three
 * real packs right, counts below. Depth comes from three layers (tinted plate, main pack, two
 * smaller packs) that shift slightly with the pointer, over a faint molecule motif.
 */
export function HeroSection({ products, areas, hasPrescription, facts }: HeroSectionProps) {
  const [main, ...rest] = products.filter(p => p.images.length > 0).slice(0, 3);
  const stageRef = usePointerParallax<HTMLDivElement>();
  const lead =
    `Formulations for ${listInWords(areas)}` +
    (hasPrescription ? ', alongside a range of prescription medicines.' : '.');

  // Counts taken from the product data, nothing else.
  const factRows = [
    { value: facts.formulations, label: 'formulations in our catalog', Icon: FlaskConical },
    { value: facts.storeProducts, label: 'products in the online store', Icon: ShoppingBag },
    { value: facts.areas, label: 'therapeutic areas', Icon: Layers },
  ].filter(f => f.value > 0);

  return (
    <section aria-labelledby="pf-hero-title" className="relative isolate overflow-hidden border-b border-border bg-white">
      {/* Background layers: dot grid top-left, a pale violet wash behind the packs, the molecule motif. */}
      <DotPattern
        width={22}
        height={22}
        cr={1.1}
        aria-hidden="true"
        className="-z-10 text-[#ddd8ea] [mask-image:radial-gradient(ellipse_at_top_left,black_0%,transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[-10%] right-[-12%] -z-10 h-[90%] w-[70%] bg-[radial-gradient(closest-side,#eee9ff_0%,rgba(238,233,255,0.55)_45%,transparent_100%)]"
      />
      <MoleculeField className="-z-10 max-md:opacity-60" />

      <Container className="relative pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="grid grid-cols-1 items-center gap-14 lg:min-h-[580px] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
          <div>
            <p className="pf-rise mb-5 text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase" style={rise(0)}>
              Pharmaceuticals and nutraceuticals
            </p>
            <h1
              id="pf-hero-title"
              className="pf-rise max-w-[15ch] text-[44px] leading-[1.03] tracking-[-0.035em] sm:text-[56px] lg:text-[72px] lg:leading-[1] lg:tracking-[-0.042em]"
              style={rise(80)}
            >
              {HEADLINE[0]} <span className="text-primary">{HEADLINE[1]}</span>
            </h1>
            <p className="pf-rise mt-7 max-w-[50ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[19px]" style={rise(180)}>
              {lead}
            </p>
            <div className="pf-rise mt-9 flex flex-wrap gap-3" style={rise(260)}>
              <ActionButton asChild size="lg" arrow>
                <Link href="/shop">Shop the range</Link>
              </ActionButton>
              <ActionButton asChild size="lg" variant="secondary">
                <Link href="/portfolio/catalog">View all products</Link>
              </ActionButton>
            </div>
          </div>

          {main && (
            <div ref={stageRef} className="pf-rise relative" style={rise(200)}>
              {/* Layer 1: a tinted plate offset behind the main pack. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[-4%] top-[8%] bottom-[14%] rounded-[28px] border border-[#e3ddf5] bg-[#f4f1fd]"
                style={parallaxLayer(-6)}
              >
                <DotPattern width={16} height={16} cr={1} className="rounded-[28px] text-[#d9d1f5]" />
              </div>

              {/* Layer 2 and 3: one large pack, two smaller ones overlapping its lower edge. No rotation. */}
              <div className="relative pb-24 sm:pb-28">
                <div className="relative overflow-hidden rounded-[20px] border border-white bg-surface shadow-[var(--pf-shadow-3)]" style={parallaxLayer(8)}>
                  <div className="aspect-[5/4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={main.images[0]} alt={`${main.name} pack`} fetchPriority="high" className="size-full object-cover" />
                  </div>
                </div>
                {rest.length > 0 && (
                  <div className="absolute right-[-2%] bottom-0 left-[16%] grid grid-cols-2 gap-4" style={parallaxLayer(16)}>
                    {rest.map(p => (
                      <div
                        key={p.id}
                        className="aspect-square overflow-hidden rounded-[18px] border-4 border-white bg-background shadow-[var(--pf-shadow-3)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={`${p.name} pack`} className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {factRows.length >= 3 && (
          <dl className="mt-16 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {factRows.map((f, i) => (
              <div
                key={f.label}
                className="pf-rise flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-[var(--pf-shadow-1)] sm:p-5"
                style={rise(420 + i * 90)}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#efebfd] text-primary" aria-hidden="true">
                  <f.Icon className="size-[22px]" strokeWidth={1.6} />
                </span>
                <div className="flex min-w-0 flex-col-reverse">
                  <dt className="text-[15px] leading-snug text-muted-foreground">{f.label}</dt>
                  <dd className="font-display text-[34px] leading-none font-medium tracking-[-0.03em] text-foreground">
                    <CountUp value={f.value} duration={1300} delay={500 + i * 90} />
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
