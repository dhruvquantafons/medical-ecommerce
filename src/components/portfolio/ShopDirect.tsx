import Link from "next/link";
import { ArrowRight, PackageCheck, RotateCcw, Truck } from "lucide-react";
import type { Product } from "@/data/types";
import { site } from "@/config/site";
import { serviceFacts } from "@/content/landing";
import { formatPrice } from "@/lib/format";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";

/*
 * "Shop direct" (changeui.md Problem 12): one section replacing the old store promotion card and the
 * "Featured Formulations" grid, which did the same job twice. Four best sellers on the shared ProductCard,
 * then the three service facts the store already states.
 */
export function ShopDirect({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const facts = [
    { Icon: Truck, text: `Free delivery above ${formatPrice(site.freeDeliveryAbove)}` },
    { Icon: PackageCheck, text: serviceFacts.dispatch },
    { Icon: RotateCcw, text: serviceFacts.returns },
  ];
  return (
    <Section id="shop-direct" tone="surface">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Store" title="Shop direct" lead="Part of our range is sold direct through our online store." />
        <Link href="/shop" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-brand hover:underline hover:underline-offset-4">
          Shop all products <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      {/* Four columns on desktop; on mobile a horizontally scrolling row with snap, two cards visible. */}
      <ul
        aria-label="Best sellers"
        className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0"
      >
        {products.slice(0, 4).map((p) => (
          <li key={p.id} className="w-[calc(50%-0.375rem)] shrink-0 snap-start md:w-auto">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ink-muted">
        {facts.map(({ Icon, text }) => (
          <li key={text} className="inline-flex items-center gap-2">
            <Icon aria-hidden className="size-4" /> {text}
          </li>
        ))}
      </ul>
    </Section>
  );
}
