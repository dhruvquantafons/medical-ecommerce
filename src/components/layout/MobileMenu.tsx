"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/types";
import { authClient } from "@/lib/auth-client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { isCurrent, type NavItem } from "@/components/ui/resizable-navbar";
import type { MenuUser } from "./AccountMenu";

const big = "flex min-h-12 items-center rounded-control px-3 font-display text-2xl text-ink hover:bg-surface aria-[current=page]:text-brand";
const small = "flex min-h-11 items-center rounded-control px-3 text-[15px] text-ink hover:bg-surface aria-[current=page]:text-brand";

/** Full-height sheet with large plain links, for screens below the desktop breakpoint. */
export function MobileMenu({ items, categories, user }: { items: NavItem[]; categories: Category[]; user: MenuUser | null }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  // Close whenever the route changes (a link inside was followed).
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  const cur = (href: string) => (path === href ? "page" : undefined);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" aria-label="Open menu" className="grid size-11 place-items-center rounded-control text-ink hover:bg-surface lg:hidden">
          <Menu aria-hidden className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="gap-0 overflow-y-auto p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line pr-2 pl-4">
          <SheetTitle className="text-[15px] font-medium text-ink-muted">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <SheetClose className="grid size-11 place-items-center rounded-control text-ink hover:bg-surface">
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </div>
        <nav aria-label="Mobile" className="flex flex-col gap-8 px-2 py-6">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.link}>
                <Link href={item.link} aria-current={isCurrent(path, item) ? "page" : undefined} className={big}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div>
            <p className="px-3 pb-2 text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">Shop</p>
            <ul className="flex flex-col">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} aria-current={cur(`/collections/${c.slug}`)} className={small}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" aria-current={cur("/shop")} className={small}>
                  All products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="px-3 pb-2 text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">Account</p>
            {user ? (
              <ul className="flex flex-col">
                <li className="px-3 pb-1 text-sm text-ink-muted">Signed in as {user.email}</li>
                <li>
                  <Link href="/account/orders" aria-current={cur("/account/orders")} className={small}>Orders</Link>
                </li>
                <li>
                  <Link href="/account/addresses" aria-current={cur("/account/addresses")} className={small}>Addresses</Link>
                </li>
                {user.isAdmin && (
                  <li>
                    <Link href="/admin" className={small}>Admin panel</Link>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    className={`${small} w-full text-danger`}
                    onClick={async () => {
                      await authClient.signOut();
                      setOpen(false);
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col">
                <li>
                  <Link href={`/login?next=${encodeURIComponent(path)}`} className={small}>Log in</Link>
                </li>
                <li>
                  <Link href="/signup" className={small}>Create an account</Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
