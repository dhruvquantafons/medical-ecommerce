"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { Category } from "@/data/types";

export function CategoryNav({ categories }: { categories: Category[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Categories" className="hidden border-t border-line md:block">
      <div className="no-scrollbar mx-auto flex max-w-7xl overflow-x-auto px-2 [mask-image:linear-gradient(to_right,black_92%,transparent)] xl:justify-between xl:[mask-image:none]">
        {categories.map((c) => {
          const active = path === `/category/${c.slug}`;
          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "shrink-0 border-b-2 px-2.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
                active ? "border-brand-600 text-brand-700" : "border-transparent text-gray-600 hover:border-brand-200 hover:text-brand-700",
              )}
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
