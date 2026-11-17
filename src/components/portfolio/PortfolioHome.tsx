"use client";

import type { CatalogItem } from '@/lib/catalog-item-types';
import type { Product } from '@/data/types';
import { HeroSection, type HomeFacts } from './HeroSection';
import { RangeSection, type RangeTile } from './RangeSection';
import { ShopSection } from './ShopSection';
import { CompositionTeaser } from './CompositionTeaser';
import { ContactSection } from './ContactSection';
import { PartnerStrip } from './PartnerStrip';

interface PortfolioHomeProps {
  items: CatalogItem[];
  bestsellers: Product[];
  heroProducts: Product[];
  areas: string[];
  hasPrescription: boolean;
  facts: HomeFacts;
  tiles: RangeTile[];
}

export function PortfolioHome({ items, bestsellers, heroProducts, areas, hasPrescription, facts, tiles }: PortfolioHomeProps) {
  return (
    <>
      <HeroSection products={heroProducts} areas={areas} hasPrescription={hasPrescription} facts={facts} />
      {/* Shows nothing until real partner logos are listed in partner-logos.ts (TODO(owner)). */}
      <PartnerStrip />
      <RangeSection tiles={tiles} />
      <ShopSection products={bestsellers} />
      <CompositionTeaser items={items} />
      <ContactSection />
    </>
  );
}
