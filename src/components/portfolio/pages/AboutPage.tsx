"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/data/types';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { Button } from '../ui/button';
import { Container, Label, Reveal, Section, SectionHeading } from '../site';
import { RangeSection, type RangeTile } from '../RangeSection';
import { BRAND, CONTACT_HREF, isPrescription } from '../copy';

/*
  About (changeui.md, Problem 16). Every statement below comes from earlier site copy or the
  product data; the owner should confirm the process steps.
  TODO(owner): where the company is based, and a photograph of the facility or team for the intro.
  TODO(owner): licence and certification numbers (add them to "At a glance" once supplied).
  TODO(owner): real milestones with dates.
  Removed: the four unsourced statistics, the three tabs, the pharmacy chains named as
  collaborators, the "Verified Standard" cards and the DNA animation.
*/

const STEPS = [
  {
    title: 'Identifying each ingredient',
    body: 'Each active ingredient is identified by its Chemical Abstracts Service (CAS) registry number. Anyone can use that number to check exactly which substance a formulation contains.',
  },
  {
    title: 'Testing the active salts',
    body: 'We verify the active salts in our formulations by spectrometry. The results are kept as a spectrometry log for each formulation.',
  },
  {
    title: 'Checking absorption',
    body: 'Formulations are tested for bio-equivalence, meaning how well the body absorbs them, and for side effects.',
  },
  {
    title: 'Quality review',
    body: 'Our quality assurance team checks every formulation against its CAS registration numbers, its spectrometry logs and our batch purity standards.',
  },
];

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
      <section aria-labelledby="pf-page-title" className="border-b border-border bg-tint">
        <Container className="py-16 md:py-28">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <Reveal>
              <SectionHeading as="h1" id="pf-page-title" title={`About ${BRAND}`} />
              <div className="mt-8 max-w-[56ch] space-y-5 text-[18px] leading-[1.6] text-muted-foreground md:text-[20px]">
                <p>
                  <span className="text-foreground">{BRAND} is a pharmaceutical and nutraceutical company.</span> We make our own
                  formulations, from prescription medicines to daily supplements, and sell part of the range direct through our
                  online store.
                </p>
                <p>
                  We publish the full composition of every product, with each active ingredient and its amount per unit, so patients,
                  doctors and pharmacists can see what a product contains.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <figure className="rounded-2xl border border-border bg-background p-5 shadow-[0_24px_64px_-32px_rgba(39,28,94,0.22)] sm:p-8">
                <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-display text-[26px] leading-[1.1] font-semibold tracking-[-0.03em] text-foreground">At a glance</span>
                  <Label>From this site&apos;s product data</Label>
                </figcaption>
                <dl className="mt-6 grid grid-cols-2 border-t border-foreground/70">
                  {glance.map((r, i) => (
                    <div
                      key={r.label}
                      className={`flex flex-col-reverse justify-end border-b border-border py-5 ${i % 2 === 1 ? 'border-l pl-5' : 'pr-5'}`}
                    >
                      <dt className="mt-2 text-[12px] leading-5 text-muted-foreground">{r.label}</dt>
                      <dd className="font-display text-[56px] leading-[1.1] font-semibold tracking-[-0.03em] tabular-nums text-foreground">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                {forms.length > 0 && (
                  <div className="pt-5">
                    <Label>Dosage forms</Label>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {forms.map(f => (
                        <li key={f} className="rounded-[4px] border border-border px-2 py-0.5 text-[14px] text-foreground first-letter:uppercase">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      <RangeSection tiles={tiles} tone="surface" showAboutLink={false} />

      <Section labelledBy="pf-process-title">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <SectionHeading id="pf-process-title" title="How we check our products" />
          <p className="max-w-[44ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[20px] lg:justify-self-end">
            The checks a formulation goes through, in order.
          </p>
        </div>
        <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              {/* Track: a node and a line running to the next step, like a protocol sheet. */}
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="flex size-8 items-center justify-center rounded-[6px] bg-primary text-[12px] font-semibold tabular-nums text-primary-foreground">
                  {i + 1}
                </span>
                <span className="h-px flex-1 bg-foreground/20" />
              </div>
              <Label className="mt-6">Step {i + 1} of {STEPS.length}</Label>
              <h3 className="mt-2 font-display text-[22px] leading-[1.15] font-semibold tracking-[-0.03em]">{step.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.6] text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="pf-next-title" tone="tint">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-8">
          <SectionHeading
            id="pf-next-title"
            title="See the full range"
            lead="Browse every formulation with its composition, or get in touch about stocking our products."
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/portfolio/catalog">
                Browse the catalog
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={CONTACT_HREF}>Contact us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
