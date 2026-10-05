"use client";

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Zap, ArrowRight, Code2, RefreshCw } from 'lucide-react';
import type { ECommercePayload } from './types/pharmacy';

interface ECommerceSyncProps {
  onTriggerSyncDemo: () => void;
}

export function ECommerceSync({ onTriggerSyncDemo }: ECommerceSyncProps) {
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'CONNECTED'>('IDLE');
  const [activePayload, setActivePayload] = useState<ECommercePayload>({
    storeId: 'STORE-PHARM-889', sku: 'MED-HEPOB-TAB', medicineName: 'HEP-OB™ Tablets',
    saltSignature: 'Oleoylethanolamide 200mg + Pantethine 100mg + L-Valine 150mg',
    quantity: 1, status: 'VERIFIED', timestamp: new Date().toISOString(),
  });

  const handleSimulateSync = () => {
    setSyncStatus('SYNCING');
    setTimeout(() => {
      setSyncStatus('CONNECTED');
      setActivePayload({ storeId: 'STORE-PHARM-889', sku: 'MED-HEPOB-TAB', medicineName: 'HEP-OB™ Tablets', saltSignature: 'Oleoylethanolamide 200mg + Pantethine 100mg + L-Valine 150mg', quantity: Math.floor(Math.random() * 3) + 1, status: 'DISPATCH_READY', timestamp: new Date().toISOString() });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#7c3aed', '#10b981', '#f59e0b', '#ffffff'] });
      onTriggerSyncDemo();
    }, 800);
  };

  return (
    <section id="ecommerce-sync" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ marginBottom: '16px' }}><Zap size={14} color="var(--primary-accent)" /><span>Ready For Live E-Commerce Integration</span></div>
          <h2 className="font-display gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Connect 3D Portfolio to <span className="gradient-accent-text">Your Online Pharmacy</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Designed as a high-converting digital storefront bridge. Sync products, salt metadata, and customer purchase intent directly into Shopify, MedusaJS, or custom REST APIs.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '40px', borderRadius: '28px', border: '1px solid var(--border-highlight)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
            {[
              { step: 'Step 1: Showcase', title: '3D Salt Portfolio', desc: 'User explores 3D medicine model & active salts', color: 'var(--primary-accent)' },
              { step: 'Step 2: API Payload', title: 'REST / GraphQL Sync', desc: 'Verifies salt authenticity & inventory status', color: 'var(--secondary-accent)' },
              { step: 'Step 3: Conversion', title: 'Store Cart Checkout', desc: 'Direct single-click dispatch to checkout page', color: '#10b981' },
            ].map(({ step, title, desc, color }, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color, marginBottom: '8px', textTransform: 'uppercase' }}>{step}</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{desc}</div>
              </div>
            )).flatMap((el, i, arr) => i < arr.length - 1 ? [el, <div key={`arrow-${i}`} style={{ display: 'flex', justifyContent: 'center', color: 'var(--secondary-accent)' }}><ArrowRight size={24} /></div>] : [el])}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>Interactive Store Sync Simulator</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Test the real-time API payload transmission. Clicking below simulates sending active salt signatures and product SKUs to an online e-commerce cart.</p>
              <button onClick={handleSimulateSync} className="glass-button" style={{ padding: '14px 28px', fontSize: '1rem' }} disabled={syncStatus === 'SYNCING'}>
                {syncStatus === 'SYNCING' ? (<><RefreshCw size={18} /><span>Syncing Payload...</span></>) : (<><Zap size={18} /><span>Test Instant Store Sync</span></>)}
              </button>
            </div>
            <div style={{ background: '#0b0717', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary-accent)' }}><Code2 size={16} /><span>Real-Time JSON Payload</span></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: syncStatus === 'CONNECTED' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)', color: syncStatus === 'CONNECTED' ? '#34d399' : 'var(--text-subtle)' }}>
                  {syncStatus === 'CONNECTED' ? '● SYNC DISPATCHED' : 'READY'}
                </span>
              </div>
              <pre style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#a7f3d0', overflowX: 'auto', margin: 0 }}>{JSON.stringify(activePayload, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
