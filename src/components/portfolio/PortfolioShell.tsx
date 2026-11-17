"use client";

import { useCallback, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import type { Category } from '@/data/types';
import { cn } from '@/lib/utils';
import { Navbar } from './Navbar';
import { PortfolioFooter } from './PortfolioFooter';
import { ItemDialog } from './ItemDialog';
import { PortfolioContext } from './PortfolioContext';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

interface PortfolioShellProps {
  children: React.ReactNode;
  items: CatalogItem[];
  collections: Category[];
  /** next/font variable classes (Newsreader, Geist, Geist Mono). */
  fontClassName: string;
}

export function PortfolioShell({ children, items, collections, fontClassName }: PortfolioShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const openItem = useCallback((item: CatalogItem) => setSelectedItem(item), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const ctx = useMemo(() => ({ openItem, openSearch }), [openItem, openSearch]);

  return (
    <PortfolioContext.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div data-portfolio className={cn(fontClassName)}>
          <a
            href="#main"
            className="sr-only z-[60] rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Navbar onSearchClick={openSearch} />
          <main id="main" tabIndex={-1}>{children}</main>
          <PortfolioFooter collections={collections} />

          <ItemDialog item={selectedItem} onClose={() => setSelectedItem(null)} />

          {/* Site search over the catalog: shadcn command dialog (changeui.md, Problem 04). */}
          <CommandDialog
            open={searchOpen}
            onOpenChange={setSearchOpen}
            title="Search products"
            description="Search the catalog by product or ingredient name"
          >
            <CommandInput placeholder="Product or ingredient name" />
            <CommandList>
              <CommandEmpty>No products match. Try an ingredient name instead.</CommandEmpty>
              <CommandGroup heading="Catalog">
                {items.map(item => {
                  const salts = parseSalts(item.salts).map(s => s.name);
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.name} ${salts.join(' ')}`}
                      onSelect={() => { setSearchOpen(false); setSelectedItem(item); }}
                      className="flex-col items-start gap-0.5"
                    >
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-[13px] text-muted-foreground">{salts.join(', ')}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </MotionConfig>
    </PortfolioContext.Provider>
  );
}
