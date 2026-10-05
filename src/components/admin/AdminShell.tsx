"use client";

import { ClipboardCheck, ExternalLink, FlaskConical, LayoutDashboard, LayoutGrid, LogOut, Menu, Package, ReceiptText, Users, Users2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { authClient } from "@/lib/auth-client";
import { site } from "@/config/site";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/prescriptions", label: "Prescriptions", icon: ClipboardCheck, badge: "rx" as const },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Collections", icon: LayoutGrid },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/employees", label: "Employees", icon: Users2 },
  { href: "/admin/catalog", label: "Catalog", icon: FlaskConical },
];

export function AdminShell({ user, pendingRx, children }: { user: { name: string; email: string }; pendingRx: number; children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="leading-tight" onClick={() => setOpen(false)}>
          <span className="block text-lg font-extrabold tracking-tight text-white">{site.name}</span>
          <span className="text-xs font-semibold tracking-wider text-brand-200 uppercase">Admin</span>
        </Link>
        <button className="rounded p-1 text-brand-100 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {/* Prescriptions are dormant for the supplement range: only show the queue when something is waiting. */}
        {nav.filter((n) => n.badge !== "rx" || pendingRx > 0 || path.startsWith(n.href)).map(({ href, label, icon: I, exact, badge }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-white text-brand-800 shadow-sm" : "text-brand-100 hover:bg-white/10 hover:text-white",
              )}
            >
              <I className="size-4.5" />
              <span className="flex-1">{label}</span>
              {badge === "rx" && pendingRx > 0 && (
                <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold text-brand-800">{pendingRx}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-brand-100 hover:bg-white/10 hover:text-white">
          <ExternalLink className="size-4" /> View store
        </Link>
        <button
          onClick={async () => {
            await authClient.signOut();
            router.push("/");
            router.refresh();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-brand-100 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" /> Log out
        </button>
        <p className="truncate px-3 pt-1 text-xs text-brand-200" title={user.email}>
          {user.email}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-page">
      {/* The column carries the background for the full page height; the sidebar itself stays pinned. */}
      <div className="hidden w-64 shrink-0 bg-brand-800 lg:block">
        <aside className="sticky top-0 h-screen">{sidebar}</aside>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-brand-800" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-1.5 hover:bg-gray-100">
            <Menu className="size-5" />
          </button>
          <span className="font-extrabold text-brand-700">{site.name} Admin</span>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
