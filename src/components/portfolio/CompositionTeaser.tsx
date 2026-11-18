"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Tabs } from 'radix-ui';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';
import { Section } from './site';
import { ActionButton, Badge, CountUp, FillBar, RxBadge, SectionHeader } from './kit';
import { FormularyChart } from './FormularyChart';
import { formatShare, weightShares } from './CompositionTable';
import { categoryLabel, displayBrand, isPrescription } from './copy';
import { usePortfolio } from './PortfolioContext';

/*
  Home: the Salt Inspector teaser. Two views of the same catalog data:
  1. "By formulation": tabs for each product, with its active ingredients
     (amount per unit and share by weight) counting and filling in.
  2. "Whole catalog": every formulation as one share-by-weight bar (FormularyChart).

  Bioavailability is not shown (owner decision, 2026-11-17): the seeded figures did not match the
  listed ingredients. The catalog_items.bioavailability column is left unchanged.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_TABS = 6;
const shareColor = (i: number) => `var(--share-${(i % 4) + 1})`;

/** "200 mg" -> 200 and "mg". Amounts that are not a plain number and unit stay as text. */
function parseAmount(amount: string): { value: number; decimals: number; unit: string } | null {
  const m = amount.trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Zµ%/ ]+)$/);
  if (!m) return null;
  return { value: Number(m[1]), decimals: m[1].includes('.') ? m[1].split('.')[1].length : 0, unit: m[2].trim() };
}

function useMinWidth(px: number) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [px]);
  return match;
}

export function CompositionTeaser({ items }: { items: CatalogItem[] }) {
  const featured = useMemo(
    () =>
      items
        .map(item => ({ item, salts: parseSalts(item.salts) }))
        .filter(r => r.salts.length > 0)
        .slice(0, MAX_TABS),
    [items],
  );
  const [view, setView] = useState(featured.length > 0 ? 'formulation' : 'catalog');
  const [active, setActive] = useState(featured[0]?.item.id ?? '');
  const wide = useMinWidth(1024);

  const views = [
    ...(featured.length > 0 ? [{ value: 'formulation', label: 'By formulation' }] : []),
    { value: 'catalog', label: 'Whole catalog' },
  ];

  return (
    <Section
      id="composition"
      labelledBy="pf-composition-title"
      curveFrom="tint"
      backdrop={{ washes: [{ at: 'r', color: 'violet', size: 0.6 }, { at: 'bl', color: 'orchid', size: 0.45 }], pattern: 'grid', patternFrom: 'top' }}
    >
      <SectionHeader
        id="pf-composition-title"
        title="Every formulation, ingredient by ingredient"
        lead="Each bar is one product and each segment one active ingredient, sized by its share of the actives by weight. Select a product to see its full composition and CAS numbers."
        actions={
          <ActionButton asChild arrow>
            <Link href="/portfolio/salt-inspector">Open the Salt Inspector</Link>
          </ActionButton>
        }
      />

      <Tabs.Root value={view} onValueChange={setView} className="mt-12">
        {views.length > 1 && (
          <Tabs.List aria-label="Salt Inspector view" className="inline-flex rounded-xl border border-border bg-white p-1 shadow-[var(--pf-shadow-1)]">
            {views.map(v => (
              <Tabs.Trigger
                key={v.value}
                value={v.value}
                className={cn(
                  'relative h-10 rounded-[9px] px-4 text-[15px] font-semibold transition-colors duration-200',
                  view === v.value ? 'text-white' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {view === v.value && (
                  <motion.span layoutId="pf-view-pill" className="absolute inset-0 rounded-[9px] bg-primary" transition={{ duration: 0.35, ease: EASE }} />
                )}
                <span className="relative">{v.label}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        )}

        {featured.length > 0 && (
          <Tabs.Content value="formulation" className="mt-6 focus-visible:outline-none">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              <Tabs.Root
                value={active}
                onValueChange={setActive}
                orientation={wide ? 'vertical' : 'horizontal'}
                className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6"
              >
                <Tabs.List
                  aria-label="Formulations"
                  className="pf-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
                >
                  {featured.map(({ item }) => {
                    const selected = item.id === active;
                    return (
                      <Tabs.Trigger
                        key={item.id}
                        value={item.id}
                        className={cn(
                          'relative shrink-0 rounded-xl border px-4 py-3 text-left transition-colors duration-200 lg:border-transparent',
                          selected ? 'border-transparent' : 'border-border bg-white/60 hover:bg-white lg:bg-transparent',
                        )}
                      >
                        {selected && (
                          <motion.span
                            layoutId="pf-formulation-pill"
                            className="absolute inset-0 rounded-xl border border-[#d3cee2] bg-white shadow-[var(--pf-shadow-2)]"
                            transition={{ duration: 0.4, ease: EASE }}
                          />
                        )}
                        <span className="relative flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className={cn('size-2 shrink-0 rounded-full transition-colors duration-200', selected ? 'bg-primary' : 'bg-[#cfc9df]')}
                          />
                          <span className="min-w-0">
                            <span className={cn('block text-[15px] font-semibold whitespace-nowrap', selected ? 'text-foreground' : 'text-muted-foreground')}>
                              {item.name}
                            </span>
                            <span className="block font-mono text-[12px] whitespace-nowrap text-subtle">
                              {item.dosageForm} · {categoryLabel(item.category)}
                            </span>
                          </span>
                        </span>
                      </Tabs.Trigger>
                    );
                  })}
                </Tabs.List>

                {featured.map(({ item, salts }) => (
                  <Tabs.Content key={item.id} value={item.id} className="min-w-0 focus-visible:outline-none">
                    <motion.div
                      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <FormulationPanel item={item} salts={salts} />
                    </motion.div>
                  </Tabs.Content>
                ))}
              </Tabs.Root>
            </motion.div>
          </Tabs.Content>
        )}

        <Tabs.Content value="catalog" className="mt-6 focus-visible:outline-none">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <FormularyChart items={items} />
          </motion.div>
        </Tabs.Content>
      </Tabs.Root>
    </Section>
  );
}

function FormulationPanel({ item, salts }: { item: CatalogItem; salts: ReturnType<typeof parseSalts> }) {
  const { openItem } = usePortfolio();
  const shares = weightShares(salts);

  return (
    <div className="pf-card pf-card-raised p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[30px]">{item.name}</h3>
          <p className="mt-1 text-[15px] text-muted-foreground">{displayBrand(item.brand)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isPrescription(item.category) ? <RxBadge /> : <Badge tone="brand">{categoryLabel(item.category)}</Badge>}
          <Badge>{item.dosageForm}</Badge>
        </div>
      </div>

      {/* Active ingredients: amount per unit and share by weight. */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4 border-b border-foreground/70 pb-2 font-mono text-[12px] text-subtle">
          <span>Active ingredient</span>
          <span>Per unit</span>
        </div>
        <ul>
          {salts.map((s, i) => {
            const amount = parseAmount(s.amount);
            return (
              <li key={`${s.name}-${i}`} className="border-b border-border py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <span aria-hidden="true" className="mt-[7px] size-2.5 shrink-0 rounded-[3px]" style={{ background: shareColor(i) }} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{s.name}</p>
                      {s.purpose && <p className="mt-0.5 text-[14px] text-muted-foreground">{s.purpose}</p>}
                    </div>
                  </div>
                  <p className="shrink-0 font-mono text-[15px] font-medium text-foreground">
                    {amount ? (
                      <>
                        <CountUp value={amount.value} decimals={amount.decimals} duration={1100} delay={i * 80} /> {amount.unit}
                      </>
                    ) : (
                      s.amount
                    )}
                  </p>
                </div>
                {shares && (
                  <div className="mt-3 flex items-center gap-3 pl-[22px]">
                    <FillBar value={shares[i]} color={shareColor(i)} delay={150 + i * 80} trackClassName="h-1.5 flex-1" />
                    <span className="w-11 text-right font-mono text-[12px] text-muted-foreground">{formatShare(shares[i])}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {shares && <p className="mt-3 text-[12px] leading-5 text-subtle">Bars show each ingredient&apos;s share of the listed actives by weight. Excipients are not included.</p>}
      </div>

      <div className="mt-6">
        <ActionButton variant="secondary" onClick={() => openItem(item)}>
          Full composition and CAS numbers
        </ActionButton>
      </div>
    </div>
  );
}
