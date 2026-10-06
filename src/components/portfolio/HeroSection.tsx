"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ThemeMode } from './types/pharmacy';
import { Sparkles, ArrowRight, Mail } from 'lucide-react';

const PillCanvas = dynamic(() => import('./3d/PillCanvas').then(m => ({ default: m.PillCanvas })), { ssr: false });

interface HeroSectionProps {
  theme: ThemeMode;
}

export function HeroSection({ theme }: HeroSectionProps) {
  const router = useRouter();
  const trustLogos = ['Apollo Pharmacy', 'MedPlus', 'Netmeds'];

  return (
    <section id="hero-3d" className="pf-hero-section" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px', position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--hero-gradient)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div className="pf-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '30px', alignItems: 'center' }}>
          <div className="pf-hero-text-col" style={{ zIndex: 2 }}>
            <div className="glass-pill pf-hero-badge" style={{ marginBottom: '20px' }}>
              <Sparkles size={14} color="var(--primary-accent)" />
              <span>Intelligent Digital Medicine Platform</span>
            </div>
            <h1 className="font-display gradient-text pf-hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
              Empowering Healthcare <br />
              <span className="gradient-accent-text">Through Digital Precision</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '30px', maxWidth: '540px' }}>
              SYNCYTIUM Health empowers pharmaceutical leaders and retail pharmacies to digitize medicine catalogs, deliver verified active salt transparency, and connect patients seamlessly with certified healthcare products.
            </p>
            <div className="pf-hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
              <button onClick={() => router.push('/portfolio/catalog')} className="glass-button" style={{ padding: '14px 26px' }}>
                <span>Explore Medicine Directory</span>
                <ArrowRight size={18} />
              </button>
              <button onClick={() => { const el = document.getElementById('contact'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="glass-button-secondary" style={{ padding: '14px 24px' }}>
                <Mail size={16} color="var(--primary-accent)" />
                <span>Contact Partner Portal</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=100&q=80',
                ].map((img, idx) => (
                  <img key={idx} src={img} alt="Trusted Pharmacists" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ffffff', marginLeft: idx > 0 ? '-10px' : '0', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                ⭐ ⭐ ⭐ ⭐ ⭐ <br />
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Trusted by 12,000+</span> pharmacy &amp; health teams
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Trusted by innovative pharmacy networks</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                {trustLogos.map((brand, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.88)', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-accent)' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', letterSpacing: '-0.01em' }}>{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pf-pill-canvas-container" style={{ position: 'relative', width: '100%', minHeight: '580px', zIndex: 1, overflow: 'visible' }}>
            <PillCanvas theme={theme} particleCount={220} />
          </div>
        </div>
      </div>
    </section>
  );
}
