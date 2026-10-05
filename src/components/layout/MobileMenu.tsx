"use client";

import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/types";
import { authClient } from "@/lib/auth-client";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { SearchBox } from "./SearchBox";
import type { MenuUser } from "./AccountMenu";

const row = "flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-ink hover:bg-brand-50";

/** Hamburger drawer for small screens: search, collections and account links. */
export function MobileMenu({ categories, user }: { categories: Category[]; user: MenuUser | null }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  // Close whenever the route changes (a link inside was followed).
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  return (
    <>
      <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden">
        <Menu className="size-5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Menu" side="left">
        <div className="space-y-5">
          <SearchBox />
          <nav className="space-y-0.5">
            <Link href="/shop" className={row}>Shop all</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className={row}>
                <Icon name={c.icon} className="size-4 text-brand-600" /> {c.name}
              </Link>
            ))}
            <Link href="/store#science" className={row}>Our science</Link>
            <Link href="/store#faq" className={row}>FAQ</Link>
          </nav>
          <div className="space-y-0.5 border-t border-line pt-4">
            {user ? (
              <>
                <p className="px-3 pb-1 text-xs text-muted">Signed in as {user.email}</p>
                <Link href="/account/orders" className={row}>My orders</Link>
                <Link href="/account/addresses" className={row}>Saved addresses</Link>
                {user.isAdmin && <Link href="/admin" className={row}>Admin panel</Link>}
                <button
                  className={`${row} w-full text-red-600`}
                  onClick={async () => {
                    await authClient.signOut();
                    setOpen(false);
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <LogOut className="size-4" /> Log out
                </button>
              </>
            ) : (
              <Link href={`/login?next=${encodeURIComponent(path)}`} className={row}>Log in / Sign up</Link>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
