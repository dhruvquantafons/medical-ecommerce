"use client";

import Link from 'next/link';
import { ClipboardCheck, Droplets, ScanSearch, Waves } from 'lucide-react';
import type { Product } from '@/data/types';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { Container, Section } from '../site';
import { RangeSection, type RangeTile } from '../RangeSection';
import { DotPattern } from '../ui/dot-pattern';
import { BRAND, CONTACT_HREF, isPrescription } from '../copy';
import { ActionButton, Badge, Card, CountUp, MoleculeField, Reveal, SectionHeader, SectionNav, Timeline, type TimelineItem } from '../kit';

/*
  About (changeui.md, Problem 16). Every statement below comes from earlier site copy or the
  product data; the owner should confirm the process steps.
  TODO(owner): where the company is based, and a photograph of the facility or team for the intro.
  TODO(owner): licence and certification numbers (add them to "At a glance" once supplied).
  TODO(owner): real milestones with dates. The Timeline component takes a `meta` line for the date,
  so a "Milestones" section can reuse it once there are facts to show.
  Removed: the four unsourced statistics, the three tabs, the pharmacy chains named as
  collaborators, the "Verified Standard" cards and the DNA animation.
*/

const STEPS: TimelineItem[] = [
  {
    title: 'Identifying each ingredient',
    icon: ScanSearch,
    body: 'Each active ingredient is identified by its Chemical Abstracts Service (CAS) registry number. Anyone can use that number to check exactly which substance a formulation contains.',
  },
  {
    title: 'Testing the active salts',
    icon: Waves,
    body: 'We verify the active salts in our formulations by spectrometry. The results are kept as a spectrometry log for each formulation.',
  },
  {
    title: 'Checking absorption',
    icon: Droplets,
    body: 'Formulations are tested for bio-equivalence, meaning how well the body absorbs them, and for side effects.',
  },
  {
    title: 'Quality review',
    icon: ClipboardCheck,
    body: 'Our quality assurance team checks every formulation against its CAS registration numbers, its spectrometry logs and our batch purity standards.',
  },
];

const NAV = [
  { id: 'range', label: 'What we make' },
  { id: 'process', label: 'How we check our products' },
  { id: 'next', label: 'See the full range' },
];

const rise = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

interface AboutPageProps {
  items: CatalogItem[];
  products: Product[];
  tiles: RangeTile[];
}

export function AboutPage({ items, products, tiles }: AboutPageProps) {
  const rx = items.filter(i => isPrescription(i.category)).length;
  const forms = Array.from(new Set(items.map(i => i.dosageForm.toLowerCase()))).sort();
  const areas = tiles.filter(t => t.countNoun === 'product').length;

  // Figures from the product data only.
  const glance = [
    { label: 'Formulations in our catalog', value: items.length },
    { label: 'On prescription', value: rx },
    { label: 'Products in our online store', value: products.length },
    { label: 'Therapeutic areas in the store', value: areas },
  ].filter(r => r.value > 0);

  return (
    <>
      {/* Editorial hero: the name set large, the two-paragraph introduction, the figures beside it. */}
      <section aria-labelledby="pf-page-title" className="relative isolate overflow-hidden border-b border-border bg-white">
        <DotPattern
          width={22}
          height={22}
          cr={1.1}
          aria-hidden="true"
          className="-z-10 text-[#ddd8ea] [mask-image:radial-gradient(ellipse_at_top_right,black_0%,transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="absolute right-[-10%] bottom-[-20%] -z-10 h-[80%] w-[60%] bg-[radial-gradient(closest-side,#eee9ff_0%,rgba(238,233,255,0.5)_45%,transparent_100%)]"
        />
        <MoleculeField className="-z-10 opacity-70 max-md:opacity-40" />

        <Container className="relative pt-16 pb-16 md:pt-24 md:pb-24">
          <h1
            id="pf-page-title"
            className="pf-rise max-w-[14ch] text-[48px] leading-[1] tracking-[-0.04em] sm:text-[64px] lg:text-[88px] lg:leading-[0.98] lg:tracking-[-0.045em]"
            style={rise(0)}
          >
            About <span className="text-primary">{BRAND}</span>
          </h1>

          <div className="mt-12 grid grid-cols-1 gap-12 border-t border-foreground/70 pt-10 lg:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div className="pf-rise max-w-[58ch] space-y-6" style={rise(120)}>
              <p className="text-[20px] leading-[1.55] text-muted-foreground md:text-[24px] md:leading-[1.5]">
                <span className="text-foreground">{BRAND} is a pharmaceutical and nutraceutical company.</span> We make our own
                formulations, from prescription medicines to daily supplements, and sell part of the range direct through our
                online store.
              </p>
              <p className="text-[18px] leading-[1.6] text-muted-foreground">
                We publish the full composition of every product, with each active ingredient and its amount per unit, so patients,
                doctors and pharmacists can see what a product contains.
              </p>
            </div>

            <Card elevation={2} asChild className="pf-rise rounded-[20px] p-5 sm:p-7">
              <figure style={rise(220)}>
                <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-display text-[24px] leading-[1.1] font-semibold tracking-[-0.03em] text-foreground">At a glance</span>
                  <span className="text-[13px] text-subtle">From this site&apos;s product data</span>
                </figcaption>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  {glance.map((r, i) => (
                    <div key={r.label} className="flex flex-col-reverse justify-end rounded-xl border border-border bg-[#faf9fd] p-4">
                      <dt className="mt-2 text-[13px] leading-5 text-muted-foreground">{r.label}</dt>
                      <dd className="font-display text-[44px] leading-none font-medium tracking-[-0.035em] text-foreground sm:text-[52px]">
                        <CountUp value={r.value} duration={1300} delay={400 + i * 90} />
                      </dd>
                    </div>
                  ))}
                </dl>
                {forms.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-[13px] font-semibold text-foreground">Dosage forms</p>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {forms.map(f => (
                        <li key={f}>
                          <Badge>{f.charAt(0).toUpperCase() + f.slice(1)}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </figure>
            </Card>
          </div>
        </Container>
      </section>

      <SectionNav items={NAV} />

      <Reveal>
        <RangeSection tiles={tiles} tone="surface" showAboutLink={false} />
      </Reveal>

      <Section id="process" labelledBy="pf-process-title">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* The heading stays in view (below the header and section bar) while the steps scroll past. */}
          <Reveal className="lg:sticky lg:top-40 lg:self-start">
            <SectionHeader
              id="pf-process-title"
              layout="stack"
              title="How we check our products"
              lead="The checks a formulation goes through, in order."
            />
          </Reveal>
          <Timeline items={STEPS} label="Checks, in order" />
        </div>
      </Section>

      <Section id="next" labelledBy="pf-next-title" tone="tint">
        <Reveal>
          <Card elevation={2} className="relative isolate overflow-hidden rounded-[28px] px-6 py-12 sm:px-12 sm:py-16">
            <MoleculeField className="-z-10 opacity-40" />
            <SectionHeader
              id="pf-next-title"
              title="See the full range"
              lead="Browse every formulation with its composition, or get in touch about stocking our products."
              actions={
                <>
                  <ActionButton asChild size="lg" arrow>
                    <Link href="/portfolio/catalog">Browse the catalog</Link>
                  </ActionButton>
                  <ActionButton asChild size="lg" variant="secondary">
                    <Link href={CONTACT_HREF}>Contact us</Link>
                  </ActionButton>
                </>
              }
            />
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
