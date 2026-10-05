import { getCatalogItems } from '@/lib/catalog-items';
import { CatalogPage } from '@/components/portfolio/pages/CatalogPage';

export default async function PortfolioCatalogPage() {
  const items = await getCatalogItems();
  return <CatalogPage items={items} />;
}
