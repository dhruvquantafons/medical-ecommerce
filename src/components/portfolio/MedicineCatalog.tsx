"use client";

import { useState, useMemo } from 'react';
import { MEDICINES_DATA } from './data/pharmacyData';
import type { Medicine } from './types/pharmacy';
import { Search, ShieldCheck, Eye, ShoppingCart, Star, Sparkles } from 'lucide-react';

interface MedicineCatalogProps {
  onSelectMedicine: (medicine: Medicine) => void;
  onAddToCart: (medicine: Medicine) => void;
}

export function MedicineCatalog({ onSelectMedicine, onAddToCart }: MedicineCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Prescription (Rx)', 'Over-The-Counter (OTC)', 'Biotech Formulations', 'Nutraceuticals'];

  const filteredMedicines = useMemo(() => MEDICINES_DATA.filter(med => {
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || med.brand.toLowerCase().includes(searchQuery.toLowerCase()) || med.salts.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }), [selectedCategory, searchQuery]);

  return (
    <section id="catalog" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <div className="glass-pill" style={{ marginBottom: '16px' }}><Sparkles size={14} color="var(--primary-accent)" /><span>Digital Medicine Registry</span></div>
          <h2 className="font-display gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Interactive Medicine & <span className="gradient-accent-text">Active Salt Directory</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>Browse through digitised pharmaceutical products with verified active salt breakdowns and molecular formulas.</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', background: 'var(--bg-card)', backdropFilter: 'blur(16px)', padding: '16px 24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid', borderColor: selectedCategory === cat ? 'var(--border-highlight)' : 'transparent', background: selectedCategory === cat ? 'var(--badge-bg)' : 'transparent', color: selectedCategory === cat ? 'var(--secondary-accent)' : 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>{cat}</button>
            ))}
          </div>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search by salt (e.g. Paracetamol, Cetirizine)..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
          {filteredMedicines.map(med => (
            <div key={med.id} className="glass-panel" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'var(--badge-bg)', color: 'var(--secondary-accent)', border: '1px solid var(--border-color)' }}>{med.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}><ShieldCheck size={14} /><span>Google Indexed</span></div>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{med.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>By {med.brand} • <span style={{ color: 'var(--secondary-accent)' }}>{med.dosageForm}</span></div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Active Salt Formulations:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {med.salts.map((salt, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <strong>{salt.name}</strong> ({salt.amount})
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}><Star size={14} fill="#f59e0b" /><span>{med.rating}</span><span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>({med.reviewsCount})</span></div>
                  <div>Bioavailability: <strong style={{ color: 'var(--secondary-accent)' }}>{med.bioavailability}</strong></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Estimated Retail</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{med.priceEstimate}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => onSelectMedicine(med)} className="glass-button-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }} title="Inspect 3D Salt Structure"><Eye size={16} /></button>
                  <button onClick={() => onAddToCart(med)} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.85rem' }}><ShoppingCart size={15} /><span>Sync Store</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
