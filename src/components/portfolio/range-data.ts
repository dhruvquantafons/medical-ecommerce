import type { CatalogItem } from '@/lib/catalog-item-types';
import type { Category, Product } from '@/data/types';
import type { RangeTile } from './RangeSection';
import { isPrescription } from './copy';

/** "Bone & Joint" -> "bone and joint". */
export function areaWords(collections: Category[]): string[] {
  return collections.map(c => c.name.replace(/\s*&\s*/g, ' and ').toLowerCase());
}

/**
 * One tile per store collection (photo = first product in it with a photo), plus a wide tile for the
 * prescription formulations in the catalogue when there are any. All values come from the data.
 */
export function buildRangeTiles(collections: Category[], products: Product[], items: CatalogItem[]): RangeTile[] {
  const tiles: RangeTile[] = [];

  const rx = items.filter(i => isPrescription(i.category));
  if (rx.length > 0) {
    const withImage = rx.find(i => i.imageUrl);
    tiles.push({
      name: 'Prescription medicines',
      description: 'Tablets, capsules and injectables dispensed on prescription, each listed with its full composition.',
      href: '/portfolio/catalog?type=rx',
      count: rx.length,
      countNoun: 'formulation',
      image: withImage?.imageUrl ? { src: withImage.imageUrl, alt: `${withImage.name} pack`, fit: 'contain' } : undefined,
      wide: true,
    });
  }

  for (const c of collections) {
    const inArea = products.filter(p => p.categorySlug === c.slug);
    if (inArea.length === 0) continue;
    const withImage = inArea.find(p => p.images.length > 0);
    tiles.push({
      name: c.name,
      description: c.description,
      href: `/collections/${c.slug}`,
      count: inArea.length,
      countNoun: 'product',
      image: withImage ? { src: withImage.images[0], alt: `${withImage.name} pack` } : undefined,
    });
  }

  return tiles;
}
