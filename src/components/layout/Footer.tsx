import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/data/categories";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-brand-700">{site.name}</p>
          <p className="mt-2 text-sm text-muted">{site.tagline}. Genuine medicines, checked by licensed pharmacists and delivered to your doorstep.</p>
          <p className="mt-4 flex items-center gap-2 text-sm"><Phone className="size-4 text-brand-600" /> {site.supportPhone}</p>
          <p className="mt-1 flex items-center gap-2 text-sm"><Mail className="size-4 text-brand-600" /> {site.supportEmail}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Categories</p>
          <ul className="space-y-2 text-sm text-muted">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}><Link className="hover:text-brand-700" href={`/category/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Services</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-brand-700" href="/search?q=paracetamol">Find substitutes</Link></li>
            <li><Link className="hover:text-brand-700" href="/cart">Your cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Policies</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>Terms & conditions</li>
            <li>Privacy policy</li>
            <li>Return & refund policy</li>
            <li>Shipping policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted">
          Disclaimer: this is a demo storefront with dummy product data. Information on this site is not medical advice. Always consult a registered medical practitioner before taking any medicine. © {new Date().getFullYear()} {site.name}.
        </p>
      </div>
    </footer>
  );
}
