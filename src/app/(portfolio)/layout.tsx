import { Geist, Geist_Mono, Newsreader } from 'next/font/google';
import './portfolio.css';
import { getCatalogItems } from '@/lib/catalog-items';
import { getCategories } from '@/lib/catalog';
import { PortfolioShell } from '@/components/portfolio/PortfolioShell';

// Company pages only: Newsreader for headings, Geist for text, Geist Mono for formulas and CAS numbers.
// The store keeps its own fonts.
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-newsreader' });
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const [items, collections] = await Promise.all([getCatalogItems(), getCategories()]);
  return (
    <PortfolioShell
      items={items}
      collections={collections}
      fontClassName={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}
    >
      {children}
    </PortfolioShell>
  );
}
