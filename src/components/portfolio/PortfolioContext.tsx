"use client";

import { createContext, useContext } from 'react';
import type { CatalogItem } from '@/lib/catalog-item-types';

interface PortfolioContextValue {
  /** Open the product details dialog (one shared instance, rendered by PortfolioShell). */
  openItem: (item: CatalogItem) => void;
  openSearch: () => void;
}

export const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioShell');
  return ctx;
}
