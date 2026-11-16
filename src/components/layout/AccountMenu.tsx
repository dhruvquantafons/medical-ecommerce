"use client";

import { LayoutDashboard, LogOut, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

export interface MenuUser {
  name: string;
  email: string;
  isAdmin: boolean;
}

const iconButton = "grid size-11 place-items-center rounded-control text-ink hover:bg-surface";
const itemClass = "flex w-full items-center gap-2.5 rounded-control px-3 py-2.5 text-left text-[15px] text-ink hover:bg-surface";

/** Account control in the header: a login link when signed out, a small menu when signed in. */
export function AccountMenu({ user }: { user: MenuUser | null }) {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onFocus = (e: FocusEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
    };
  }, [open]);

  if (!user) {
    const next = path === "/login" || path === "/signup" ? "/" : path;
    return (
      <Link href={`/login?next=${encodeURIComponent(next)}`} aria-label="Log in" className={iconButton}>
        <User aria-hidden className="size-5" />
      </Link>
    );
  }

  return (
    <div ref={wrap} className="relative">
      <button ref={trigger} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`Account: ${user.name}`} className={iconButton}>
        <User aria-hidden className="size-5" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-64 rounded-card border border-line bg-background p-2 shadow-overlay" onClick={() => setOpen(false)}>
          <div className="border-b border-line px-3 pt-1 pb-2">
            <p className="truncate text-[15px] font-medium text-ink">{user.name}</p>
            <p className="truncate text-sm text-ink-muted">{user.email}</p>
          </div>
          <ul className="pt-1">
            <li>
              <Link href="/account/orders" className={itemClass}>
                <Package aria-hidden className="size-4" /> Orders
              </Link>
            </li>
            <li>
              <Link href="/account/addresses" className={itemClass}>
                <MapPin aria-hidden className="size-4" /> Addresses
              </Link>
            </li>
            {user.isAdmin && (
              <li>
                <Link href="/admin" className={itemClass}>
                  <LayoutDashboard aria-hidden className="size-4" /> Admin panel
                </Link>
              </li>
            )}
            <li>
              <button
                type="button"
                className={`${itemClass} text-danger`}
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/");
                  router.refresh();
                }}
              >
                <LogOut aria-hidden className="size-4" /> Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
