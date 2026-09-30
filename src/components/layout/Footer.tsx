import { Lock, Mail, Phone, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { getCategories } from "@/lib/catalog";

const payMethods = ["UPI", "Visa", "Mastercard", "RuPay", "Net banking", "Cash on delivery"];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold tracking-wider text-white uppercase">{title}</p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

const link = "transition-colors hover:text-white";

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="mt-12 bg-brand-800 text-brand-100/80">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-sm sm:grid-cols-3">
          {[
            { icon: ShieldCheck, text: "100% genuine medicines" },
            { icon: Truck, text: `Free delivery above ₹${site.freeDeliveryAbove}` },
            { icon: Lock, text: "Secure payments by Razorpay" },
          ].map(({ icon: I, text }) => (
            <p key={text} className="flex items-center gap-2.5 font-semibold text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-white/10">
                <I className="size-4" />
              </span>
              {text}
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xl font-extrabold tracking-tight text-white">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm">{site.tagline}. Genuine medicines, checked by licensed pharmacists and delivered to your doorstep.</p>
          <p className="mt-4 flex items-center gap-2 text-sm">
            <Phone className="size-4 text-brand-200" /> {site.supportPhone}
          </p>
          <p className="mt-1.5 flex items-center gap-2 text-sm">
            <Mail className="size-4 text-brand-200" /> {site.supportEmail}
          </p>
        </div>
        <Column title="Categories">
          {categories.slice(0, 6).map((c) => (
            <li key={c.slug}>
              <Link className={link} href={`/category/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </Column>
        <Column title="Shop">
          <li><Link className={link} href="/categories">All categories</Link></li>
          <li><Link className={link} href="/search?sort=discount">Deals & offers</Link></li>
          <li><Link className={link} href="/search?q=paracetamol">Find substitutes</Link></li>
          <li><Link className={link} href="/cart">Your cart</Link></li>
        </Column>
        <Column title="Policies">
          <li>Terms & conditions</li>
          <li>Privacy policy</li>
          <li>Return & refund policy</li>
          <li>Shipping policy</li>
        </Column>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-white">We accept</span>
            {payMethods.map((m) => (
              <span key={m} className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-white/10">
                {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-brand-100/60">
            Disclaimer: this is a demo storefront with dummy product data. Information on this site is not medical advice. Always consult a registered medical practitioner before taking any medicine. © {new Date().getFullYear()} {site.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
