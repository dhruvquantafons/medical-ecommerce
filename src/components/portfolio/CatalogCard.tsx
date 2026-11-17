"use client";

import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Label, RxTag } from './site';
import { usePortfolio } from './PortfolioContext';
import { categoryLabel, isPrescription } from './copy';

const SHOWN = 3;

/**
 * Catalog product card (changeui.md, Problem 13, catalog variant): a specimen card with the pack,
 * category and form, name, and the active ingredients with their amounts. The database description
 * is shown only in the product dialog: several are promotional or do not match the listed ingredients.
 * TODO(owner): review descriptions in Admin -> Catalog (e.g. Diptor 10 and Diptor 20 describe a
 * statin, but their listed ingredients are levothyroxine and probiotics).
 * The whole card is one control that opens the product details. No price, stars or review counts.
 */
export function CatalogCard({ item }: { item: CatalogItem }) {
  const { openItem } = usePortfolio();
  const salts = parseSalts(item.salts);
  const rx = isPrescription(item.category);
  const more = salts.length - SHOWN;

  return (
    <button
      type="button"
      onClick={() => openItem(item)}
      className="group flex h-full w-full flex-col rounded-2xl border border-border bg-background p-2 text-left transition-[border-color,box-shadow] duration-200 hover:border-foreground/25 hover:shadow-[0_12px_32px_-12px_rgba(23,21,31,0.18)]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-surface">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={`${item.name} pack`} loading="lazy" className="size-full object-contain p-[10%] mix-blend-multiply" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label>{categoryLabel(item.category)}</Label>
          <Label>{item.dosageForm}</Label>
        </div>
        <h3 className="mt-2 font-display text-[22px] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground">{item.name}</h3>

        {salts.length > 0 && (
          <dl className="mt-4 border-t border-foreground/70 text-[14px]" aria-label={`Active ingredients in ${item.name}`}>
            {salts.slice(0, SHOWN).map((s, i) => (
              <div key={`${s.name}-${i}`} className="flex items-baseline justify-between gap-4 border-b border-border py-2">
                <dt className="min-w-0 truncate text-foreground">{s.name}</dt>
                <dd className="shrink-0 font-mono text-[12px] text-muted-foreground">{s.amount}</dd>
              </div>
            ))}
            {more > 0 && (
              <div className="py-2 text-[12px] text-subtle">
                <dt className="sr-only">More</dt>
                <dd>{more} more {more === 1 ? 'ingredient' : 'ingredients'}</dd>
              </div>
            )}
          </dl>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {rx ? <RxTag /> : <span />}
          <span className="text-[14px] font-medium text-primary underline-offset-4 group-hover:underline">Composition</span>
        </div>
      </div>
    </button>
  );
}
