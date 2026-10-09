"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onSearchClick: () => void;
}

export function Navbar({ onSearchClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPage = pathname.includes('/catalog')
    ? 'catalog'
    : pathname.includes('/team')
    ? 'team'
    : pathname.includes('/about')
    ? 'about'
    : 'home';

  const navTo = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const scrollToAnchor = (anchor: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/portfolio') {
      router.push(`/portfolio#${anchor}`);
    } else {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '10px 20px' : '16px 24px',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid rgba(226,232,240,0.4)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/brand/logo.png" alt="SYNCYTIUM Health" width={360} height={150} className="pf-navbar-logo" style={{ height: '150px', width: 'auto', marginTop: '-30px', marginBottom: '-30px' }} priority />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="pf-desktop-nav">
          {[
            { label: 'Home', page: 'home', href: '/portfolio' },
            { label: 'About Us', page: 'about', href: '/portfolio/about' },
            { label: 'Digital Catalog', page: 'catalog', href: '/portfolio/catalog' },
            { label: 'Team & Employ', page: 'team', href: '/portfolio/team' },
          ].map(({ label, page, href }) => (
            <Link key={page} href={href} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: currentPage === page ? '#7c3aed' : '#475569',
              fontWeight: currentPage === page ? 800 : 600,
              fontSize: '0.92rem',
              position: 'relative',
              textDecoration: 'none',
            }}>
              {label}
              {currentPage === page && (
                <span style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: '#7c3aed', borderRadius: '1px' }} />
              )}
            </Link>
          ))}
          <button onClick={() => scrollToAnchor('salt-inspector')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontWeight: 600, fontSize: '0.92rem' }}>
            Salt Inspector
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onSearchClick} className="glass-button-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: '9999px' }} aria-label="Search Salts">
            <Search size={16} color="#7c3aed" />
            <span className="pf-search-text">Search Salts</span>
          </button>
          <Link href="/store" className="glass-button pf-header-get-started" style={{ padding: '9px 18px', fontSize: '0.85rem', textDecoration: 'none' }}>
            <span>Get Started</span>
            <ArrowRight size={14} />
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a', cursor: 'pointer', display: 'none', width: '38px', height: '38px', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', padding: 0 }} className="pf-mobile-btn" aria-label="Toggle Navigation Menu">
            {mobileMenuOpen ? <X size={22} color="#0f172a" /> : <Menu size={22} color="#0f172a" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ marginTop: '12px', background: '#ffffff', borderRadius: '18px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Home', href: '/portfolio' },
            { label: 'About Us', href: '/portfolio/about' },
            { label: 'Digital Catalog', href: '/portfolio/catalog' },
            { label: 'Team & Employ', href: '/portfolio/team' },
          ].map(({ label, href }) => (
            <button key={href} onClick={() => navTo(href)} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px 14px', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}>
              {label}
            </button>
          ))}
          <button onClick={() => scrollToAnchor('salt-inspector')} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px 14px', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}>
            Salt Inspector
          </button>
          <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="glass-button" style={{ padding: '12px 20px', fontSize: '0.95rem', justifyContent: 'center', textDecoration: 'none', marginTop: '4px' }}>
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .pf-desktop-nav { display: none !important; }
          .pf-mobile-btn { display: flex !important; }
          .pf-search-text { display: none !important; }
        }
        @media (max-width: 640px) {
          .pf-header-get-started { display: none !important; }
        }
      `}</style>
    </header>
  );
}
