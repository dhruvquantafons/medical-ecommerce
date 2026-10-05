"use client";

import { useState } from 'react';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { FeaturedFormulations } from '@/components/portfolio/FeaturedFormulations';
import { SaltInspector } from '@/components/portfolio/SaltInspector';
import { ECommerceSync } from '@/components/portfolio/ECommerceSync';
import { ContactSection } from '@/components/portfolio/ContactSection';

export default function PortfolioHomePage() {
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
      <FeaturedFormulations />
      <SaltInspector />
      <ECommerceSync onTriggerSyncDemo={handleSyncDemo} />
      <ContactSection />
    </>
  );
}
