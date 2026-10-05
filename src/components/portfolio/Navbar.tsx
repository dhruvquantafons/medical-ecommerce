"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Pill, Search, Menu, X, ArrowRight } from 'lucide-react';

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
        padding: scrolled ? '12px 32px' : '22px 40px',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/portfolio" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
            <Pill size={22} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
            SYNCTIUM <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.05em' }}>HEALTH</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="pf-desktop-nav">
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={onSearchClick} className="glass-button-secondary" style={{ padding: '9px 16px', fontSize: '0.88rem' }}>
            <Search size={15} />
            <span className="pf-search-text">Search Salts</span>
          </button>
          <button onClick={() => scrollToAnchor('contact')} className="glass-button" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
            <span>Get Started</span>
            <ArrowRight size={15} />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'none' }} className="pf-mobile-btn">
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ marginTop: '16px', background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Home', href: '/portfolio' },
            { label: 'About Us', href: '/portfolio/about' },
            { label: 'Digital Catalog', href: '/portfolio/catalog' },
            { label: 'Team & Employ', href: '/portfolio/team' },
          ].map(({ label, href }) => (
            <button key={href} onClick={() => navTo(href)} style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>
              {label}
            </button>
          ))}
          <button onClick={() => scrollToAnchor('salt-inspector')} style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>
            Salt Inspector
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .pf-desktop-nav { display: none !important; }
          .pf-mobile-btn { display: block !important; }
          .pf-search-text { display: none; }
        }
      `}</style>
    </header>
  );
}
