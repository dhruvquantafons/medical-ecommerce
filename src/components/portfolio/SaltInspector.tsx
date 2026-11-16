"use client";

import { useState } from 'react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CompositionTable } from './CompositionTable';
import { usePortfolio } from './PortfolioContext';
import { LABEL_ADVICE, categoryLabel, displayBrand, isPrescription } from './copy';

/*
  "What's inside" explorer (changeui.md, Problem 14): shadcn tabs, one per product; photo and
  product facts on the left, composition table on the right.
  Removed: the 3D molecule, bioavailability and half-life bars, bracketed percentages, the joined
  formula string and the JSON-LD view.
  Not added: Aceternity Tooltip Card explanations per ingredient, because the data has no
  plain-language explanation to show and new pharmacological claims must not be written.
*/

interface SaltInspectorProps {
  items: CatalogItem[];
  /** Product to show first, e.g. from ?item= when arriving from a product dialog. */
  initialId?: string;
}

export function SaltInspector({ items, initialId }: SaltInspectorProps) {
  const { openItem } = usePortfolio();
  const withSalts = items.filter(i => parseSalts(i.salts).length > 0);
  const [value, setValue] = useState<string>(
    withSalts.some(i => i.id === initialId) ? initialId! : withSalts[0]?.id ?? '',
  );

  if (withSalts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
        <h2 className="text-[24px]">No products to inspect yet</h2>
        <p className="mt-2 text-muted-foreground">Products appear here once their composition is added to the catalogue.</p>
      </div>
    );
  }

  return (
    <Tabs value={value} onValueChange={setValue} className="gap-8">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <TabsList className="h-auto w-max gap-1 rounded-lg border border-border bg-surface p-1">
          {withSalts.map(item => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="h-10 flex-none px-3.5 text-[15px] text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {withSalts.map(item => {
        const salts = parseSalts(item.salts);
        return (
          <TabsContent key={item.id} value={item.id}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div>
                <div className="aspect-square overflow-hidden rounded-lg border border-border bg-surface">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={`${item.name} pack`} className="size-full object-contain p-[12%] mix-blend-multiply" />
                  )}
                </div>
                <h2 className="mt-5 text-[32px] leading-tight">{item.name}</h2>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
                  <dt className="text-muted-foreground">Form</dt>
                  <dd>{item.dosageForm}</dd>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd>{categoryLabel(item.category)}</dd>
                  <dt className="text-muted-foreground">Marketed by</dt>
                  <dd>{displayBrand(item.brand)}</dd>
                </dl>
                {isPrescription(item.category) && <Badge className="mt-4">Prescription required</Badge>}
                <div className="mt-5">
                  <Button variant="outline" onClick={() => openItem(item)}>Product details</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Composition</h3>
                <div className="mt-2">
                  <CompositionTable salts={salts} productName={item.name} />
                </div>
                <p className="mt-4 text-sm text-subtle">{LABEL_ADVICE}</p>
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
