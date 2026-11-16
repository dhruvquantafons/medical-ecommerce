import type { Metadata } from "next";
import { company } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { ContactPageContent } from "@/components/portfolio/ContactSection";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Send ${company.name} a message about our products, an order or working with us.`,
  path: "/contact",
});

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  // /contact?product=NAME prefills the message (used by "Ask about this product" links).
  const { product } = await searchParams;
  const name = typeof product === "string" ? product.slice(0, 120) : "";
  return <ContactPageContent defaultMessage={name ? `I have a question about ${name}.` : ""} />;
}
