"use client";

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Tabs, ToggleGroup } from 'radix-ui';
import { Search, X } from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';
import { usePortfolio } from './PortfolioContext';
import { LABEL_ADVICE, categoryLabel, displayBrand, isPrescription } from './copy';
import { ActionButton, Card, Skeleton } from './kit';
import { InspectorComposition } from './inspector/InspectorComposition';

/*
  "What's inside" explorer (changeui.md, Problem 14). A product index on the left (a scrolling strip
  on small screens), and the selected product with its full composition panel on the right.
  Removed: the 3D molecule, bioavailability and half-life bars, bracketed percentages, the joined
  formula string and the JSON-LD view.
  Not added: plain-language explanations per ingredient, because the data has none and new
  pharmacological claims must not be written.

  2026-11-17 polish: search and form chips filter the index only (the selected product stays shown);
  the form chips come from the forms in the data. Arrow keys move through the index (Radix Tabs,
  vertical on desktop, horizontal on phones). Switching products cross-fades the panel; the pack
  photo shows a placeholder until it has loaded. Composition panel: see inspector/InspectorComposition.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const ALL = 'all';

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
  const wide = useWide();
  const reduce = useReducedMotion();
  const withSalts = useMemo(() => items.filter(i => parseSalts(i.salts).length > 0), [items]);
  const [value, setValue] = useState<string>(
    withSalts.some(i => i.id === initialId) ? initialId! : withSalts[0]?.id ?? '',
  );
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(ALL);

  const forms = useMemo(() => Array.from(new Set(withSalts.map(i => i.dosageForm))).sort(), [withSalts]);
  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withSalts.filter(item => {
      if (form !== ALL && item.dosageForm !== form) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || parseSalts(item.salts).some(s => s.name.toLowerCase().includes(q));
    });
  }, [withSalts, query, form]);

  if (withSalts.length === 0) {
    return (
      <Card className="rounded-[24px] px-6 py-16 text-center">
        <h2 className="text-[24px]">No products to inspect yet</h2>
        <p className="mt-2 text-muted-foreground">Products appear here once their composition is added to the catalog.</p>
      </Card>
    );
  }

  const selected = withSalts.find(i => i.id === value) ?? withSalts[0];
  const filtering = query.trim() !== '' || form !== ALL;

  return (
    <Tabs.Root
      value={selected.id}
      onValueChange={setValue}
      orientation={wide ? 'vertical' : 'horizontal'}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-8"
    >
      {/* Index: sticky on desktop, a horizontal strip on phones. */}
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <Card className="rounded-[20px] p-3 sm:p-4">
          <div className="relative">
            <label htmlFor="pf-inspector-search" className="sr-only">Search formulations</label>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
            <input
              id="pf-inspector-search"
              type="search"
              placeholder="Product or ingredient"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-10 w-full rounded-[10px] border border-input bg-white pr-9 pl-9 text-[15px] transition-[border-color,box-shadow] duration-200 placeholder:text-subtle hover:border-foreground/60 focus:border-primary focus:shadow-[0_0_0_4px_rgba(61,46,134,0.16)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {forms.length > 1 && (
            <ToggleGroup.Root
              type="single"
              value={form}
              onValueChange={v => setForm(v || ALL)}
              aria-label="Filter by form"
              className="pf-no-scrollbar relative mt-3 flex gap-1.5 overflow-x-auto lg:flex-wrap lg:overflow-visible"
            >
              {[ALL, ...forms].map(f => (
                <ToggleGroup.Item
                  key={f}
                  value={f}
                  className={cn(
                    'relative h-8 shrink-0 rounded-full border px-3 text-[13px] font-semibold transition-colors duration-200',
                    form === f ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:border-[#c9c3dc] hover:text-foreground',
                  )}
                >
                  {form === f && (
                    <motion.span layoutId="pf-inspector-form" className="absolute inset-0 rounded-full bg-primary" transition={{ duration: reduce ? 0 : 0.3, ease: EASE }} />
                  )}
                  <span className="relative">{f === ALL ? 'All forms' : f}</span>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          )}

          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-foreground/70 pt-3 pb-1">
            <p id="pf-inspector-list" className="text-[12px] font-semibold text-subtle" aria-live="polite">
              {filtering ? `${listed.length} of ${withSalts.length} formulations` : `${withSalts.length} formulations`}
            </p>
            {filtering && (
              <button
                type="button"
                onClick={() => { setQuery(''); setForm(ALL); }}
                className="rounded-sm text-[12px] font-semibold text-primary underline-offset-4 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {listed.length === 0 ? (
            <p className="px-1 py-6 text-center text-[14px] text-muted-foreground">No formulations match. Try an ingredient name.</p>
          ) : (
            <Tabs.List
              aria-labelledby="pf-inspector-list"
              className="pf-no-scrollbar relative -mx-3 mt-1 flex gap-1.5 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 lg:mx-0 lg:max-h-[calc(100svh-22rem)] lg:flex-col lg:gap-0.5 lg:overflow-x-visible lg:overflow-y-auto lg:px-0"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {listed.map(item => {
                  const active = item.id === selected.id;
                  return (
                    <Tabs.Trigger key={item.id} value={item.id} asChild>
                      <motion.button
                        layout={reduce ? false : 'position'}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                        className={cn(
                          'relative flex h-10 shrink-0 items-center gap-3 rounded-[10px] border px-3 text-left text-[15px] transition-colors duration-200 lg:w-full lg:border-transparent',
                          active ? 'border-transparent font-semibold text-primary' : 'border-border text-muted-foreground hover:bg-surface hover:text-foreground',
                        )}
                      >
                        {active && (
                          <motion.span layoutId="pf-inspector-active" className="absolute inset-0 rounded-[10px] bg-[#efebfd]" transition={{ duration: reduce ? 0 : 0.35, ease: EASE }} />
                        )}
                        <span className="relative whitespace-nowrap">{item.name}</span>
                        <span className={cn('relative ml-auto hidden font-mono text-[11px] lg:inline', active ? 'text-primary/80' : 'text-subtle')}>{item.dosageForm}</span>
                      </motion.button>
                    </Tabs.Trigger>
                  );
                })}
              </AnimatePresence>
            </Tabs.List>
          )}
          <p className="mt-3 hidden text-[12px] leading-5 text-subtle lg:block">Use the arrow keys to move through the list.</p>
        </Card>
      </aside>

      {/* Only the selected product's panel is mounted, so switching cross-fades a fresh panel in. */}
      <Tabs.Content value={selected.id} forceMount className="min-w-0 focus-visible:outline-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
            transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
          >
            <ProductPanel item={selected} />
          </motion.div>
        </AnimatePresence>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function ProductPanel({ item }: { item: CatalogItem }) {
  const { openItem } = usePortfolio();
  const salts = parseSalts(item.salts);
  const rx = isPrescription(item.category);
  const [loaded, setLoaded] = useState(false);

  const meta = [
    { label: 'Form', value: item.dosageForm },
    { label: 'Category', value: categoryLabel(item.category) },
    { label: 'Active ingredients', value: String(salts.length) },
    { label: 'Marketed by', value: displayBrand(item.brand) },
  ];

  return (
    <Card elevation={2} className="overflow-hidden rounded-[24px]">
      {/* Phones: photo and name side by side, the facts in a full-width row below. */}
      <header className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-5 gap-y-4 p-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-x-7 sm:gap-y-0 sm:p-8">
        {/* White specimen tile (the pack photos are shot on white); the photo eases in on hover. */}
        <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--pf-shadow-1)] sm:row-span-2">
          {item.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={el => { if (el?.complete) setLoaded(true); }}
              src={item.imageUrl}
              alt={`${item.name} pack`}
              onLoad={() => setLoaded(true)}
              className={cn(
                'size-full object-contain p-[10%] mix-blend-multiply transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.08]',
                loaded ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}
          {item.imageUrl && !loaded && <Skeleton className="absolute inset-3 rounded-xl" />}
        </div>

        <div className="min-w-0 sm:self-end">
          <p className="text-[13px] font-semibold text-subtle">Inspecting</p>
          <h2 className="mt-1 text-[30px] leading-[1.05] tracking-[-0.035em] sm:text-[44px] sm:tracking-[-0.04em]">{item.name}</h2>
        </div>
        <dl className="col-span-2 flex flex-wrap gap-2 sm:col-span-1 sm:col-start-2 sm:mt-4 sm:self-start">
          {meta.map(m => {
            // The category chip carries the Rx mark for prescription products.
            const rxChip = rx && m.label === 'Category';
            return (
              <div
                key={m.label}
                className={cn(
                  'flex min-h-8 items-center gap-2 rounded-full border px-3 py-1 text-[13px]',
                  rxChip ? 'border-transparent bg-primary text-white' : 'border-border bg-surface',
                )}
              >
                <dt className={rxChip ? 'text-white/75' : 'text-subtle'}>{m.label}</dt>
                <dd className={cn('font-semibold', rxChip ? 'text-white' : 'text-foreground')}>
                  {rxChip && <span className="mr-1.5 font-mono text-[11px] font-medium" aria-hidden="true">Rx</span>}
                  {m.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </header>

      <section aria-labelledby={`pf-comp-${item.id}`} className="border-t border-border px-5 pt-6 pb-6 sm:px-8 sm:pt-8">
        <h3 id={`pf-comp-${item.id}`} className="mb-5 font-display text-[20px] font-semibold tracking-[-0.02em]">Composition</h3>
        <InspectorComposition salts={salts} productName={item.name} />
      </section>

      <footer className="flex flex-col gap-4 border-t border-border bg-[#faf9fd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="max-w-[60ch] text-[14px] leading-[1.55] text-subtle">{LABEL_ADVICE}</p>
        <ActionButton variant="secondary" size="sm" className="h-10 shrink-0" arrow onClick={() => openItem(item)}>
          Product details
        </ActionButton>
      </footer>
    </Card>
  );
}
