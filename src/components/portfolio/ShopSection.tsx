"use client";

import Link from 'next/link';
import { RotateCcw, Timer, Truck } from 'lucide-react';
import type { Product } from '@/data/types';
import { site } from '@/config/site';
import { Section } from './site';
import { ActionButton, Carousel, SectionHeader } from './kit';
import { StoreProductCard } from './StoreProductCard';

/**
 * "Shop direct": the store's best sellers (changeui.md, Problem 12) in a snap carousel that is a
 * plain row when every card fits. Service facts are only those the store already states (home page
 * delivery line, FAQ, product page).
 */
export function ShopSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const service = [
    { Icon: Truck, text: `Free delivery above ₹${site.freeDeliveryAbove}` },
    { Icon: Timer, text: 'Ships within 24 hours' },
    { Icon: RotateCcw, text: '7-day returns on unopened products' },
  ];

  return (
    <Section
      id="shop"
      labelledBy="pf-shop-title"
      tone="tint"
      curveFrom="surface"
      reveal
      backdrop={{ washes: [{ at: 'tr', color: 'violet', size: 0.55 }, { at: 'bl', color: 'orchid', size: 0.4 }], pattern: 'dots', patternFrom: 'br' }}
    >
      <SectionHeader
        id="pf-shop-title"
        title="Best sellers in our store"
        lead="Part of the range is sold direct across India, with prices in rupees."
        actions={
          <ActionButton asChild variant="secondary" arrow>
            <Link href="/shop">Shop all products</Link>
          </ActionButton>
        }
      />

      <Carousel
        label="Best sellers"
        className="mt-12"
        itemClassName="basis-[76%] sm:basis-[calc((100%-24px)/2)] lg:basis-[calc((100%-72px)/4)]"
      >
        {products.map(p => (
          <StoreProductCard key={p.id} product={p} />
        ))}
      </Carousel>

      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {service.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-[15px] text-foreground">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#efebfd] text-primary" aria-hidden="true">
              <Icon className="size-[18px]" strokeWidth={1.6} />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </Section>
  );
}
