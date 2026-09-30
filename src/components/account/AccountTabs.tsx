"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { href: "/account/orders", label: "My orders" },
  { href: "/account/addresses", label: "Saved addresses" },
];

export function AccountTabs() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 border-b border-line">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={path.startsWith(t.href) ? "page" : undefined}
          className={clsx(
            "-mb-px border-b-2 px-3 py-2 text-sm font-semibold",
            path.startsWith(t.href) ? "border-brand-600 text-brand-700" : "border-transparent text-gray-600 hover:text-brand-700",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
