"use client";

import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Badge } from './ui/badge';
import { usePortfolio } from './PortfolioContext';
import { categoryLabel, isPrescription } from './copy';

/**
 * Catalogue product card (changeui.md, Problem 13, catalogue variant): square image on the surface
 * colour with 12% padding, category, name, two-line description, up to three composition chips,
 * a "Prescription required" badge where it applies. No price, cart button, stars or review counts.
 * The whole card is one control that opens the product details.
 */
export function CatalogCard({ item }: { item: CatalogItem }) {
  const { openItem } = usePortfolio();
  const salts = parseSalts(item.salts);
  const rx = isPrescription(item.category);

  return (
    <button
      type="button"
      onClick={() => openItem(item)}
      className="group relative flex h-full w-full flex-col rounded-lg text-left"
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-border bg-surface transition-colors group-hover:border-foreground/40">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={`${item.name} pack`} loading="lazy" className="size-full object-contain p-[12%] mix-blend-multiply" />
        )}
      </div>
      <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {categoryLabel(item.category)} · {item.dosageForm}
      </p>
      <h3 className="mt-1 text-lg font-medium text-foreground group-hover:underline group-hover:underline-offset-4">{item.name}</h3>
      {item.description && <p className="mt-1 line-clamp-2 text-[15px] text-muted-foreground">{item.description}</p>}
      {salts.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Main ingredients">
          {salts.slice(0, 3).map((s, i) => (
            <li key={`${s.name}-${i}`} className="max-w-full">
              <Badge variant="mono" className="block max-w-full truncate">{s.name}</Badge>
            </li>
          ))}
        </ul>
      )}
      {rx && <Badge className="mt-3">Prescription required</Badge>}
    </button>
  );
}
