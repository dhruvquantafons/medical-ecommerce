"use client";

import { useState } from 'react';
import type { Medicine } from './types/pharmacy';
import { PRODUCT_IMAGES } from './data/pharmacyData';
import { X, ShieldCheck, ShoppingCart, Code2 } from 'lucide-react';

interface MedicineModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onAddToCart: (medicine: Medicine) => void;
}

export function MedicineModal({ medicine, onClose, onAddToCart }: MedicineModalProps) {
  const [showJsonLd, setShowJsonLd] = useState(false);

  if (!medicine) return null;

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{ maxWidth: '740px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '36px', borderRadius: '28px', position: 'relative', border: '1px solid var(--border-highlight)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', background: '#ffffff' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'var(--badge-bg)', color: 'var(--secondary-accent)', border: '1px solid var(--border-color)' }}>{medicine.category}</span>
          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}><ShieldCheck size={14} /> Verified Salt Formula</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{medicine.name}</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginBottom: '24px' }}>
          Manufactured by <strong>{medicine.brand}</strong> • Digital ID: <code style={{ color: 'var(--secondary-accent)' }}>{medicine.digitalVerifiedId}</code>
        </div>

        {PRODUCT_IMAGES[medicine.id] && (
          <div style={{ width: '100%', marginBottom: '24px', background: '#ffffff', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-color)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRODUCT_IMAGES[medicine.id]} alt={medicine.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
          </div>
        )}

        <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px', color: 'var(--text-main)', lineHeight: 1.65, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
          {medicine.description}
        </div>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Active Chemical Salts Breakdown:</h4>
            <button onClick={() => setShowJsonLd(!showJsonLd)} className="glass-button-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              <Code2 size={12} /><span>{showJsonLd ? 'View Salt List' : 'Google Schema'}</span>
            </button>
          </div>
          {showJsonLd ? (
            <div style={{ background: '#0b0717', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a7f3d0' }}>
              <pre>{JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalEntity", name: medicine.name, salts: medicine.salts, bioavailability: medicine.bioavailability }, null, 2)}</pre>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {medicine.salts.map((s, idx) => (
                <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Function: {s.purpose} • CAS: {s.casNumber}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--secondary-accent)', fontSize: '0.9rem' }}>{s.amount} ({s.percentage}%)</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Retail Price Estimate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{medicine.priceEstimate}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="glass-button-secondary">Close</button>
            <button onClick={() => { onAddToCart(medicine); onClose(); }} className="glass-button">
              <ShoppingCart size={16} /><span>Sync to Store Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
