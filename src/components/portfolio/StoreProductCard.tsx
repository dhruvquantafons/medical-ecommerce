import Link from 'next/link';
import type { Product } from '@/data/types';
import { Label, RxTag } from './site';
import { formatINR } from './copy';

/**
 * Store product card (changeui.md, Problem 13, store variant): photo, collection, name, pack size,
 * price with MRP where discounted. The whole card links to the product page in the store.
 * No stars or review counts.
 * TODO(owner): an "Add" button would need the store cart; left out so the company pages do not
 * change cart behaviour.
 */
export function StoreProductCard({ product }: { product: Product }) {
  const discounted = product.mrp > product.price;
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-background p-2 transition-[border-color,box-shadow] duration-200 hover:border-foreground/25 hover:shadow-[0_12px_32px_-12px_rgba(23,21,31,0.18)]"
    >
      <div className="aspect-square overflow-hidden rounded-[8px] bg-surface">
        {product.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={`${product.name} pack`} loading="lazy" className="size-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        {product.categoryName && <Label>{product.categoryName}</Label>}
        <h3 className="font-display tracking-[-0.02em] mt-1 text-[16px] leading-snug font-semibold text-foreground">{product.name}</h3>
        <p className="mt-0.5 text-[14px] text-muted-foreground">{product.packSize}</p>
        {product.rxRequired && <RxTag className="mt-3" />}
        <div className="mt-auto pt-4">
          <p className="text-[16px] tabular-nums">
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
        </div>
      </div>
    </Link>
  );
}
