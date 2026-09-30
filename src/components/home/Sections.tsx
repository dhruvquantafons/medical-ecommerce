import { BadgePercent, FileText, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import type { Category, HealthConcern } from "@/data/types";
import { Icon } from "@/components/ui/Icon";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-lg font-bold tracking-tight md:text-xl">{children}</h2>;
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {categories.map((c) => (
        <Link key={c.slug} href={`/category/${c.slug}`} className="card group flex flex-col items-center gap-2 p-3 text-center transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md md:p-4">
          <span className="grid size-12 place-items-center rounded-2xl transition group-hover:scale-110 md:size-14" style={{ background: `${c.color}18`, color: c.color }}>
            <Icon name={c.icon} className="size-6 md:size-7" />
          </span>
          <span className="text-xs font-semibold md:text-sm">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}

export function ConcernGrid({ concerns }: { concerns: HealthConcern[] }) {
  return (
    <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
      {concerns.map((c) => (
        <Link key={c.slug} href={`/search?tag=${c.tag}&label=${encodeURIComponent(c.name)}`} className="group flex flex-col items-center gap-2 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-line transition group-hover:bg-brand-600 group-hover:text-white md:size-16">
            <Icon name={c.icon} className="size-7" />
          </span>
          <span className="text-xs font-medium">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}

const trust = [
  { icon: ShieldCheck, title: "100% genuine", text: "Sourced from licensed distributors" },
  { icon: Truck, title: "Fast delivery", text: "Free delivery above ₹499" },
  { icon: BadgePercent, title: "Best prices", text: "Up to 25% off plus generics" },
  { icon: FileText, title: "Pharmacist verified", text: "Every Rx order is reviewed" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {trust.map(({ icon: I, title, text }) => (
        <div key={title} className="card flex items-center gap-3 p-4">
          <I className="size-8 shrink-0 text-brand-600" />
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-muted">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
