"use client";

import Link from 'next/link';
import { ArrowRight, RotateCcw, Timer, Truck } from 'lucide-react';
import type { Product } from '@/data/types';
import { site } from '@/config/site';
import { Section, SectionHeading } from './site';
import { StoreProductCard } from './StoreProductCard';

/**
 * "Shop direct": the store's best sellers (changeui.md, Problem 12). Service facts are only those the
 * store already states (home page delivery line, FAQ, product page).
 */
export function ShopSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <Section id="shop" labelledBy="pf-shop-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="pf-shop-title"
          eyebrow="Shop direct"
          title="Best sellers in our store"
          lead="Part of the range is sold direct, with prices in rupees."
        />
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary underline underline-offset-4">
          Shop all products
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="relative -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map(p => (
          <li key={p.id} className="w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-auto">
            <StoreProductCard product={p} />
          </li>
        ))}
      </ul>

      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-[15px] text-muted-foreground">
        <li className="flex items-center gap-2"><Truck className="size-4" aria-hidden="true" />Free delivery above ₹{site.freeDeliveryAbove}</li>
        <li className="flex items-center gap-2"><Timer className="size-4" aria-hidden="true" />Ships within 24 hours</li>
        <li className="flex items-center gap-2"><RotateCcw className="size-4" aria-hidden="true" />7-day returns on unopened products</li>
      </ul>
    </Section>
  );
}
