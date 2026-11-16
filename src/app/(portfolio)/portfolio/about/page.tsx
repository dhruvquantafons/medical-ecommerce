import type { Metadata } from 'next';
import { getCatalogItems } from '@/lib/catalog-items';
import { getCategories, getProducts } from '@/lib/catalog';
import { AboutPage } from '@/components/portfolio/pages/AboutPage';
import { buildRangeTiles } from '@/components/portfolio/range-data';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Syncytium Health is a pharmaceutical and nutraceutical company that makes its own formulations and publishes the full composition of every product.',
};

export default async function PortfolioAboutPage() {
  const [items, products, collections] = await Promise.all([getCatalogItems(), getProducts({}), getCategories()]);
  return <AboutPage products={products} tiles={buildRangeTiles(collections, products, items)} />;
}
