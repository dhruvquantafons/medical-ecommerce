import { JetBrains_Mono, Manrope } from 'next/font/google';
import './portfolio.css';
import { getCatalogItems } from '@/lib/catalog-items';
import { getCategories } from '@/lib/catalog';
import { PortfolioShell } from '@/components/portfolio/PortfolioShell';

// Company pages only: Manrope for headings and text, JetBrains Mono for amounts, CAS numbers and
// small labels ("Clinical clean", chosen by the owner on 2026-11-16). The store keeps its own fonts.
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono' });

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const [items, collections] = await Promise.all([getCatalogItems(), getCategories()]);
  return (
    <PortfolioShell
      items={items}
      collections={collections}
      fontClassName={`${manrope.variable} ${jetbrainsMono.variable}`}
    >
      {children}
    </PortfolioShell>
  );
}
