import type { Metadata } from 'next';
import { getCatalogItems } from '@/lib/catalog-items';
import { CatalogPage } from '@/components/portfolio/pages/CatalogPage';

export const metadata: Metadata = {
  title: 'Product catalog',
  description:
    'Every Syncytium Health formulation, prescription and over the counter, with the active ingredients and amount per unit of each.',
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PortfolioCatalogPage({ searchParams }: PageProps<'/portfolio/catalog'>) {
  const [items, sp] = await Promise.all([getCatalogItems(), searchParams]);
  return (
    <CatalogPage
      items={items}
      initial={{ q: one(sp.q), type: one(sp.type), form: one(sp.form), item: one(sp.item) }}
    />
  );
}
