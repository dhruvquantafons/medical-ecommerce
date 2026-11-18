"use client";

import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';
import { usePortfolio } from './PortfolioContext';
import { formatShare, weightShares } from './CompositionTable';

/**
 * Every catalog formulation as one 100% bar: each segment is one active ingredient, sized by its share
 * of the listed actives by weight. Computed from the published amounts only; products whose amounts
 * are not all weights (e.g. CFU) are named underneath instead of being drawn.
 * Selecting a product name opens its details.
 */
const shareColor = (i: number) => `var(--share-${(i % 4) + 1})`;
const labelColor = (i: number) => ((i % 4) < 2 ? 'text-white' : 'text-foreground');

/**
 * Whether a segment's name and share fit inside it. Estimated against a 640px bar (the narrowest
 * desktop width) at about 6.6px per character, plus padding. Segments that do not fit are named in
 * the key under the bar instead, so no ingredient is left unnamed or cut off.
 */
const fitsInside = (name: string, share: number) => share * 6.4 > (name.length + 5) * 6.6 + 24;

export function FormularyChart({ items }: { items: CatalogItem[] }) {
  const { openItem } = usePortfolio();
  const rows = items
    .map(item => {
      const salts = parseSalts(item.salts);
      return { item, salts, shares: weightShares(salts) };
    })
    .filter(r => r.salts.length > 0);
  const drawn = rows.filter(r => r.shares);
  const skipped = rows.filter(r => !r.shares);

  if (drawn.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-[0_24px_64px_-32px_rgba(39,28,94,0.22)] sm:p-8">
      <div className="hidden grid-cols-[180px_minmax(0,1fr)_88px] gap-6 border-b border-foreground/70 pb-3 font-mono text-[12px] text-subtle md:grid">
        <span>Formulation</span>
        <span>Active ingredients, share by weight</span>
        <span className="text-right">Actives</span>
      </div>
      <ul>
        {drawn.map(({ item, salts, shares }, rowIndex) => (
          <li key={item.id} className="grid grid-cols-1 gap-2 border-b border-border py-4 md:grid-cols-[180px_minmax(0,1fr)_88px] md:items-center md:gap-6">
            <div className="flex items-baseline justify-between gap-3 md:block">
              <button
                type="button"
                onClick={() => openItem(item)}
                className="rounded-sm text-left font-display text-[16px] font-semibold tracking-[-0.02em] text-foreground underline-offset-4 hover:underline"
              >
                {item.name}
              </button>
              <p className="font-mono text-[12px] text-subtle md:mt-0.5">{item.dosageForm}</p>
            </div>
            <div className="min-w-0">
              <div
                role="img"
                aria-label={`${item.name}: ${salts.map((s, i) => `${s.name} ${s.amount}, ${formatShare(shares![i])}`).join('; ')}`}
                className="pf-bar-in flex h-10 w-full gap-[2px] overflow-hidden rounded-[6px]"
                style={{ animationDelay: `${150 + Math.min(rowIndex, 6) * 50}ms` }}
              >
                {salts.map((s, i) => (
                  <span
                    key={`${s.name}-${i}`}
                    title={`${s.name}: ${s.amount} (${formatShare(shares![i])})`}
                    className={cn('flex h-full min-w-[3px] items-center overflow-hidden px-3 text-[12px] leading-none font-medium whitespace-nowrap', labelColor(i))}
                    style={{ width: `${shares![i]}%`, background: shareColor(i) }}
                  >
                    {fitsInside(s.name, shares![i]) && (
                      <span className="truncate">
                        {s.name} <span className="font-mono opacity-80">{formatShare(shares![i])}</span>
                      </span>
                    )}
                  </span>
                ))}
              </div>
              {salts.some((s, i) => !fitsInside(s.name, shares![i])) && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground" aria-hidden="true">
                  {salts.map((s, i) =>
                    fitsInside(s.name, shares![i]) ? null : (
                      <li key={`${s.name}-${i}`} className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-[2px]" style={{ background: shareColor(i) }} />
                        {s.name} <span className="font-mono">{formatShare(shares![i])}</span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
            <p className="hidden text-right font-mono text-[14px] text-muted-foreground md:block">{salts.length}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] leading-5 text-subtle">
        Share of the listed active ingredients by weight, from the amounts per unit. Excipients are not included.
        {skipped.length > 0 && (
          <> Not drawn, because their amounts are not all weights: {skipped.map(r => r.item.name).join(', ')}.</>
        )}
      </p>
    </div>
  );
}
