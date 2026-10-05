import './portfolio.css';
import { getCatalogItems } from '@/lib/catalog-items';
import { PortfolioShell } from '@/components/portfolio/PortfolioShell';

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const items = await getCatalogItems();
  return <PortfolioShell items={items}>{children}</PortfolioShell>;
}
