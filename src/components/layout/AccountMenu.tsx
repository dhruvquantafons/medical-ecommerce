"use client";

import { ChevronDown, LayoutDashboard, LogOut, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

export interface MenuUser {
  name: string;
  email: string;
  isAdmin: boolean;
}

const itemClass = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700";

export function AccountMenu({ user }: { user: MenuUser | null }) {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    const next = path === "/login" || path === "/signup" ? "/" : path;
    return (
      <Link href={`/login?next=${encodeURIComponent(next)}`} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-gray-100">
        <User className="size-5" />
        <span className="hidden md:inline">Login</span>
      </Link>
    );
  }

  const firstName = user.name.split(" ")[0];
  return (
    <div ref={wrap} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-gray-100"
      >
        <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{firstName[0]?.toUpperCase()}</span>
        <span className="hidden max-w-24 truncate md:inline">{firstName}</span>
        <ChevronDown className="hidden size-4 md:block" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-60 rounded-xl border border-line bg-white p-2 shadow-lg" onClick={() => setOpen(false)}>
          <div className="border-b border-line px-3 pt-1 pb-2">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="pt-1">
            <Link role="menuitem" href="/account/orders" className={itemClass}>
              <Package className="size-4" /> My orders
            </Link>
            <Link role="menuitem" href="/account/addresses" className={itemClass}>
              <MapPin className="size-4" /> Saved addresses
            </Link>
            {user.isAdmin && (
              <Link role="menuitem" href="/admin" className={itemClass}>
                <LayoutDashboard className="size-4" /> Admin panel
              </Link>
            )}
            <button
              role="menuitem"
              className={`${itemClass} text-red-600 hover:bg-red-50 hover:text-red-700`}
              onClick={async () => {
                await authClient.signOut();
                router.push("/");
                router.refresh();
              }}
            >
              <LogOut className="size-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
