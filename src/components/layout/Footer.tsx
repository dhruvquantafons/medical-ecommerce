import Link from "next/link";
import { site } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import { ButtonLink } from "@/components/ui/Button";

const payMethods = ["UPI", "Visa", "Mastercard", "RuPay", "Net banking", "Cash on delivery"];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">{title}</p>
      <ul className="space-y-2.5 text-[15px]">{children}</ul>
    </div>
  );
}

const link = "text-white/85 transition-colors hover:text-white";

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="mx-3 mt-16 mb-3 rounded-3xl bg-brand-800 text-white md:mx-6 md:mb-6">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-8 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="display text-4xl text-white md:text-5xl">
              Health that starts <em>from within.</em>
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/70">{site.tagline}, made in India and delivered to your door.</p>
            <ButtonLink href="/shop" variant="lime" size="lg" className="mt-6">
              Shop the range
            </ButtonLink>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <Column title="Shop">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link className={link} href={`/collections/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li><Link className={link} href="/shop">All products</Link></li>
            </Column>
            <Column title="Help">
              <li><Link className={link} href="/store#faq">FAQ</Link></li>
              <li><a className={link} href={`mailto:${site.supportEmail}`}>Contact us</a></li>
              <li><span className="text-white/60">Shipping & returns</span></li>
              <li><span className="text-white/60">Privacy policy</span></li>
            </Column>
            <Column title="Account">
              <li><Link className={link} href="/account/orders">My orders</Link></li>
              <li><Link className={link} href="/account/addresses">Addresses</Link></li>
              <li><Link className={link} href="/cart">Cart</Link></li>
              <li><span className="text-white/60">{site.supportPhone}</span></li>
            </Column>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
          <span className="mr-1 text-xs text-white/60">We accept</span>
          {payMethods.map((m) => (
            <span key={m} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/80">
              {m}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-white/50">
          These statements have not been evaluated as medical advice. Our products are food supplements and are not intended to diagnose, treat, cure or prevent any disease.
          Consult your doctor before use if you are pregnant, nursing, taking medication or have a medical condition. Product information and prices on this site are demo content.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span className="display text-2xl text-white/80">{site.shortName}</span>
        </div>
      </div>
    </footer>
  );
}
