"use client";

import { useState } from 'react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { FeaturedFormulations } from './FeaturedFormulations';
import { SaltInspector } from './SaltInspector';
import { ECommerceSync } from './ECommerceSync';
import { ContactSection } from './ContactSection';

interface PortfolioHomeProps {
  items: CatalogItem[];
}

export function PortfolioHome({ items }: PortfolioHomeProps) {
  const [syncToastVisible, setSyncToastVisible] = useState(false);

  const handleSyncDemo = () => {
    setSyncToastVisible(true);
    setTimeout(() => setSyncToastVisible(false), 3500);
  };

  return (
    <>
      {syncToastVisible && (
        <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 3000, background: '#ffffff', border: '1px solid #7c3aed', borderRadius: '16px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '12px', color: '#7c3aed', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '0.9rem' }}>
          <span>⚡ Store sync dispatched successfully!</span>
        </div>
      )}
      <HeroSection theme="purple" />
      <AboutSection />
      <FeaturedFormulations items={items} />
      <SaltInspector items={items} />
      <ECommerceSync onTriggerSyncDemo={handleSyncDemo} />
      <ContactSection />
    </>
  );
}
