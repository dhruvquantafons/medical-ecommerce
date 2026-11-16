"use client";

import Link from 'next/link';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Button } from './ui/button';
import { Section, SectionHeading } from './site';
import { CompositionTable } from './CompositionTable';
import { LABEL_ADVICE } from './copy';

/** Home: a preview of the Salt Inspector built from one real catalogue item. */
export function CompositionTeaser({ items }: { items: CatalogItem[] }) {
  const item = items.find(i => parseSalts(i.salts).length >= 2);
  if (!item) return null;
  const salts = parseSalts(item.salts);

  return (
    <Section id="composition" labelledBy="pf-composition-title" tone="surface">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <div>
          <SectionHeading
            id="pf-composition-title"
            eyebrow="Composition"
            title="See exactly what is in each formulation"
            lead="The Salt Inspector lists every active ingredient in a product, its amount per unit, what it does and its CAS registry number."
          />
          <div className="mt-8">
            <Button asChild>
              <Link href="/portfolio/salt-inspector">Open the Salt Inspector</Link>
            </Button>
          </div>
        </div>
        <figure className="rounded-lg border border-border bg-background p-5 sm:p-6">
          <figcaption className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-lg font-medium text-foreground">{item.name}</span>
            <span className="text-sm text-muted-foreground">{item.dosageForm}</span>
          </figcaption>
          <CompositionTable salts={salts} productName={item.name} compact />
          <p className="mt-3 text-sm text-subtle">{LABEL_ADVICE}</p>
        </figure>
      </div>
    </Section>
  );
}
