"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import type { CatalogItem } from '@/lib/catalog-item-types';
import { parseSalts } from '@/lib/catalog-item-types';
import { Navbar } from './Navbar';
import { MedicineModal } from './MedicineModal';

interface PortfolioShellProps {
  children: React.ReactNode;
  items: CatalogItem[];
}

export function PortfolioShell({ children, items }: PortfolioShellProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredSearchResults = items.filter(item => {
    const salts = parseSalts(item.salts);
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salts.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAddToCart = (item: CatalogItem) => {
    setToastMessage(`Selected "${item.name}" for SYNCYTIUM Health digital store!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div data-portfolio style={{ minHeight: '100vh', position: 'relative' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 3000, background: '#ffffff', border: '1px solid #10b981', borderRadius: '16px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '12px', color: '#059669', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '0.9rem' }}>
          <span>✓ {toastMessage}</span>
        </div>
      )}

      <Navbar onSearchClick={() => setSearchOpen(true)} />
      <main>{children}</main>
      <MedicineModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={handleAddToCart} />

      {searchOpen && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2500, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px', paddingLeft: '20px', paddingRight: '20px' }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: '640px', width: '100%', padding: '24px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <Search size={20} color="#7c3aed" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search SYNCYTIUM Health salt database (e.g. Paracetamol, Cetirizine)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#0f172a', fontSize: '1.1rem', outline: 'none', fontWeight: 600 }}
                />
              </div>
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredSearchResults.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No matching active salts or medicines found.</div>
              ) : (
                filteredSearchResults.map(item => {
                  const salts = parseSalts(item.salts);
                  return (
                    <div
                      key={item.id}
                      onClick={() => { setSelectedItem(item); setSearchOpen(false); router.push('/portfolio'); }}
                      style={{ padding: '12px 16px', borderRadius: '12px', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Salts: {salts.map(s => s.name).join(', ')}</div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>Inspect ➔</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
