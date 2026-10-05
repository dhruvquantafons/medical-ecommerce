import { getCatalogItems } from '@/lib/catalog-items';
import { PortfolioHome } from '@/components/portfolio/PortfolioHome';

export default async function PortfolioHomePage() {
  const items = await getCatalogItems();
  return <PortfolioHome items={items} />;
}
