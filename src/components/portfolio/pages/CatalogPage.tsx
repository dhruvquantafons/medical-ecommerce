"use client";

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Container, Reveal, SectionHeading } from '../site';
import { CatalogCard } from '../CatalogCard';
import { usePortfolio } from '../PortfolioContext';
import { isPrescription } from '../copy';

/*
  Catalogue index (changeui.md, Problem 18, part B), kept at its current URL.
  Filters are mirrored in the query string (?q=, ?type=rx|otc, ?form=) so a view can be shared;
  ?item=<id> opens that product's details.
  Removed: the count cards, the card around the search box, "Certified" ticks, star ratings,
  review counts, "Bio:" figures and coloured top borders.
*/

type TypeFilter = 'all' | 'rx' | 'otc';
const ALL_FORMS = 'all';

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

  return (
    <Container className="py-16 md:py-24">
      <Reveal>
        <SectionHeading
          as="h1"
          id="pf-page-title"
          title="Product catalog"
          lead={`All ${items.length} formulations we make, with the active ingredients in each. Select a product to see its full composition.`}
        />

        <div className="mt-10 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-end">
          <div className="grid gap-2 lg:w-80">
            <Label htmlFor="pf-catalog-search" className="text-sm text-muted-foreground">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="pf-catalog-search"
                type="search"
                placeholder="Product or ingredient"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <span id="pf-type-label" className="text-sm font-medium text-muted-foreground">Type</span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={type}
              onValueChange={v => setType((v || 'all') as TypeFilter)}
              aria-labelledby="pf-type-label"
              className="h-11"
            >
              {([['all', 'All'], ['rx', 'Prescription'], ['otc', 'Over the counter']] as const).map(([v, label]) => (
                <ToggleGroupItem
                  key={v}
                  value={v}
                  className="h-11 px-3 text-[15px] sm:px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {label}
                  <span className="ml-1 hidden font-mono text-[13px] opacity-80 sm:inline">{counts[v]}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2 lg:w-48">
            <Label htmlFor="pf-form-select" className="text-sm text-muted-foreground">Form</Label>
            <Select value={form} onValueChange={setForm}>
              <SelectTrigger id="pf-form-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FORMS}>All forms</SelectItem>
                {forms.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-6 text-[15px] text-muted-foreground" aria-live="polite">
          Showing {filtered.length} of {items.length} {items.length === 1 ? 'product' : 'products'}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border bg-surface px-6 py-14 text-center">
            <h2 className="text-[24px]">No products match these filters</h2>
            <p className="mt-2 text-muted-foreground">Try an ingredient name, or clear the filters to see everything.</p>
            <Button variant="outline" className="mt-6" onClick={clear}>Clear filters</Button>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Products</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {filtered.map(item => (
                <li key={item.id} className="min-w-0"><CatalogCard item={item} /></li>
              ))}
            </ul>
          </>
        )}
      </Reveal>
    </Container>
  );
}
