"use client";

import type { CatalogItem } from '@/lib/catalog-item-types';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { FeaturedFormulations } from './FeaturedFormulations';
import { SaltInspector } from './SaltInspector';
import { ContactSection } from './ContactSection';

interface PortfolioHomeProps {
  items: CatalogItem[];
}

export function PortfolioHome({ items }: PortfolioHomeProps) {
  return (
    <>
      <HeroSection theme="purple" />
      <AboutSection />
      <FeaturedFormulations items={items} />
      <SaltInspector items={items} />
      <ContactSection />
    </>
  );
}
