"use client";

import Link from 'next/link';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CompositionTable } from './CompositionTable';
import { ActionButton, Badge, RxBadge } from './kit';
import { CONTACT_HREF, LABEL_ADVICE, categoryLabel, displayBrand, isPrescription } from './copy';

/**
 * Catalog product details: the quick view opened from catalog cards, search and the Salt
 * Inspector teaser (changeui.md, Problem 19, kept as a dialog because the catalog keeps
 * its current URL). Removed: "Digital ID", "Verified Salt Formula", bracketed percentages,
 * bioavailability and half-life figures, and the "Google Schema" button.
 * The description is the database text as written. TODO(owner): review it in Admin -> Catalog.
 */
export function ItemDialog({ item, onClose }: { item: CatalogItem | null; onClose: () => void }) {
  const salts = item ? parseSalts(item.salts) : [];
  return (
    <Dialog open={!!item} onOpenChange={open => { if (!open) onClose(); }}>
      {item && (
        <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[24px] border-border shadow-[var(--pf-shadow-3)] sm:max-w-3xl sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={`${item.name} pack`} className="size-full object-contain p-[12%] mix-blend-multiply" />
              )}
            </div>
            <DialogHeader className="gap-3 pr-10 text-left">
              <div className="flex flex-wrap gap-2">
                {isPrescription(item.category) ? <RxBadge /> : <Badge tone="brand">{categoryLabel(item.category)}</Badge>}
                <Badge>{item.dosageForm}</Badge>
              </div>
              <DialogTitle className="font-display text-[36px] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[40px]">{item.name}</DialogTitle>
              <p className="text-[16px] text-muted-foreground">Marketed by {displayBrand(item.brand)}</p>
              <DialogDescription className="mt-1 whitespace-pre-line text-[16px] leading-[1.6] text-muted-foreground">
                {item.description || 'No description yet.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {salts.length > 0 && (
            <div className="mt-2">
              <h3 className="mb-4 font-display text-[20px] font-semibold tracking-[-0.02em]">Composition</h3>
              <CompositionTable salts={salts} productName={item.name} />
              <p className="mt-4 text-sm text-subtle">{LABEL_ADVICE}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            <ActionButton asChild variant="secondary" arrow>
              <Link href={`/portfolio/salt-inspector?item=${encodeURIComponent(item.id)}`} onClick={onClose}>
                Open in Salt Inspector
              </Link>
            </ActionButton>
            <ActionButton asChild variant="ghost">
              <Link href={CONTACT_HREF} onClick={onClose}>Ask about this product</Link>
            </ActionButton>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
