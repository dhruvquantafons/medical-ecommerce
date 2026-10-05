"use client";

import { useRouter } from 'next/navigation';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, ShieldCheck, ArrowRight, Star, CheckCircle2, Zap } from 'lucide-react';

interface FeaturedFormulationsProps {
  items: CatalogItem[];
}

export function FeaturedFormulations({ items }: FeaturedFormulationsProps) {
  const router = useRouter();
  const featuredItems = items.slice(0, 3);

  return (
    <section id="featured-formulations" className="pf-section" style={{ padding: '70px 20px', position: 'relative', background: 'linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(241,245,249,0.5) 100%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="glass-panel pf-banner-card"
          style={{ position: 'relative', borderRadius: '28px', padding: '32px 24px', background: '#ffffff', border: '1px solid rgba(124,58,237,0.18)', boxShadow: '0 20px 50px rgba(124,58,237,0.08)', overflow: 'hidden', marginBottom: '40px' }}
        >
          <div style={{ position: 'absolute', top: '-120px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
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
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.8)', maxHeight: '320px', width: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portfolio/assets/banner_pinterest.jpg" alt="3D Floating Capsules Pharmacy Banner" style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
            </motion.div>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {featuredItems.map((item, idx) => {
            const salts = parseSalts(item.salts);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-panel"
                onClick={() => router.push('/portfolio/catalog')}
                style={{ borderRadius: '18px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              >
                <div>
                  <div style={{ width: '100%', aspectRatio: '1/1', maxHeight: '240px', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px', position: 'relative', background: '#ffffff' }}>
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
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', lineHeight: 1.25 }}>{item.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                  <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {salts.map((salt, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '0.68rem', fontWeight: 600, background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>{salt.name} ({salt.amount})</span>
                    ))}
                  </div>
                </div>
                <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>Price</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{item.priceEstimate}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); router.push('/store'); }} className="glass-button" style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <ShoppingCart size={14} /><span>Shop Now</span>
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
