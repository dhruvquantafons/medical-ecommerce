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
    <section id="salt-inspector" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <div className="glass-pill" style={{ marginBottom: '16px' }}>
            <TestTube2 size={14} color="var(--primary-accent)" />
            <span>Interactive Molecular Salt Inspector</span>
          </div>
          <h2 className="font-display gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Deep-Dive into Active <span className="gradient-accent-text">Salt Formulations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Select any pharmaceutical formulation to analyze its active salt composition, molecular structure, bioavailability profile, and search schema tags.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '36px', borderRadius: '28px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }}>
            {featuredItems.map(item => (
              <button key={item.id} onClick={() => setSelectedId(item.id)}
                style={{ padding: '10px 18px', borderRadius: '12px', background: selectedId === item.id ? 'var(--badge-bg)' : 'var(--bg-secondary)', border: '1px solid', borderColor: selectedId === item.id ? 'var(--border-highlight)' : 'var(--border-color)', color: selectedId === item.id ? 'var(--secondary-accent)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
                {item.name}
              </button>
            ))}
          </div>

          {activeItem && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>3D Salt Molecule Mesh</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-accent)', background: 'var(--badge-bg)', padding: '4px 10px', borderRadius: '8px' }}>{activeItem.molecularFormula}</span>
                </div>
                <MoleculeViewer formula={activeItem.molecularFormula} primaryColor="var(--primary-accent)" />
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Bioavailability Index</span>
                      <strong style={{ color: 'var(--secondary-accent)' }}>{activeItem.bioavailability}</strong>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: activeItem.bioavailability, background: 'linear-gradient(90deg, var(--primary-accent), var(--secondary-accent))' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>Salt Composition Analysis</h3>
                  <button onClick={() => setShowSchema(!showSchema)} className="glass-button-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    <Code2 size={14} /><span>{showSchema ? 'Show Salts List' : 'View Google JSON-LD'}</span>
                  </button>
                </div>
                {showSchema ? (
                  <div style={{ background: '#0b0717', padding: '20px', borderRadius: '16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#a7f3d0', border: '1px solid var(--border-color)' }}>
                    <pre>{JSON.stringify({ "@context": "https://schema.org", "@type": "Drug", name: activeItem.name, activeIngredient: salts.map(s => `${s.name} (${s.amount})`).join(', '), proprietaryName: activeItem.brand, legalStatus: activeItem.category, verificationCode: activeItem.digitalVerifiedId }, null, 2)}</pre>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {salts.map((salt, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{salt.name}</div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-accent)', background: 'var(--badge-bg)', padding: '2px 8px', borderRadius: '6px' }}>{salt.amount} ({salt.percentage}%)</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', justifyContent: 'space-between' }}>
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
