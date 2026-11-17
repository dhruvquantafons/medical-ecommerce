"use client";

import { ArrowRight, ChevronRight } from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';
import { usePortfolio } from './PortfolioContext';
import { categoryLabel, isPrescription } from './copy';
import { Badge, RxBadge, Skeleton } from './kit';

const SHOWN = 3;

/**
 * Catalog product card (changeui.md, Problem 13, catalog variant): the pack, category and form,
 * name, and the active ingredients with their amounts. Two layouts share the same content:
 * - "grid": a specimen card that lifts on hover and keyboard focus;
 * - "list": one row per product for scanning ingredients.
 * The whole card is one button that opens the product details (the quick view dialog).
 * The database description is shown only in that dialog: several are promotional or do not match
 * the listed ingredients.
 * TODO(owner): review descriptions in Admin -> Catalog (e.g. Diptor 10 and Diptor 20 describe a
 * statin, but their listed ingredients are levothyroxine and probiotics).
 * No price, stars or review counts: there is no review data with a source.
 */
export function CatalogCard({ item, layout = 'grid' }: { item: CatalogItem; layout?: 'grid' | 'list' }) {
  const { openItem } = usePortfolio();
  const salts = parseSalts(item.salts);
  const rx = isPrescription(item.category);
  const more = salts.length - SHOWN;
  const typeBadge = rx ? <RxBadge /> : <Badge tone="brand">{categoryLabel(item.category)}</Badge>;

  if (layout === 'list') {
    return (
      <button
        type="button"
        onClick={() => openItem(item)}
        aria-label={`${item.name}: view composition`}
        className="group pf-card pf-card-lift grid w-full grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 p-3 text-left sm:grid-cols-[96px_minmax(0,1fr)_minmax(0,1.3fr)_auto] sm:gap-6 sm:p-4"
      >
        <div className="aspect-square overflow-hidden rounded-xl bg-surface">
          {item.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt="" loading="lazy" className="pf-card-media size-full object-contain p-[10%] mix-blend-multiply" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {typeBadge}
            <Badge>{item.dosageForm}</Badge>
          </div>
          <h3 className="mt-2 font-display text-[19px] leading-tight font-semibold tracking-[-0.025em] text-foreground">{item.name}</h3>
          {/* On phones the ingredients follow the name as one line. */}
          {salts.length > 0 && (
            <p className="mt-1 truncate text-[14px] text-muted-foreground sm:hidden">{salts.map(s => s.name).join(', ')}</p>
          )}
        </div>
        {salts.length > 0 ? (
          <dl className="hidden min-w-0 text-[14px] sm:block" aria-label={`Active ingredients in ${item.name}`}>
            {salts.slice(0, SHOWN).map((s, i) => (
              <div key={`${s.name}-${i}`} className="flex items-baseline justify-between gap-4 py-0.5">
                <dt className="min-w-0 truncate text-foreground">{s.name}</dt>
                <dd className="shrink-0 font-mono text-[12px] text-muted-foreground">{s.amount}</dd>
              </div>
            ))}
            {more > 0 && (
              <div className="pt-0.5 text-[12px] text-subtle">
                <dt className="sr-only">More</dt>
                <dd>{more} more {more === 1 ? 'ingredient' : 'ingredients'}</dd>
              </div>
            )}
          </dl>
        ) : (
          <span className="hidden sm:block" />
        )}
        <ChevronRight
          className="size-5 text-subtle transition-[color,transform] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:text-primary"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openItem(item)}
      className="group pf-card pf-card-lift flex h-full w-full flex-col overflow-hidden rounded-[20px] text-left"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={`${item.name} pack`} loading="lazy" className="pf-card-media size-full object-contain p-[10%] mix-blend-multiply" />
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {typeBadge}
          <Badge>{item.dosageForm}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-border px-5 pt-5 pb-5">
        <h3 className="font-display text-[22px] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground">{item.name}</h3>

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
        <div className="mt-auto flex items-center justify-end pt-5">
          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
            Composition
            <ArrowRight className="pf-btn-arrow size-4 transition-transform duration-300 group-hover:translate-x-[3px]" strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}

/** Placeholder with the same footprint as a card, for loading states. */
export function CatalogCardSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'list' }) {
  if (layout === 'list') {
    return (
      <div className="pf-card grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 p-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:p-4">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-56 max-w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className={cn('pf-card flex h-full flex-col overflow-hidden rounded-[20px]')}>
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 border-t border-border p-5">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
