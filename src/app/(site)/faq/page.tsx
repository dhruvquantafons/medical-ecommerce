import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { company } from "@/content/site";
import { faqs } from "@/data/home";
import { ProsePage } from "@/components/site/ProsePage";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: `Answers to common questions about ${company.name} products, prescriptions, delivery and returns.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <ProsePage title="Frequently asked questions" lead="Common questions about our products, prescriptions, delivery and returns.">
      {faqs.map((f) => (
        <section key={f.q}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </section>
      ))}
      <h2>Still have a question?</h2>
      <p>
        <Link href="/contact">Send us a message</Link> and we will reply by email. For an existing order, see{" "}
        <Link href="/account/orders">your orders</Link>.
      </p>
    </ProsePage>
  );
}
