"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ThemeMode } from './types/pharmacy';
import { Sparkles, ArrowRight, Mail, TrendingUp, ShieldCheck } from 'lucide-react';

const PillCanvas = dynamic(() => import('./3d/PillCanvas').then(m => ({ default: m.PillCanvas })), { ssr: false });

interface HeroSectionProps {
  theme: ThemeMode;
}

export function HeroSection({ theme }: HeroSectionProps) {
  const router = useRouter();
  const trustLogos = ['Apollo Pharmacy', 'MedPlus', 'Netmeds'];

  return (
    <section id="hero-3d" style={{ minHeight: '100vh', paddingTop: '130px', paddingBottom: '80px', position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--hero-gradient)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px', alignItems: 'center' }}>
          <div style={{ zIndex: 2 }}>
            <div className="glass-pill" style={{ marginBottom: '24px' }}>
              <Sparkles size={14} color="var(--primary-accent)" />
              <span>Intelligent Digital Medicine Platform</span>
            </div>
            <h1 className="font-display gradient-text" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '24px' }}>
              Empowering Healthcare <br />
              <span className="gradient-accent-text">Through Digital Precision</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '540px' }}>
              SYNCTIUM Health empowers pharmaceutical leaders and retail pharmacies to digitize medicine catalogs, deliver verified active salt transparency, and connect patients seamlessly with certified healthcare products.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
              <button onClick={() => router.push('/portfolio/catalog')} className="glass-button">
                <span>Explore Medicine Directory</span>
                <ArrowRight size={18} />
              </button>
              <button onClick={() => { const el = document.getElementById('contact'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="glass-button-secondary">
                <Mail size={16} color="var(--primary-accent)" />
                <span>Contact Partner Portal</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=100&q=80',
                ].map((img, idx) => (
                  <img key={idx} src={img} alt="Trusted Pharmacists" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #ffffff', marginLeft: idx > 0 ? '-10px' : '0', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                ⭐ ⭐ ⭐ ⭐ ⭐ <br />
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Trusted by 12,000+</span> pharmacy &amp; health teams
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Trusted by innovative pharmacy networks</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'center' }}>
                {trustLogos.map((brand, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.8)', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-accent)' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', letterSpacing: '-0.01em' }}>{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', height: '100%', width: '100%', minHeight: '580px', zIndex: 1, overflow: 'visible' }}>
            <PillCanvas theme={theme} particleCount={220} />
            <div className="glass-panel" style={{ position: 'absolute', top: '20px', right: '10px', padding: '18px 22px', borderRadius: '20px', width: '220px', boxShadow: '0 20px 40px rgba(168,85,247,0.15)', border: '1px solid rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.85)', zIndex: 10 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>Search Indexing</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>98.6%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Google Search Accuracy Rate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                <TrendingUp size={14} /><span>+12.4% vs last week</span>
              </div>
            </div>
            <div className="glass-panel" style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '12px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.85)', boxShadow: '0 12px 30px rgba(99,102,241,0.12)', zIndex: 10 }}>
              <ShieldCheck size={20} color="var(--primary-accent)" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Verified Active Salt Integrity</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Certified Pharmaceutical Data Standard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
