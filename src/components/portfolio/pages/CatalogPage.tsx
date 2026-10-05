"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { MedicineModal } from '../MedicineModal';
import { Search, ShieldCheck, Eye, Star, Sparkles, ArrowLeft, FlaskConical, Pill, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_META: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  'Prescription (Rx)':       { color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  icon: <Pill size={18} /> },
  'Over-The-Counter (OTC)':  { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  icon: <ShieldCheck size={18} /> },
  'Biotech Formulations':    { color: '#ec4899', bg: 'rgba(236,72,153,0.08)',  icon: <FlaskConical size={18} /> },
  'Nutraceuticals':          { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  icon: <Leaf size={18} /> },
};

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '99,102,241';
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}

function MedicineCard({ item, idx, onSelect, onAddToCart, accentColor }: { item: CatalogItem; idx: number; onSelect: () => void; onAddToCart: () => void; accentColor: string }) {
  const salts = parseSalts(item.salts);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.25) }}
      whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.10)' }}
      style={{ padding: '24px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div style={{ height: '4px', borderRadius: '4px 4px 0 0', background: item.imageGradient || `#${accentColor}`, marginBottom: '18px', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '8px', background: `rgba(${hexToRgb(accentColor)}, 0.1)`, color: accentColor, border: `1px solid rgba(${hexToRgb(accentColor)}, 0.2)`, letterSpacing: '0.04em' }}>{item.dosageForm}</span>
          {item.googleIndexed && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}><ShieldCheck size={13} /><span>Certified</span></div>}
        </div>
        <div style={{ width: '100%', aspectRatio: '1/1', maxHeight: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '3px', lineHeight: 1.3 }}>{item.name}</h3>
        <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>By {item.brand}</div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Active Salts</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {salts.slice(0, 2).map((salt, i) => (
              <span key={i} style={{ fontSize: '0.72rem', background: '#f8fafc', color: '#334155', padding: '3px 9px', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{salt.name} ({salt.amount})</span>
            ))}
            {salts.length > 2 && <span style={{ fontSize: '0.72rem', color: '#94a3b8', padding: '3px 6px', fontWeight: 600 }}>+{salts.length - 2} more</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: '#64748b', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}><Star size={13} fill="#f59e0b" /><span>{item.rating}</span><span style={{ color: '#94a3b8', fontWeight: 400 }}>({item.reviewsCount})</span></div>
          <div>Bio: <strong style={{ color: accentColor }}>{item.bioavailability}</strong></div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Est. Retail</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{item.priceEstimate}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onSelect} className="glass-button-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}><Eye size={14} /><span>Inspect 3D</span></button>
          <button onClick={onAddToCart} className="glass-button" style={{ padding: '7px 14px', fontSize: '0.8rem' }}><span>Select</span></button>
        </div>
      </div>
    </motion.div>
  );
}

interface CatalogPageProps {
  items: CatalogItem[];
}

export function CatalogPage({ items }: CatalogPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCart = (item: CatalogItem) => {
    setToastMessage(`Selected "${item.name}" for SYNCTIUM Health digital store!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Derive categories from live data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(i => i.category)));
    return ['All', ...cats];
  }, [items]);

  const filteredItems = useMemo(() => items.filter(item => {
    const salts = parseSalts(item.salts);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salts.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeFilter === 'All' || item.category === activeFilter;
    return matchesSearch && matchesCat;
  }), [items, searchQuery, activeFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, CatalogItem[]> = {};
    categories.filter(c => c !== 'All').forEach(cat => {
      const meds = filteredItems.filter(m => m.category === cat);
      if (meds.length > 0) groups[cat] = meds;
    });
    return groups;
  }, [filteredItems, categories]);

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--hero-gradient)' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 3000, background: '#ffffff', border: '1px solid #10b981', borderRadius: '16px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '12px', color: '#059669', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '0.9rem' }}>
          <span>✓ {toastMessage}</span>
        </div>
      )}

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px' }}>
        <button onClick={() => router.push('/portfolio')} className="glass-button-secondary" style={{ marginBottom: '28px', padding: '8px 16px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /><span>Back to Home</span>
        </button>

        <div style={{ marginBottom: '40px' }}>
          <div className="glass-pill" style={{ marginBottom: '14px' }}><Sparkles size={14} color="var(--primary-accent)" /><span>Dedicated Digital Medicine Registry</span></div>
          <h1 className="font-display gradient-text" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '12px' }}>
            Complete Pharmaceutical <span className="gradient-accent-text">Medicine Catalog</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '680px', lineHeight: 1.65 }}>
            Browse {items.length} certified formulations. Inspect active salt percentages, molecular formulas, and bioavailability indices.
          </p>
        </div>

        {/* Category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {categories.filter(c => c !== 'All').map(cat => {
            const meta = CATEGORY_META[cat] ?? { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', icon: <FlaskConical size={18} /> };
            const count = items.filter(m => m.category === cat).length;
            const isActive = activeFilter === cat;
            return (
              <button key={cat} onClick={() => setActiveFilter(isActive ? 'All' : cat)}
                style={{ padding: '18px 22px', borderRadius: '16px', background: isActive ? meta.bg : '#ffffff', border: `1.5px solid ${isActive ? meta.color : '#e2e8f0'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease', boxShadow: isActive ? `0 6px 24px rgba(${hexToRgb(meta.color)}, 0.18)` : '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isActive ? meta.color : '#f1f5f9', color: isActive ? '#fff' : meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{meta.icon}</div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isActive ? meta.color : '#0f172a' }}>{count}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>{cat}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>Click to view formulations</div>
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', background: '#ffffff', padding: '16px 22px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search salts, names, brands..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 13px 9px 36px', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.85rem', outline: 'none', fontWeight: 600, boxSizing: 'border-box' }} />
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Showing <span style={{ color: 'var(--primary-accent)', fontWeight: 800 }}>{filteredItems.length}</span> products</div>
        </div>

        {filteredItems.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 20px' }}>
            <FlaskConical size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No formulations found</h3>
            <p style={{ color: '#94a3b8' }}>Try a different search term or category.</p>
          </motion.div>
        )}

        {activeFilter === 'All' ? (
          Object.entries(grouped).map(([cat, catItems]) => {
            const meta = CATEGORY_META[cat] ?? { color: '#6366f1', bg: '', icon: null };
            return (
              <div key={cat} style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: meta.color }} />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{cat}</h2>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>({catItems.length} products)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {catItems.map((item, idx) => (
                    <MedicineCard key={item.id} item={item} idx={idx} onSelect={() => setSelectedItem(item)} onAddToCart={() => handleAddToCart(item)} accentColor={meta.color} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredItems.map((item, idx) => (
              <MedicineCard key={item.id} item={item} idx={idx} onSelect={() => setSelectedItem(item)} onAddToCart={() => handleAddToCart(item)} accentColor={CATEGORY_META[item.category]?.color ?? '#6366f1'} />
            ))}
          </div>
        )}
      </div>

      <MedicineModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={handleAddToCart} />
    </div>
  );
}
