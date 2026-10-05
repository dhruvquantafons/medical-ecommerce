"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { TestTube2, Code2 } from 'lucide-react';

const MoleculeViewer = dynamic(() => import('./3d/MoleculeViewer').then(m => ({ default: m.MoleculeViewer })), { ssr: false });

interface SaltInspectorProps {
  items: CatalogItem[];
}

export function SaltInspector({ items }: SaltInspectorProps) {
  const featuredItems = items.slice(0, 3);
  const [selectedId, setSelectedId] = useState<string>(featuredItems[0]?.id ?? '');
  const [showSchema, setShowSchema] = useState(false);

  const activeItem: CatalogItem | undefined = featuredItems.find(i => i.id === selectedId) ?? featuredItems[0];
  const salts = activeItem ? parseSalts(activeItem.salts) : [];

  if (featuredItems.length === 0) return null;

  return (
    <section id="salt-inspector" className="pf-section" style={{ padding: '70px 20px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div className="glass-pill" style={{ marginBottom: '14px' }}>
            <TestTube2 size={14} color="var(--primary-accent)" />
            <span>Interactive Molecular Salt Inspector</span>
          </div>
          <h2 className="font-display gradient-text" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, marginBottom: '14px' }}>
            Deep-Dive into Active <span className="gradient-accent-text">Salt Formulations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Select any pharmaceutical formulation to analyze its active salt composition, molecular structure, bioavailability profile, and search schema tags.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px 18px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', WebkitOverflowScrolling: 'touch' }}>
            {featuredItems.map(item => (
              <button key={item.id} onClick={() => setSelectedId(item.id)}
                style={{ padding: '8px 14px', borderRadius: '10px', background: selectedId === item.id ? 'var(--badge-bg)' : 'var(--bg-secondary)', border: '1px solid', borderColor: selectedId === item.id ? 'var(--border-highlight)' : 'var(--border-color)', color: selectedId === item.id ? 'var(--secondary-accent)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease', flexShrink: 0 }}>
                {item.name}
              </button>
            ))}
          </div>

          {activeItem && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>3D Salt Molecule Mesh</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary-accent)', background: 'var(--badge-bg)', padding: '3px 8px', borderRadius: '6px' }}>{activeItem.molecularFormula}</span>
                </div>
                <MoleculeViewer formula={activeItem.molecularFormula} primaryColor="var(--primary-accent)" />
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Bioavailability Index</span>
                      <strong style={{ color: 'var(--secondary-accent)' }}>{activeItem.bioavailability}</strong>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: activeItem.bioavailability, background: 'linear-gradient(90deg, var(--primary-accent), var(--secondary-accent))' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Metabolic Half-Life</span>
                      <strong style={{ color: 'var(--text-main)' }}>{activeItem.halfLife}</strong>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '75%', background: 'var(--primary-accent)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Salt Composition Analysis</h3>
                  <button onClick={() => setShowSchema(!showSchema)} className="glass-button-secondary" style={{ padding: '5px 10px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    <Code2 size={13} /><span>{showSchema ? 'Show Salts List' : 'View Google JSON-LD'}</span>
                  </button>
                </div>
                {showSchema ? (
                  <div style={{ background: '#0b0717', padding: '16px', borderRadius: '14px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a7f3d0', border: '1px solid var(--border-color)', overflowX: 'auto', maxWidth: '100%' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify({ "@context": "https://schema.org", "@type": "Drug", name: activeItem.name, activeIngredient: salts.map(s => `${s.name} (${s.amount})`).join(', '), proprietaryName: activeItem.brand, legalStatus: activeItem.category, verificationCode: activeItem.digitalVerifiedId }, null, 2)}</pre>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {salts.map((salt, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{salt.name}</div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary-accent)', background: 'var(--badge-bg)', padding: '2px 8px', borderRadius: '6px' }}>{salt.amount} ({salt.percentage}%)</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                          <span>Clinical Function: <strong>{salt.purpose}</strong></span>
                          <span>CAS: {salt.casNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
