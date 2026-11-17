import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/data/types';
import { Card, RxBadge } from './kit';
import { formatINR } from './copy';

/**
 * Store product card (changeui.md, Problem 13, store variant): photo, collection, name, pack size,
 * price with MRP where discounted. The whole card links to the product page in the store, and lifts
 * on hover and keyboard focus. Prescription items carry the Rx badge on the photo.
 * No stars or review counts: there is no review data with a source (TODO(owner) once there is).
 * TODO(owner): an "Add" button would need the store cart; left out so the company pages do not
 * change cart behaviour.
 */
export function StoreProductCard({ product }: { product: Product }) {
  const discounted = product.mrp > product.price;
  return (
    <Card asChild lift className="group flex h-full flex-col overflow-hidden rounded-[20px]">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-surface">
          {product.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={`${product.name} pack`} loading="lazy" className="pf-card-media size-full object-cover" />
          )}
          {product.rxRequired && <RxBadge className="absolute top-3 left-3 shadow-[var(--pf-shadow-1)]" />}
        </div>
        <div className="flex flex-1 flex-col border-t border-border px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
          {product.categoryName && <p className="text-[13px] font-medium text-primary">{product.categoryName}</p>}
          <h3 className="mt-1 font-display text-[17px] leading-snug font-semibold tracking-[-0.02em] text-foreground">{product.name}</h3>
          <p className="mt-1 text-[14px] text-muted-foreground">{product.packSize}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <p className="text-[17px] tabular-nums">
              <span className="font-semibold text-foreground">{formatINR(product.price)}</span>
              {discounted && (
                <>
                  {' '}
                  <span className="text-[14px] text-subtle line-through">
                    <span className="sr-only">MRP </span>
                    {formatINR(product.mrp)}
                  </span>
                </>
              )}
            </p>
            <ArrowRight
              className="mb-1 size-[18px] -translate-x-1 text-primary opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </Card>
  );
}
