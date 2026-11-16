"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/data/types';
import { Button } from '../ui/button';
import { Container, Reveal, Section, SectionHeading } from '../site';
import { RangeSection, type RangeTile } from '../RangeSection';
import { BRAND, CONTACT_HREF } from '../copy';

/*
  About (changeui.md, Problem 16). Every statement below comes from earlier site copy or the
  product data; the owner should confirm the process steps.
  TODO(owner): where the company is based, and a photograph of the facility or team for the intro.
  TODO(owner): licence and certification numbers (a "Licences" section appears once supplied).
  TODO(owner): real milestones with dates (an Aceternity Timeline can be added once supplied).
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

export function AboutPage({ products, tiles }: { products: Product[]; tiles: RangeTile[] }) {
  const photos = products.filter(p => p.images.length > 0).slice(0, 4);

  return (
    <>
      <section aria-labelledby="pf-page-title" className="border-b border-border">
        <Container className="py-16 md:py-24">
          <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                as="h1"
                id="pf-page-title"
                eyebrow="Company"
                title={`About ${BRAND}`}
              />
              <div className="mt-6 max-w-[60ch] space-y-4 text-lg text-muted-foreground">
                <p>
                  {BRAND} is a pharmaceutical and nutraceutical company. We make our own formulations, from prescription medicines to
                  daily supplements, and sell part of the range direct through our online store.
                </p>
                <p>
                  We publish the full composition of every product, with each active ingredient and its amount per unit, so patients,
                  doctors and pharmacists can see what a product contains.
                </p>
              </div>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4" aria-label="Some of our products">
                {photos.map(p => (
                  <div key={p.id} className="aspect-square overflow-hidden rounded-lg border border-border bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={`${p.name} pack`} className="size-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </Container>
      </section>

      <RangeSection tiles={tiles} compact />

      <Section labelledBy="pf-process-title">
        <SectionHeading
          id="pf-process-title"
          eyebrow="Quality"
          title="How we check our products"
          lead="The checks a formulation goes through, in order."
        />
        <ol className="mt-10 grid gap-0 border-t border-border md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-b border-border py-6 md:px-6 md:first:pl-0 lg:border-b-0 lg:border-l lg:first:border-l-0">
              <p className="font-mono text-sm text-subtle" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="pf-next-title" tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-6">
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
