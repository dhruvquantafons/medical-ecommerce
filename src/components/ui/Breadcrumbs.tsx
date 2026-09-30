import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3" />}
          {it.href ? (
            <Link href={it.href} className="hover:text-brand-700">
              {it.label}
            </Link>
          ) : (
            <span className="line-clamp-1 text-ink">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
