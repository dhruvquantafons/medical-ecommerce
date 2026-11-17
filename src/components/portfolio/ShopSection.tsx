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
    <Section id="shop" labelledBy="pf-shop-title" tone="surface">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <SectionHeading
          id="pf-shop-title"
          title="Best sellers in our store"
          lead="Part of the range is sold direct across India, with prices in rupees."
        />
        <Link href="/shop" className="inline-flex items-center gap-2 rounded-sm text-[16px] font-medium text-primary underline underline-offset-4">
          Shop all products
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {products.map(p => (
          <li key={p.id} className="min-w-0">
            <StoreProductCard product={p} />
          </li>
        ))}
      </ul>

      <ul className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-6 text-[16px] text-muted-foreground sm:grid-cols-3">
        <li className="flex items-center gap-2"><Truck className="size-[18px] text-subtle" strokeWidth={1.5} aria-hidden="true" />Free delivery above ₹{site.freeDeliveryAbove}</li>
        <li className="flex items-center gap-2"><Timer className="size-[18px] text-subtle" strokeWidth={1.5} aria-hidden="true" />Ships within 24 hours</li>
        <li className="flex items-center gap-2"><RotateCcw className="size-[18px] text-subtle" strokeWidth={1.5} aria-hidden="true" />7-day returns on unopened products</li>
      </ul>
    </Section>
  );
}
