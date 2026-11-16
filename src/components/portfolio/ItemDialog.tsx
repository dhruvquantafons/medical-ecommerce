"use client";

import Link from 'next/link';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CompositionTable } from './CompositionTable';
import { CONTACT_HREF, LABEL_ADVICE, categoryLabel, displayBrand, isPrescription } from './copy';

/**
 * Catalogue product details (changeui.md, Problem 19, kept as a dialog because the catalogue keeps
 * its current URL). Removed: "Digital ID", "Verified Salt Formula", bracketed percentages,
 * bioavailability and half-life figures, and the "Google Schema" button.
 */
export function ItemDialog({ item, onClose }: { item: CatalogItem | null; onClose: () => void }) {
  const salts = item ? parseSalts(item.salts) : [];
  return (
    <Dialog open={!!item} onOpenChange={open => { if (!open) onClose(); }}>
      {item && (
        <DialogContent className="sm:max-w-3xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-surface">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={`${item.name} pack`} className="size-full object-contain p-[12%] mix-blend-multiply" />
              )}
            </div>
            <DialogHeader className="gap-2 pr-10 text-left">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {categoryLabel(item.category)} · {item.dosageForm}
              </p>
              <DialogTitle className="font-display text-[32px] leading-tight font-medium tracking-[-0.02em]">{item.name}</DialogTitle>
              <p className="text-[15px] text-muted-foreground">By {displayBrand(item.brand)}</p>
              {isPrescription(item.category) && <Badge>Prescription required</Badge>}
              <DialogDescription className="mt-2 whitespace-pre-line text-base text-foreground">
                {item.description || 'No description yet.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {salts.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-medium">Composition</h3>
              <CompositionTable salts={salts} productName={item.name} />
              <p className="mt-3 text-sm text-subtle">{LABEL_ADVICE}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-border pt-4">
            <Button asChild variant="outline">
              <Link href={CONTACT_HREF} onClick={onClose}>Ask about this product</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/portfolio/salt-inspector?item=${encodeURIComponent(item.id)}`} onClick={onClose}>
                Open in Salt Inspector
              </Link>
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
