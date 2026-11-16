import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { company } from "@/content/site";
import { ProsePage } from "@/components/site/ProsePage";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: `The terms that apply when you use the ${company.name} website and buy from our online store.`,
  path: "/terms",
});

/*
 * Draft. Facts used: prices are in Indian rupees and include taxes (stated on product pages), payment by
 * Razorpay or cash on delivery, prescription upload at checkout, and the shipping and returns page.
 * TODO(owner): legal review; governing law and jurisdiction; registered company details.
 */
export default function TermsPage() {
  const seller = company.legalName ?? company.name;
  return (
    <ProsePage draft title="Terms" lead={`The terms that apply when you use this website and buy from the ${company.name} online store.`}>
      <h2>About these terms</h2>
      <p>
        This website is operated by {seller}. By using the site or placing an order, you agree to these terms. Please read them with our{" "}
        <Link href="/privacy">privacy policy</Link> and <Link href="/shipping-returns">shipping and returns</Link> page.
      </p>

      <h2>Health information</h2>
      <p>
        Product information on this site is for general information. It is not medical advice and does not replace advice from your doctor.
        Read the label before use.
      </p>

      <h2>Prescription products</h2>
      <p>
        Some products are sold only against a valid prescription, which you upload at checkout. We may decline or cancel an order for these
        products if a valid prescription is not provided.
      </p>

      <h2>Prices and payment</h2>
      <ul>
        <li>Prices are in Indian rupees and include applicable taxes. Delivery charges, if any, are shown at checkout.</li>
        <li>You can pay online through our payment provider or, where offered, in cash on delivery.</li>
        <li>We may correct a price that is shown in error before your order is dispatched. If we do, we will ask you to confirm the order.</li>
      </ul>

      <h2>Orders</h2>
      <p>
        An order is accepted when we confirm it. We may cancel an order if a product is out of stock, if a required prescription is missing,
        or if we cannot deliver to your address. If you have already paid, we will refund you in full.
      </p>
      {/* TODO(owner): refund method and time frame. */}

      <h2>Delivery and returns</h2>
      <p>
        Delivery times, charges and the returns process are described on the <Link href="/shipping-returns">shipping and returns</Link> page.
      </p>

      <h2>Your account</h2>
      <p>Keep your password private. You are responsible for orders placed from your account.</p>

      <h2>Liability</h2>
      {/* TODO(owner): limitation of liability clause, to be written by legal counsel. */}
      <p>Nothing in these terms limits any rights you have under the Consumer Protection Act, 2019.</p>

      <h2>Governing law</h2>
      {/* TODO(owner): governing law and the courts that have jurisdiction. */}
      <p>These terms are governed by the laws of India.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <Link href="/contact">Contact us</Link>.
      </p>
    </ProsePage>
  );
}
