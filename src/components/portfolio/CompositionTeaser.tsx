"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { Button } from './ui/button';
import { Section, SectionHeading } from './site';
import { FormularyChart } from './FormularyChart';

/** Home: the whole catalog by composition, leading into the Salt Inspector. */
export function CompositionTeaser({ items }: { items: CatalogItem[] }) {
  return (
    <Section id="composition" labelledBy="pf-composition-title" tone="tint">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
        <SectionHeading
          id="pf-composition-title"
          eyebrow="Salt Inspector"
          title="Every formulation, ingredient by ingredient"
          lead="Each bar is one product and each segment one active ingredient, sized by its share of the actives by weight. Select a product to see its full composition and CAS numbers."
        />
        <Button asChild>
          <Link href="/portfolio/salt-inspector">
            Open the Salt Inspector
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <div className="mt-12">
        <FormularyChart items={items} />
      </div>
    </Section>
  );
}
