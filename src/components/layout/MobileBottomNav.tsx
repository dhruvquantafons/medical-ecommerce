"use client";

import { House, LayoutGrid, ShoppingCart, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useCartCount } from "./CartLink";

const items = [
  { href: "/", label: "Home", icon: House },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/upload-prescription", label: "Upload Rx", icon: Upload },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
];

export function MobileBottomNav() {
  const path = usePathname();
  const count = useCartCount();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white md:hidden">
      {items.map(({ href, label, icon: I }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} className={clsx("relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium", active ? "text-brand-700" : "text-muted")}>
            <I className="size-5" />
            {label}
            {href === "/cart" && count > 0 && (
              <span className="absolute top-1 left-1/2 ml-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
