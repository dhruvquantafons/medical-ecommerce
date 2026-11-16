import type { Metadata } from 'next';
import { getCatalogItems } from '@/lib/catalog-items';
import { getBestsellers, getCategories, getProducts } from '@/lib/catalog';
import { PortfolioHome } from '@/components/portfolio/PortfolioHome';
import { areaWords, buildRangeTiles } from '@/components/portfolio/range-data';
import { BRAND, POSITIONING, POSITIONING_DESCRIPTION, isPrescription } from '@/components/portfolio/copy';

export const metadata: Metadata = {
  title: { absolute: `${BRAND}: ${POSITIONING}` },
  description: POSITIONING_DESCRIPTION,
};

export default async function PortfolioHomePage() {
  // Read-only use of the store's catalogue queries, for real photos, prices and counts.
  const [items, bestsellers, products, collections] = await Promise.all([
    getCatalogItems(),
    getBestsellers(4),
    getProducts({}),
    getCategories(),
  ]);

  return (
    <PortfolioHome
      items={items}
      bestsellers={bestsellers}
      heroProducts={bestsellers}
      areas={areaWords(collections)}
      hasPrescription={items.some(i => isPrescription(i.category))}
      facts={{ formulations: items.length, storeProducts: products.length, areas: collections.length }}
      tiles={buildRangeTiles(collections, products, items)}
    />
  );
}
