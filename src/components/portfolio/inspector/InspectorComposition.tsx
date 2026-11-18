"use client";

import { Fragment, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown, Copy } from 'lucide-react';
import type { ActiveSalt } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';
import { formatShare, weightShares } from '../CompositionTable';

/*
  Salt Inspector composition panel. Same data and rules as CompositionTable (which the product
  dialog still uses): shares are computed from the listed amounts and shown only when every amount
  is a weight. On top of that, for this page only:
  - Bar or Donut view of the same shares; hovering a segment highlights its table row and shows
    a tooltip, and hovering a row highlights its segment;
  - sortable Ingredient / Share / Per unit columns (Per unit sorts by weight, so only when the
    amounts are comparable weights);
  - a copy button on each CAS number;
  - expandable rows with the ingredient's function text and CAS number.
  Colours follow the ingredient (its order in the data), so sorting never recolours a row.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const shareColor = (i: number) => `var(--share-${(i % 4) + 1})`;

type SortKey = 'name' | 'share' | 'amount';
interface Sort {
  key: SortKey | null;
  dir: 'asc' | 'desc';
}

interface Row extends ActiveSalt {
  index: number;
  share: number | null;
}

export function InspectorComposition({ salts, productName }: { salts: ActiveSalt[]; productName: string }) {
  const shares = weightShares(salts);
  const [view, setView] = useState<'bar' | 'donut'>('bar');
  const [hovered, setHovered] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>({ key: null, dir: 'asc' });
  const [open, setOpen] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const uid = useId();

  const rows: Row[] = salts.map((s, index) => ({ ...s, index, share: shares ? shares[index] : null }));
  const sorted = sort.key ? [...rows].sort(compare(sort)) : rows;

  // Each column cycles: natural order (A-Z, or largest first) -> reversed -> unsorted.
  const toggleSort = (key: SortKey) =>
    setSort(s => {
      const first = key === 'name' ? 'asc' : 'desc';
      if (s.key !== key) return { key, dir: first };
      if (s.dir === first) return { key, dir: first === 'asc' ? 'desc' : 'asc' };
      return { key: null, dir: 'asc' };
    });

  const toggleOpen = (i: number) => setOpen(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));

  const copyCas = async (i: number, cas: string) => {
    try {
      await navigator.clipboard.writeText(cas);
      setCopied(i);
      window.setTimeout(() => setCopied(c => (c === i ? null : c)), 1600);
    } catch {
      // Clipboard blocked (e.g. insecure context): the number stays selectable as text.
    }
  };

  return (
    <div>
      {shares && (
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-muted-foreground">Share of the listed active ingredients by weight. Excipients are not included.</p>
            <div role="group" aria-label="Chart view" className="flex rounded-xl border border-border bg-surface p-1">
              {(['bar', 'donut'] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    'relative h-8 rounded-[9px] px-3.5 text-[14px] font-semibold transition-colors duration-200',
                    view === v ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {view === v && (
                    <motion.span layoutId={`${uid}-view`} className="absolute inset-0 rounded-[9px] bg-white shadow-[var(--pf-shadow-1)]" transition={{ duration: reduce ? 0 : 0.3, ease: EASE }} />
                  )}
                  <span className="relative">{v === 'bar' ? 'Bar' : 'Donut'}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
            >
              {view === 'bar' ? (
                <ShareBarInteractive rows={rows} hovered={hovered} onHover={setHovered} productName={productName} />
              ) : (
                <ShareDonut rows={rows} hovered={hovered} onHover={setHovered} productName={productName} reduce={!!reduce} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="overflow-x-auto border-t border-foreground/70">
        <table className="w-full border-collapse text-left text-[16px]">
          <caption className="sr-only">Composition of {productName}. Column headers with buttons can be sorted.</caption>
          <thead>
            <tr className="border-b border-border font-mono text-[12px] text-subtle">
              <SortHeader label="Ingredient" k="name" sort={sort} onSort={toggleSort} />
              <th scope="col" className="hidden py-2.5 pr-4 font-medium sm:table-cell">CAS number</th>
              {shares && <SortHeader label="Share" k="share" sort={sort} onSort={toggleSort} align="right" className="hidden sm:table-cell" />}
              {shares ? (
                <SortHeader label="Per unit" k="amount" sort={sort} onSort={toggleSort} align="right" />
              ) : (
                <th scope="col" className="py-2.5 text-right font-medium whitespace-nowrap">Per unit</th>
              )}
            </tr>
          </thead>
          <tbody>
              {sorted.map(row => {
                const isOpen = open.includes(row.index);
                const panelId = `${uid}-row-${row.index}`;
                const active = hovered === row.index;
                return (
                  <Fragment key={row.index}>
                    <motion.tr
                      layout={reduce ? false : 'position'}
                      transition={{ duration: 0.35, ease: EASE }}
                      onMouseEnter={() => setHovered(row.index)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(row.index)}
                      onBlur={() => setHovered(null)}
                      className={cn('align-top transition-colors duration-200', !isOpen && 'border-b border-border', active ? 'bg-[#f5f3fc]' : 'bg-transparent')}
                    >
                      <th scope="row" className="py-3 pr-4 pl-2 font-normal">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggleOpen(row.index)}
                          className="group flex w-full gap-3 rounded-md text-left"
                        >
                          {shares && (
                            <span
                              aria-hidden="true"
                              className={cn('mt-[7px] size-2.5 shrink-0 rounded-[3px] transition-transform duration-200', active && 'scale-125')}
                              style={{ background: shareColor(row.index) }}
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="flex items-start gap-1.5">
                              <span className="font-medium text-foreground">{row.name}</span>
                              <ChevronDown
                                aria-hidden="true"
                                className={cn('mt-1 size-4 shrink-0 text-subtle transition-transform duration-300 group-hover:text-foreground', isOpen && 'rotate-180')}
                                strokeWidth={2}
                              />
                            </span>
                            {row.purpose && !isOpen && <span className="mt-0.5 block text-[14px] text-muted-foreground sm:truncate">{row.purpose}</span>}
                            <span className="sr-only">{isOpen ? ', hide details' : ', show details'}</span>
                          </span>
                        </button>
                      </th>
                      <td className="hidden py-3 pr-4 sm:table-cell">
                        {row.casNumber ? (
                          <CasCopy cas={row.casNumber} copied={copied === row.index} onCopy={() => copyCas(row.index, row.casNumber)} />
                        ) : (
                          <span className="font-mono text-[14px] text-muted-foreground" aria-label="Not listed">–</span>
                        )}
                      </td>
                      {shares && <td className="hidden py-3 pr-4 text-right font-mono text-[14px] text-muted-foreground sm:table-cell">{formatShare(row.share!)}</td>}
                      <td className="py-3 pr-2 text-right font-mono text-[14px] font-medium whitespace-nowrap text-foreground">{row.amount}</td>
                    </motion.tr>
                    {isOpen && (
                      <tr className={cn('border-b border-border transition-colors duration-200', active ? 'bg-[#f5f3fc]' : 'bg-transparent')}>
                        <td colSpan={shares ? 4 : 3} className="p-0">
                          <motion.div
                            id={panelId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <dl className={cn('grid gap-4 pr-2 pb-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]', shares ? 'pl-[30px]' : 'pl-2')}>
                              <div>
                                <dt className="text-[12px] font-semibold text-subtle">Function</dt>
                                <dd className="mt-1 text-[15px] leading-[1.55] text-foreground">{row.purpose || 'Not listed.'}</dd>
                              </div>
                              {row.share !== null && (
                                <div className="sm:hidden">
                                  <dt className="text-[12px] font-semibold text-subtle">Share by weight</dt>
                                  <dd className="mt-1 font-mono text-[14px] text-foreground">{formatShare(row.share)}</dd>
                                </div>
                              )}
                              <div>
                                <dt className="text-[12px] font-semibold text-subtle">CAS registry number</dt>
                                <dd className="mt-1">
                                  {row.casNumber ? (
                                    <CasCopy cas={row.casNumber} copied={copied === row.index} onCopy={() => copyCas(row.index, row.casNumber)} />
                                  ) : (
                                    <span className="text-[15px] text-muted-foreground">Not listed.</span>
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
      <p className="sr-only" aria-live="polite">{copied !== null ? 'CAS number copied' : ''}</p>
    </div>
  );
}

/** Sum of the shares before row i: where its segment starts, in percent. */
const cumulative = (rows: Row[], i: number) => rows.slice(0, i).reduce((sum, r) => sum + (r.share ?? 0), 0);

function compare(sort: Sort) {
  const dir = sort.dir === 'asc' ? 1 : -1;
  return (a: Row, b: Row) => {
    if (sort.key === 'name') return a.name.localeCompare(b.name) * dir;
    // Share and per-unit weight order identically: the share is each weight over the total.
    return ((a.share ?? 0) - (b.share ?? 0)) * dir;
  };
}

function SortHeader({ label, k, sort, onSort, align = 'left', className }: { label: string; k: SortKey; sort: Sort; onSort: (k: SortKey) => void; align?: 'left' | 'right'; className?: string }) {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn('py-1.5 font-medium whitespace-nowrap', align === 'right' ? 'pr-2 text-right last:pr-2' : 'pr-4 pl-2', k === 'share' && 'pr-4', className)}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-md px-1.5 transition-colors hover:bg-accent hover:text-foreground',
          align === 'right' ? '-mr-1.5 flex-row-reverse' : '-ml-1.5',
          active && 'text-primary',
        )}
      >
        {label}
        <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
      </button>
    </th>
  );
}

function CasCopy({ cas, copied, onCopy }: { cas: string; copied: boolean; onCopy: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-mono text-[14px] whitespace-nowrap text-muted-foreground select-all">{cas}</span>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy CAS number ${cas}`}
        className={cn(
          'grid size-7 place-items-center rounded-md transition-colors',
          copied ? 'text-success' : 'text-subtle hover:bg-accent hover:text-foreground',
        )}
      >
        {copied ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" /> : <Copy className="size-3.5" strokeWidth={2} aria-hidden="true" />}
      </button>
    </span>
  );
}

interface ChartProps {
  rows: Row[];
  hovered: number | null;
  onHover: (i: number | null) => void;
  productName: string;
}

/** Stacked bar; fills from the left on mount (so again on every product change). */
function ShareBarInteractive({ rows, hovered, onHover, productName }: ChartProps) {
  const segs = rows.map((r, i) => ({ ...r, start: cumulative(rows, i) }));
  const tip = hovered !== null ? segs[hovered] : null;

  return (
    <div className="relative pt-1">
      <div
        role="img"
        aria-label={`${productName}, share by weight: ${rows.map(r => `${r.name} ${formatShare(r.share!)}`).join(', ')}`}
        className="pf-bar-in flex h-6 w-full gap-[2px] overflow-hidden rounded-[6px]"
        onMouseLeave={() => onHover(null)}
      >
        {segs.map(s => (
          <span
            key={s.index}
            onMouseEnter={() => onHover(s.index)}
            className="h-full min-w-[4px] transition-opacity duration-200"
            style={{ width: `${s.share}%`, background: shareColor(s.index), opacity: hovered === null || hovered === s.index ? 1 : 0.35 }}
          />
        ))}
      </div>
      <AnimatePresence>
        {tip && (
          <motion.div
            key={tip.index}
            aria-hidden="true"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full z-10 mb-2 -translate-x-1/2 rounded-lg bg-foreground px-3 py-2 text-white shadow-[var(--pf-shadow-2)]"
            style={{ left: `${Math.min(88, Math.max(12, tip.start + tip.share! / 2))}%` }}
          >
            <p className="text-[13px] font-semibold whitespace-nowrap">{tip.name}</p>
            <p className="mt-0.5 font-mono text-[12px] whitespace-nowrap text-white/80">
              {formatShare(tip.share!)} · {tip.amount}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Ring chart of the same shares. Segments draw in clockwise from the top. */
function ShareDonut({ rows, hovered, onHover, productName, reduce }: ChartProps & { reduce: boolean }) {
  const R = 15.9155; // circumference 100, so dash lengths are percentages
  const gap = rows.length > 1 ? 0.8 : 0;
  const segs = rows.map((r, i) => ({ ...r, len: Math.max(r.share! - gap, 0.4), offset: cumulative(rows, i) }));
  const focus = hovered !== null ? rows[hovered] : null;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <div className="relative size-52 shrink-0" onMouseLeave={() => onHover(null)}>
        <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={`${productName}, share by weight: ${rows.map(r => `${r.name} ${formatShare(r.share!)}`).join(', ')}`}>
          <circle cx="21" cy="21" r={R} fill="none" stroke="#ebe8f3" strokeWidth="5" />
          {segs.map((s, i) => (
            <motion.circle
              key={s.index}
              cx="21"
              cy="21"
              r={R}
              fill="none"
              stroke={shareColor(s.index)}
              strokeLinecap="butt"
              strokeDashoffset={-s.offset}
              onMouseEnter={() => onHover(s.index)}
              initial={{ strokeDasharray: `0 100`, strokeWidth: 5 }}
              animate={{
                strokeDasharray: `${s.len} ${100 - s.len}`,
                strokeWidth: hovered === s.index ? 6.5 : 5,
                opacity: hovered === null || hovered === s.index ? 1 : 0.35,
              }}
              transition={{
                strokeDasharray: { duration: reduce ? 0 : 0.8, delay: reduce ? 0 : i * 0.08, ease: EASE },
                strokeWidth: { duration: 0.2 },
                opacity: { duration: 0.2 },
              }}
              className="cursor-default"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center" aria-hidden="true">
          {focus ? (
            <div className="max-w-[60%]">
              <p className="font-display text-[30px] leading-none font-medium tracking-[-0.03em]">{formatShare(focus.share!)}</p>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-tight text-muted-foreground">{focus.name}</p>
            </div>
          ) : (
            <div>
              <p className="font-display text-[30px] leading-none font-medium tracking-[-0.03em]">{rows.length}</p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">active ingredients</p>
            </div>
          )}
        </div>
      </div>
      <ul className="grid w-full gap-1.5 sm:w-auto sm:min-w-[260px]" aria-hidden="true">
        {rows.map(r => (
          <li
            key={r.index}
            onMouseEnter={() => onHover(r.index)}
            onMouseLeave={() => onHover(null)}
            className={cn('flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[14px] transition-colors', hovered === r.index && 'bg-[#f5f3fc]')}
          >
            <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: shareColor(r.index) }} />
            <span className="min-w-0 flex-1 truncate text-foreground">{r.name}</span>
            <span className="font-mono text-[12px] text-muted-foreground">{formatShare(r.share!)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
