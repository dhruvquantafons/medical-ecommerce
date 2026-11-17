import type { ActiveSalt } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';

/**
 * The composition panel used wherever ingredients are listed: a share-by-weight bar, then one row
 * per ingredient with its colour key, role, CAS number, share and amount per unit.
 *
 * The share is computed here from the listed amounts (mg, mcg, g) and covers the active ingredients
 * only. It is shown only when every amount is a weight, so nothing is guessed. The bracketed
 * percentages stored in the data are not used: they do not follow from the amounts.
 * Roles are the data's own wording. TODO(owner): confirm each ingredient's role.
 */
export interface CompositionRow {
  name: string;
  amount: string;
  purpose?: string;
  casNumber?: string;
}

const TO_MG: Record<string, number> = { mg: 1, mcg: 0.001, 'µg': 0.001, g: 1000 };

/** Share of each ingredient by weight, in percent, or null when any amount is not a weight. */
export function weightShares(rows: CompositionRow[]): number[] | null {
  if (rows.length < 2) return null;
  // An oil or extract can list its own constituents as further rows (e.g. fish oil, EPA, DHA);
  // adding those up would count the same weight twice, so no share is shown.
  if (rows.some(r => /\b(oil|extract)\b/i.test(r.name))) return null;
  const mg: number[] = [];
  for (const r of rows) {
    const m = r.amount.trim().match(/^([\d.,]+)\s*(mg|mcg|µg|g)\b/i);
    if (!m) return null;
    const value = Number(m[1].replace(/,/g, ''));
    if (!Number.isFinite(value) || value <= 0) return null;
    mg.push(value * TO_MG[m[2].toLowerCase()]);
  }
  const total = mg.reduce((a, b) => a + b, 0);
  return mg.map(v => (v / total) * 100);
}

export function formatShare(pct: number): string {
  if (pct < 1) return '<1%';
  if (pct > 99 && pct < 100) return '>99%';
  return `${Math.round(pct)}%`;
}

const shareColor = (i: number) => `var(--share-${(i % 4) + 1})`;

function Key({ index }: { index: number }) {
  return <span aria-hidden="true" className="mt-[7px] size-2.5 shrink-0 rounded-[2px]" style={{ background: shareColor(index) }} />;
}

/** One stacked bar: each segment is one ingredient's share by weight. */
export function ShareBar({ rows, shares, className, tall = false }: { rows: CompositionRow[]; shares: number[]; className?: string; tall?: boolean }) {
  return (
    <div className={className}>
      <div
        role="img"
        aria-label={`Share by weight: ${rows.map((r, i) => `${r.name} ${formatShare(shares[i])}`).join(', ')}`}
        className={cn('pf-bar-in flex w-full gap-[2px] overflow-hidden rounded-[4px]', tall ? 'h-4' : 'h-2.5')}
      >
        {shares.map((s, i) => (
          <span key={i} className="h-full min-w-[3px]" style={{ width: `${s}%`, background: shareColor(i) }} />
        ))}
      </div>
      <p className="mt-2 text-[12px] text-subtle">Share of the listed active ingredients by weight. Excipients are not included.</p>
    </div>
  );
}

interface CompositionTableProps {
  salts: (ActiveSalt | CompositionRow)[];
  productName: string;
  /** Show the CAS registry number. */
  showCas?: boolean;
  /** Show each ingredient's role under its name. */
  showRole?: boolean;
  /** Show the share-by-weight bar and column when every amount is a weight. */
  showShare?: boolean;
  tallBar?: boolean;
  className?: string;
}

export function CompositionTable({ salts, productName, showCas = true, showRole = true, showShare = true, tallBar = false, className }: CompositionTableProps) {
  const shares = showShare ? weightShares(salts) : null;
  return (
    <div className={className}>
      {shares && <ShareBar rows={salts} shares={shares} tall={tallBar} className="mb-6" />}
      <div className="overflow-x-auto border-t border-foreground/70">
        <table className="w-full border-collapse text-left text-[16px]">
          <caption className="sr-only">Composition of {productName}</caption>
          <thead>
            <tr className="border-b border-border font-mono text-[12px] text-subtle">
              <th scope="col" className="py-2 pr-4 font-medium">Ingredient</th>
              {showCas && <th scope="col" className="hidden py-2 pr-4 font-medium sm:table-cell">CAS number</th>}
              {shares && <th scope="col" className="py-2 pr-4 text-right font-medium">Share</th>}
              <th scope="col" className="py-2 text-right font-medium whitespace-nowrap">Per unit</th>
            </tr>
          </thead>
          <tbody>
            {salts.map((salt, i) => (
              <tr key={`${salt.name}-${i}`} className="border-b border-border align-top">
                <th scope="row" className="py-3 pr-4 font-normal">
                  <span className="flex gap-3">
                    {shares && <Key index={i} />}
                    <span className="min-w-0">
                      <span className="block font-medium text-foreground">{salt.name}</span>
                      {showRole && salt.purpose && <span className="mt-0.5 block text-[14px] text-muted-foreground">{salt.purpose}</span>}
                      {showCas && salt.casNumber && (
                        <span className="mt-0.5 block font-mono text-[12px] text-subtle sm:hidden">CAS {salt.casNumber}</span>
                      )}
                    </span>
                  </span>
                </th>
                {showCas && (
                  <td className="hidden py-3 pr-4 font-mono text-[14px] whitespace-nowrap text-muted-foreground sm:table-cell">
                    {salt.casNumber || <span aria-label="Not listed">–</span>}
                  </td>
                )}
                {shares && <td className="py-3 pr-4 text-right font-mono text-[14px] text-muted-foreground">{formatShare(shares[i])}</td>}
                <td className="py-3 text-right font-mono text-[14px] font-medium whitespace-nowrap text-foreground">{salt.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Splits a store product's composition line, e.g. "Fish oil 1000 mg, EPA 180 mg, DHA 120 mg",
 * into rows. Returns [] unless every part has a readable amount, so nothing is guessed.
 */
export function parseCompositionLine(line: string): CompositionRow[] {
  const parts = line.split(/,\s+/).map(p => p.trim()).filter(Boolean);
  const rows: CompositionRow[] = [];
  for (const part of parts) {
    const m = part.match(/^(.+?)\s+(\d[\d,.]*\s*(?:mg|mcg|µg|g|iu|ml|billion|million)\b.*)$/i);
    if (!m) return [];
    rows.push({ name: m[1], amount: m[2] });
  }
  return rows;
}
