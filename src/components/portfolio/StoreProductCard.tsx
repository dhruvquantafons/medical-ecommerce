import Link from 'next/link';
import type { Product } from '@/data/types';
import { Badge } from './ui/badge';
import { formatINR } from './copy';

/**
 * Store product card (changeui.md, Problem 13, store variant): square photo on the surface colour,
 * collection, name, one-line description, price with MRP where discounted. The whole card links to
 * the product page in the store. No stars or review counts.
 * TODO(owner): an "Add" button (Aceternity Stateful Button) would need the store cart; left out so
 * the company pages do not change cart behaviour.
 */
export function StoreProductCard({ product }: { product: Product }) {
  const discounted = product.mrp > product.price;
  return (
    <Link href={`/product/${product.slug}`} className="group relative flex h-full flex-col rounded-lg">
      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-surface transition-colors group-hover:border-foreground/40">
        {product.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={`${product.name} pack`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      {product.categoryName && (
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">{product.categoryName}</p>
      )}
      <h3 className="mt-1 text-lg font-medium text-foreground group-hover:underline group-hover:underline-offset-4">{product.name}</h3>
      <p className="mt-1 line-clamp-2 text-[15px] text-muted-foreground">{product.packSize}</p>
      {product.rxRequired && <Badge className="mt-3">Prescription required</Badge>}
      <p className="mt-auto pt-3 text-base">
        <span className="font-medium text-foreground">{formatINR(product.price)}</span>
        {discounted && (
          <>
            {' '}
            <span className="text-sm text-subtle line-through">
              <span className="sr-only">MRP </span>
              {formatINR(product.mrp)}
            </span>
          </>
        )}
      </p>
    </Link>
  );
}
