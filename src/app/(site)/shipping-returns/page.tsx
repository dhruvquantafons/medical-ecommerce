import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { site } from "@/config/site";
import { company } from "@/content/site";
import { formatPrice } from "@/lib/format";
import { ProsePage } from "@/components/site/ProsePage";

export const metadata: Metadata = pageMetadata({
  title: "Shipping and returns",
  description: `How ${company.name} ships orders across India, what delivery costs, and how to return a product.`,
  path: "/shipping-returns",
});

/*
 * Delivery fee, free-delivery threshold, dispatch time and the 7-day return window are the figures the
 * store already states (src/config/site.ts, product pages and the FAQ). Everything else is draft.
 */
export default function ShippingReturnsPage() {
  return (
    <ProsePage draft title="Shipping and returns" lead="How we deliver your order and what to do if you need to send something back.">
      <h2>Delivery</h2>
      <ul>
        <li>We deliver to addresses across India. Enter your pincode on a product page to check delivery to your area.</li>
        <li>
          Delivery is free on orders above {formatPrice(site.freeDeliveryAbove)}. Below that, a delivery fee of {formatPrice(site.deliveryFee)} is
          added at checkout.
        </li>
        <li>Orders ship within 24 hours and usually arrive in 2–5 days.</li>
        <li>When your order ships, its tracking details appear in <Link href="/account/orders">your orders</Link>.</li>
      </ul>

      <h2>Prescription products</h2>
      <p>Products marked “Prescription required” need a valid prescription, which you upload at checkout.</p>
      {/* TODO(owner): how prescriptions are checked, by whom, and what happens to the order if one cannot be accepted. */}

      <h2>Returns</h2>
      <p>Unopened products can be returned within 7 days of delivery for a full refund.</p>
      <p>
        To start a return, <Link href="/contact">contact us</Link> with your order number. We will tell you how to send the product back.
      </p>
      {/* TODO(owner): return address, who pays return shipping, how refunds are paid and how long they take, and
          any products that cannot be returned (for example opened or temperature-sensitive items). */}

      <h2>Damaged or wrong items</h2>
      <p>If your order arrives damaged or you receive the wrong product, <Link href="/contact">contact us</Link> with your order number and a photo of the item.</p>
      {/* TODO(owner): the time limit for reporting damaged or wrong items, and how they are replaced or refunded. */}
    </ProsePage>
  );
}
