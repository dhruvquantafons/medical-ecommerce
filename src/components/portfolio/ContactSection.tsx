import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { company } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ContactForm } from "./ContactForm";

/** Slim contact band for the landing page (changeui.md Problem 15). */
export function ContactBand() {
  return (
    <section id="contact" className="border-t border-line bg-surface">
      <Container className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <p className="max-w-prose text-lg text-ink">Questions about a product, an order or working with us? Send us a message.</p>
        <ButtonLink href="/contact" size="lg">
          Contact us <ArrowRight aria-hidden />
        </ButtonLink>
      </Container>
    </section>
  );
}

/**
 * The /contact page (changeui.md Problem 15): the form on the left; on the right, the contact details
 * from content/site.ts (each shown only when known) and where order questions go.
 */
export function ContactPageContent({ defaultMessage }: { defaultMessage?: string }) {
  const details: { Icon: typeof Mail; label: string; value: ReactNode }[] = [];
  if (company.email) details.push({ Icon: Mail, label: "Email", value: <a href={`mailto:${company.email}`} className="hover:text-brand">{company.email}</a> });
  if (company.phone)
    details.push({ Icon: Phone, label: "Phone", value: <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-brand">{company.phone}</a> });
  if (company.hours) details.push({ Icon: Clock, label: "Hours", value: company.hours });
  if (company.address) details.push({ Icon: MapPin, label: "Address", value: company.address.join(", ") });

  return (
    <Container className="py-16 md:py-24">
      <SectionHeading as="h1" title="Contact us" lead="Send us a message about our products, an order or working with us, and we will reply by email." />
      <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <ContactForm defaultMessage={defaultMessage} />
        </div>
        <aside className="flex flex-col gap-8 md:col-span-5">
          {details.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-ink">Contact details</h2>
              <ul className="mt-4 flex flex-col gap-4">
                {details.map(({ Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3 text-[15px]">
                    <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-muted" />
                    <span>
                      <span className="block text-sm text-ink-muted">{label}</span>
                      <span className="text-ink">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-card border border-line bg-surface p-6">
            <h2 className="text-lg font-medium text-ink">Questions about an order?</h2>
            <p className="mt-2 text-[15px] text-ink-muted">
              Every order, its status and its tracking link are in{" "}
              <Link href="/account/orders" className="text-brand underline underline-offset-4">
                your orders
              </Link>
              . Delivery and returns are explained on the{" "}
              <Link href="/shipping-returns" className="text-brand underline underline-offset-4">
                shipping and returns
              </Link>{" "}
              page.
            </p>
          </div>
        </aside>
      </div>
      {/* No map: there is no confirmed address yet (content/site.ts). */}
    </Container>
  );
}
