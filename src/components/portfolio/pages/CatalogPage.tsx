"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ToggleGroup } from 'radix-ui';
import { LayoutGrid, List, PackageSearch, Search, X } from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Container } from '../site';
import { CatalogCard } from '../CatalogCard';
import { usePortfolio } from '../PortfolioContext';
import { isPrescription } from '../copy';
import { ActionButton, Backdrop, Card, CountUp, SectionHeader } from '../kit';

/*
  Catalogue index (changeui.md, Problem 18, part B), kept at its current URL.
  Filters are mirrored in the query string (?q=, ?type=rx|otc, ?form=) so a view can be shared;
  ?item=<id> opens that product's details.
  Removed: the count cards, the card around the search box, "Certified" ticks, star ratings,
  review counts, "Bio:" figures and coloured top borders.

  2026-11-17 restyle: the filter logic, URL sync and ?item= handling below are unchanged. Added
  view-only controls: a sticky toolbar, removable chips for the active filters (each sets the same
  state as its control), a grid/list view toggle, and "Show more" when there are more than
  PAGE_SIZE results. None of them change which products match.
*/

type TypeFilter = 'all' | 'rx' | 'otc';
type Layout = 'grid' | 'list';
const ALL_FORMS = 'all';
const PAGE_SIZE = 12;
const EASE = [0.16, 1, 0.3, 1] as const;
const TYPE_LABELS: Record<TypeFilter, string> = { all: 'All', rx: 'Prescription', otc: 'Over the counter' };

export interface CatalogFilters {
  q?: string;
  type?: string;
  form?: string;
  item?: string;
}

export function CatalogPage({ items, initial }: { items: CatalogItem[]; initial: CatalogFilters }) {
  const { openItem } = usePortfolio();
  const [query, setQuery] = useState(initial.q ?? '');
  const [type, setType] = useState<TypeFilter>(initial.type === 'rx' || initial.type === 'otc' ? initial.type : 'all');
  const [form, setForm] = useState(initial.form ?? ALL_FORMS);
  const [layout, setLayout] = useState<Layout>('grid');

  const forms = useMemo(() => Array.from(new Set(items.map(i => i.dosageForm))).sort(), [items]);
  const counts = useMemo(() => {
    const rx = items.filter(i => isPrescription(i.category)).length;
    return { all: items.length, rx, otc: items.length - rx };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(item => {
      const rx = isPrescription(item.category);
      if (type === 'rx' && !rx) return false;
      if (type === 'otc' && rx) return false;
      if (form !== ALL_FORMS && item.dosageForm !== form) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || parseSalts(item.salts).some(s => s.name.toLowerCase().includes(q));
    });
  }, [items, query, type, form]);

  // Keep the URL in step with the filters without a navigation.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (type !== 'all') params.set('type', type);
    if (form !== ALL_FORMS) params.set('form', form);
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [query, type, form]);

  // Open a product passed as ?item= (e.g. from a shared link).
  useEffect(() => {
    const target = initial.item && items.find(i => i.id === initial.item);
    if (target) openItem(target);
  }, [initial.item, items, openItem]);

  const clear = () => { setQuery(''); setType('all'); setForm(ALL_FORMS); };

  // "Show more": how many results are shown, reset whenever the filters change.
  const filterKey = `${query}|${type}|${form}`;
  const [shown, setShown] = useState({ key: filterKey, limit: PAGE_SIZE });
  const limit = shown.key === filterKey ? shown.limit : PAGE_SIZE;
  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  // The toolbar gets a shadow once it is stuck under the header.
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chips = [
    ...(query.trim() ? [{ key: 'q', label: `“${query.trim()}”`, remove: () => setQuery('') }] : []),
    ...(type !== 'all' ? [{ key: 'type', label: TYPE_LABELS[type], remove: () => setType('all') }] : []),
    ...(form !== ALL_FORMS ? [{ key: 'form', label: form, remove: () => setForm(ALL_FORMS) }] : []),
  ];

  return (
    <>
      <section aria-labelledby="pf-page-title" className="relative isolate overflow-hidden bg-tint">
        <Backdrop
          washes={[{ at: 'tr', color: 'violet', size: 0.6 }, { at: 'l', color: 'orchid', size: 0.4 }]}
          pattern="dots"
          patternFrom="tr"
          motif={['c']}
          motifOpacity={0.55}
        />
        <Container className="pt-16 pb-12 md:pt-24 md:pb-16">
          <SectionHeader
            as="h1"
            size="display"
            id="pf-page-title"
            title="Product catalog"
            lead="Every formulation we make, prescription and over the counter, with the active ingredients and amount per unit of each. Select a product for its full composition."
            className="pf-rise"
            actions={
              <p className="rounded-2xl border border-border bg-white px-5 py-4 shadow-[var(--pf-shadow-1)]">
                <span className="block text-[13px] text-muted-foreground">Digital catalog</span>
                <span className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-display text-[40px] leading-none font-medium tracking-[-0.035em] text-foreground">
                    <CountUp value={items.length} duration={1100} />
                  </span>
                  <span className="text-[16px] text-foreground">formulations</span>
                </span>
              </p>
            }
          />
        </Container>
      </section>

      <div ref={sentinel} aria-hidden="true" />

      {/* Sticky search and filter bar. */}
      <div
        className={cn(
          'sticky top-14 z-30 border-y border-border bg-white transition-shadow duration-300 md:top-16',
          stuck && 'shadow-[0_10px_24px_-18px_rgba(39,28,94,0.35)]',
        )}
      >
        {/* Phones: search and form, then type. (Grid and list look alike at one column, so the view toggle starts at tablet width.) Wide screens: one row. */}
        <Container className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 lg:flex lg:gap-4">
          <div className="relative col-start-1 row-start-1 lg:w-80">
            <label htmlFor="pf-catalog-search" className="sr-only">Search</label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
            <input
              id="pf-catalog-search"
              type="search"
              placeholder="Product or ingredient"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-input bg-white pr-10 pl-10 text-[16px] transition-[border-color,box-shadow] duration-200 placeholder:text-subtle hover:border-foreground/60 focus:border-primary focus:shadow-[0_0_0_4px_rgba(61,46,134,0.16)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="pf-no-scrollbar relative col-span-2 row-start-2 min-w-0 overflow-x-auto sm:col-span-1 lg:overflow-visible">
            <span id="pf-type-label" className="sr-only">Type</span>
            <ToggleGroup.Root
              type="single"
              value={type}
              onValueChange={v => setType((v || 'all') as TypeFilter)}
              aria-labelledby="pf-type-label"
              className="flex shrink-0 rounded-xl border border-border bg-surface p-1"
            >
              {(['all', 'rx', 'otc'] as const).map(v => (
                <ToggleGroup.Item
                  key={v}
                  value={v}
                  className={cn(
                    'relative flex h-9 items-center gap-1.5 rounded-[9px] px-3 text-[14px] font-semibold sm:px-3.5 sm:text-[15px] whitespace-nowrap transition-colors duration-200',
                    type === v ? 'text-white' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {type === v && (
                    <motion.span layoutId="pf-type-pill" className="absolute inset-0 rounded-[9px] bg-primary shadow-[0_4px_10px_-4px_rgba(61,46,134,0.6)]" transition={{ duration: 0.35, ease: EASE }} />
                  )}
                  <span className="relative">{TYPE_LABELS[v]}</span>
                  <span className={cn('relative font-mono text-[12px] tabular-nums', type === v ? 'text-white/80' : 'text-subtle')}>{counts[v]}</span>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          <div className="col-start-2 row-start-1 w-36 sm:w-44">
              <label htmlFor="pf-form-select" className="sr-only">Form</label>
              <Select value={form} onValueChange={setForm}>
                <SelectTrigger
                  id="pf-form-select"
                  className="h-11 w-full rounded-[10px] border-input bg-white text-[15px] font-medium hover:border-foreground/60 data-[size=default]:h-11"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FORMS}>All forms</SelectItem>
                  {forms.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
          </div>

          <div role="group" aria-label="View" className="col-start-2 row-start-2 hidden shrink-0 justify-self-end sm:flex rounded-xl border border-border bg-surface p-1 lg:ml-auto">
              {([['grid', LayoutGrid, 'Grid view'], ['list', List, 'List view']] as const).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={layout === v}
                  aria-label={label}
                  onClick={() => setLayout(v)}
                  className={cn(
                    'relative grid size-9 place-items-center rounded-[9px] transition-colors duration-200',
                    layout === v ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {layout === v && (
                    <motion.span layoutId="pf-view-toggle" className="absolute inset-0 rounded-[9px] bg-white shadow-[var(--pf-shadow-1)]" transition={{ duration: 0.3, ease: EASE }} />
                  )}
                  <Icon className="relative size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </button>
              ))}
          </div>
        </Container>
      </div>

      {/* Results sit on the page base with two faint washes at the edges. */}
      <div className="relative isolate">
      <Backdrop washes={[{ at: 'l', color: 'orchid', size: 0.45 }, { at: 'r', color: 'violet', size: 0.5 }]} pattern="grid" patternFrom="top" />
      <Container className="pt-6 pb-20 md:pb-28">
        <div className="flex min-h-9 flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-[14px] text-muted-foreground tabular-nums" aria-live="polite">
            Showing {filtered.length} of {items.length} {items.length === 1 ? 'product' : 'products'}
          </p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
            <AnimatePresence initial={false}>
              {chips.map(chip => (
                <motion.li
                  key={chip.key}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Remove filter ${chip.label}`}
                    className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-[#d3cee2] bg-[#f4f1fd] pr-2 pl-3 text-[13px] font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-[#ece8ff]"
                  >
                    {chip.label}
                    <X className="size-3.5 transition-transform duration-200 group-hover:rotate-90" strokeWidth={2.25} aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
              {chips.length > 1 && (
                <motion.li key="clear" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <button type="button" onClick={clear} className="h-8 rounded-md px-2 text-[13px] font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    Clear filters
                  </button>
                </motion.li>
              )}
            </AnimatePresence>
          </ul>
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-6 flex flex-col items-center rounded-[24px] px-6 py-16 text-center sm:py-20">
            <span className="grid size-16 place-items-center rounded-2xl bg-[#efebfd] text-primary" aria-hidden="true">
              <PackageSearch className="size-8" strokeWidth={1.5} />
            </span>
            <h2 className="mt-6 text-[24px] leading-tight tracking-[-0.02em]">No products match these filters</h2>
            <p className="mt-2 max-w-[44ch] text-muted-foreground">Try an ingredient name, or clear the filters to see everything.</p>
            <ActionButton variant="secondary" className="mt-7" onClick={clear}>Clear filters</ActionButton>
          </Card>
        ) : (
          <>
            <h2 className="sr-only">Products</h2>
            <LayoutGroup>
              <motion.ul
                key={layout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'mt-6 grid',
                  layout === 'grid' ? 'grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3' : 'grid-cols-1 gap-3',
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {visible.map(item => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="min-w-0"
                    >
                      <CatalogCard item={item} layout={layout} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </LayoutGroup>

            {remaining > 0 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-1 w-48 overflow-hidden rounded-full bg-border" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(visible.length / filtered.length) * 100}%` }} />
                </div>
                <p className="text-[14px] text-muted-foreground tabular-nums">
                  {visible.length} of {filtered.length} shown
                </p>
                <ActionButton variant="secondary" onClick={() => setShown({ key: filterKey, limit: limit + PAGE_SIZE })}>
                  Show {Math.min(remaining, PAGE_SIZE)} more
                </ActionButton>
              </div>
            )}
          </>
        )}
      </Container>
      </div>
    </>
  );
}
