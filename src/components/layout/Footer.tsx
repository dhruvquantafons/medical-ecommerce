import { Banknote, CreditCard, Landmark, Smartphone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { company, developerCredit, supplementDisclaimer } from "@/content/site";
import { getCategories } from "@/lib/catalog";
import { Container } from "@/components/site/Container";
import { Logo } from "@/components/site/Logo";

// Methods the checkout actually offers: Razorpay (UPI, cards, net banking) and cash on delivery.
const payMethods = [
  { label: "UPI", Icon: Smartphone },
  { label: "Cards", Icon: CreditCard },
  { label: "Net banking", Icon: Landmark },
  { label: "Cash on delivery", Icon: Banknote },
];

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">{title}</h2>
      <ul className="mt-4 flex flex-col gap-1">{children}</ul>
    </div>
  );
}

function Item({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-flex min-h-8 items-center text-[15px] text-ink hover:text-brand hover:underline hover:underline-offset-4">
        {children}
      </Link>
    </li>
  );
}

/** The one footer for every public route. Company facts come from content/site.ts and are omitted when unknown. */
export async function Footer() {
  const categories = await getCategories();
  const contactLines = [
    company.address?.join(", "),
    company.phone && <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-brand">{company.phone}</a>,
    company.email && <a href={`mailto:${company.email}`} className="hover:text-brand">{company.email}</a>,
    ...company.licences.map((l) => `${l.label}: ${l.number}`),
  ].filter(Boolean);

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="py-16 md:py-20">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Column title="Company">
            <Item href="/about">About</Item>
            <Item href="/products">Products</Item>
            {company.hasTeam && <Item href="/team">Team</Item>}
            <Item href="/contact">Contact</Item>
          </Column>
          <Column title="Shop">
            {categories.map((c) => (
              <Item key={c.slug} href={`/collections/${c.slug}`}>{c.name}</Item>
            ))}
            <Item href="/shop">All products</Item>
          </Column>
          <Column title="Help">
            <Item href="/faq">FAQ</Item>
            <Item href="/shipping-returns">Shipping and returns</Item>
            <Item href="/privacy">Privacy policy</Item>
            <Item href="/terms">Terms</Item>
          </Column>
          <Column title="Account">
            <Item href="/account/orders">Orders</Item>
            <Item href="/account/addresses">Addresses</Item>
            <Item href="/cart">Cart</Item>
          </Column>
        </nav>

        <div className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-[1fr_auto] md:items-start">
          <div className="flex flex-col gap-3">
            <Logo size="footer" href={null} />
            <p className="max-w-prose text-[15px] text-ink-muted">{company.legalName ?? company.name}</p>
            {contactLines.length > 0 && (
              <ul className="flex flex-col gap-1 text-[15px] text-ink-muted">
                {contactLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-sm text-ink-subtle">We accept</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
              {payMethods.map(({ label, Icon }) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <Icon aria-hidden className="size-4" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-prose text-sm text-ink-subtle">{supplementDisclaimer}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-ink-subtle">
          <p>
            © {new Date().getFullYear()} {company.legalName ?? company.name}
          </p>
          <a href={developerCredit.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            {developerCredit.label}
          </a>
        </div>
      </Container>
    </footer>
  );
}
