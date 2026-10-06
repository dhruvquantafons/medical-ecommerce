"use client";

import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, ShieldCheck, ArrowRight, Star, CheckCircle2, Zap } from 'lucide-react';

interface FeaturedFormulationsProps {
  items: CatalogItem[];
}

export function FeaturedFormulations({ items }: FeaturedFormulationsProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Static cards for the banner preview (specific products by name)
  const bannerCards = useMemo(() => [
    { name: 'Calcitium Tablets',       brand: 'Syncytium Health', price: '₹359', img: '/portfolio/assets/medicine_calcitium_tablets.png' },
    { name: 'LYCOTIUM Softgel',        brand: 'Syncytium Health', price: '₹539', img: '/portfolio/assets/medicine_lycotium_softgel.png'  },
    { name: 'Calcitium-D3 Nano Shots', brand: 'Syncytium Health', price: '₹229', img: '/portfolio/assets/medicine_calcitium_d3.png'      },
  ], []);

  // Catalog items for the Featured Formulations grid below
  const featuredItems = items.slice(0, 3);

  return (
    <section id="featured-formulations" className="pf-section" style={{ padding: '70px 20px', position: 'relative', background: 'linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(241,245,249,0.5) 100%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="glass-panel pf-banner-card"
          style={{ position: 'relative', borderRadius: '28px', padding: '32px 24px', background: '#ffffff', border: '1px solid rgba(124,58,237,0.18)', boxShadow: '0 20px 50px rgba(124,58,237,0.08)', overflow: 'visible', marginBottom: '40px' }}
        >
          <div style={{ position: 'absolute', top: '-120px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
          <div className="pf-banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div>
              <div className="glass-pill" style={{ marginBottom: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', padding: '6px 14px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.82rem' }}>
                <ShoppingBag size={15} /><span>Therapeutic Store • Official Supply</span>
              </div>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.03em' }}>
                Shop From Us for <br />
                <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Spectrometry-Certified</span> Medicines
              </h2>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '560px' }}>
                Explore our curated range of highest-purity active salt formulations, laboratory-verified prescription therapeutics, and digital healthcare essentials ready for fast delivery.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="#10b981" /><span>100% Lab Verified Salts</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} color="#7c3aed" /><span>CAS Indexed & Registered</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={16} color="#f59e0b" /><span>Rapid Express Dispatch</span></div>
              </div>
              <button onClick={() => router.push('/store')} className="glass-button" style={{ padding: '14px 30px', fontSize: '1rem', fontWeight: 800, borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', color: '#ffffff', border: 'none', boxShadow: '0 10px 25px rgba(124,58,237,0.35)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingCart size={18} /><span>Shop Now</span><ArrowRight size={16} />
              </button>
            </div>
            {/* Mini stacked card preview */}
            <div
              className="pf-banner-cards-preview"
              style={isMobile ? {
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '12px',
                height: 'auto',
                width: '100%',
                padding: '12px 0 4px',
                overflowX: 'auto',
              } : {
                position: 'relative', width: '100%', height: '300px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '28px', overflow: 'visible',
              }}
            >
              {bannerCards.map((item, i) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -10, scale: 1.06, zIndex: 10 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => router.push('/portfolio/catalog')}
                  style={isMobile ? {
                    position: 'relative',
                    width: '110px',
                    flexShrink: 0,
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 28px rgba(99,102,241,0.18)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  } : {
                    position: 'absolute',
                    width: '170px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 28px rgba(99,102,241,0.18)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    // Symmetric ~40px gap on both sides of the centre card
                    right: i === 0 ? '345px' : i === 1 ? '175px' : '5px',
                    top:   i === 1 ? '14px' : '44px',
                    transform: `rotate(${(i - 1) * 10}deg) translateZ(0)`,
                    zIndex: i === 1 ? 3 : i === 0 ? 2 : 1,
                    willChange: 'transform',
                    imageRendering: 'auto',
                  } as React.CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: '100%', height: isMobile ? '90px' : '132px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                  <div style={{ padding: '8px 10px 10px' }}>
                    <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.brand}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '0.82rem', fontWeight: 900, color: '#0f172a' }}>
                      {item.price}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>Featured Formulations</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Handpicked top-rated products available in our pharmacy store catalog.</p>
            </div>
            <button onClick={() => router.push('/portfolio/catalog')} style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View Full Catalog</span><ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {featuredItems.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-panel"
                onClick={() => router.push('/portfolio/catalog')}
                style={{ borderRadius: '18px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              >
                <div>
                  <div style={{ width: '100%', aspectRatio: '4/3', maxHeight: '160px', borderRadius: '14px', overflow: 'hidden', marginBottom: '10px', position: 'relative', background: '#ffffff' }}>
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                    )}
                    <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)', color: '#ffffff' }}>{item.category}</span>
                    </div>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#ffffff', borderRadius: '9999px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', fontWeight: 700, color: '#0f172a', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                      <Star size={12} color="#f59e0b" fill="#f59e0b" /><span>{item.rating}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.brand}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{item.dosageForm}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', lineHeight: 1.25 }}>{item.name}</h4>
                </div>
                <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <button onClick={(e) => { e.stopPropagation(); router.push('/portfolio/catalog'); }} className="glass-button" style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <span>View Details</span><ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
