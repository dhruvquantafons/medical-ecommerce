"use client";

import { useEffect, useState } from 'react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { CompositionTable } from './CompositionTable';
import { Label, RxTag } from './site';
import { usePortfolio } from './PortfolioContext';
import { LABEL_ADVICE, categoryLabel, displayBrand, isPrescription } from './copy';

/*
  "What's inside" explorer (changeui.md, Problem 14). A product index on the left (a scrolling strip
  on small screens), and the selected product with its full composition panel on the right.
  Removed: the 3D molecule, bioavailability and half-life bars, bracketed percentages, the joined
  formula string and the JSON-LD view.
  Not added: plain-language explanations per ingredient, because the data has none and new
  pharmacological claims must not be written.
*/

interface SaltInspectorProps {
  items: CatalogItem[];
  /** Product to show first, e.g. from ?item= when arriving from a product dialog. */
  initialId?: string;
}

/** Vertical list on desktop, horizontal strip on small screens, so arrow keys match what people see. */
function useWide(query = '(min-width: 1024px)') {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return wide;
}

export function SaltInspector({ items, initialId }: SaltInspectorProps) {
  const { openItem } = usePortfolio();
  const wide = useWide();
  const withSalts = items.filter(i => parseSalts(i.salts).length > 0);
  const [value, setValue] = useState<string>(
    withSalts.some(i => i.id === initialId) ? initialId! : withSalts[0]?.id ?? '',
  );

  if (withSalts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <h2 className="text-[24px]">No products to inspect yet</h2>
        <p className="mt-2 text-muted-foreground">Products appear here once their composition is added to the catalog.</p>
      </div>
    );
  }

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      orientation={wide ? 'vertical' : 'horizontal'}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12"
    >
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:overflow-visible">
        <p id="pf-inspector-list" className="mb-3 hidden text-[12px] font-medium text-subtle lg:block">
          {withSalts.length} formulations
        </p>
        <TabsList
          aria-labelledby="pf-inspector-list"
          className="h-auto w-max gap-1 rounded-none bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto lg:w-full lg:items-stretch lg:gap-0.5 lg:border-t lg:border-foreground/80 lg:pt-2"
        >
          {withSalts.map(item => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="h-10 flex-none gap-3 rounded-md border border-border px-3 text-[16px] font-normal text-muted-foreground after:hidden hover:bg-background hover:text-foreground data-[state=active]:bg-background data-[state=active]:font-medium data-[state=active]:text-foreground lg:h-9 lg:border-transparent lg:data-[state=active]:shadow-[inset_2px_0_0_var(--color-primary)]"
            >
              <span>{item.name}</span>
              <span className="ml-auto hidden text-[12px] text-subtle lg:inline">{item.dosageForm}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {withSalts.map(item => {
        const salts = parseSalts(item.salts);
        return (
          <TabsContent key={item.id} value={item.id} className="min-w-0">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
              {/* White specimen tile: the pack photos are shot on white. */}
              <div className="size-36 shrink-0 overflow-hidden rounded-xl border border-border bg-white sm:size-44">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={`${item.name} pack`} className="size-full object-contain p-[10%] mix-blend-multiply" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                <div>
                  <Label>Inspecting</Label>
                  <h2 className="mt-1 text-[34px] leading-[1.08] tracking-[-0.035em] md:text-[48px] md:leading-[1.04] md:tracking-[-0.04em]">{item.name}</h2>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4 sm:grid-cols-4">
                  <div>
                    <dt className="text-[12px] font-medium text-subtle">Form</dt>
                    <dd className="mt-0.5 text-[16px] text-foreground">{item.dosageForm}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-medium text-subtle">Category</dt>
                    <dd className="mt-0.5 text-[16px] text-foreground">{categoryLabel(item.category)}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-medium text-subtle">Active ingredients</dt>
                    <dd className="mt-0.5 text-[16px] tabular-nums text-foreground">{salts.length}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-medium text-subtle">Marketed by</dt>
                    <dd className="mt-0.5 text-[16px] text-foreground">{displayBrand(item.brand)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-background p-5 shadow-[0_24px_64px_-32px_rgba(39,28,94,0.22)] sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display tracking-[-0.02em] text-[20px] font-semibold">Composition</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {isPrescription(item.category) && <RxTag />}
                  <Button variant="outline" size="sm" onClick={() => openItem(item)}>Product details</Button>
                </div>
              </div>
              <CompositionTable salts={salts} productName={item.name} tallBar />
              <p className="mt-5 text-sm text-subtle">{LABEL_ADVICE}</p>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
