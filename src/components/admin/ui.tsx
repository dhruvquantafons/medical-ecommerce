import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { PaymentStatus } from "@/data/types";
import { paymentStatusLabel } from "@/lib/order-labels";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "default", href }: { label: string; value: string; hint?: ReactNode; tone?: "default" | "warn"; href?: string }) {
  const body = (
    <>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className={clsx("mt-1 text-xs", tone === "warn" ? "font-semibold text-amber-700" : "text-muted")}>{hint}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="card block p-5 transition hover:border-brand-200 hover:shadow-md">{body}</Link>
  ) : (
    <div className="card p-5">{body}</div>
  );
}

const paymentTone: Record<PaymentStatus, string> = {
  paid: "bg-green-50 text-green-700 ring-green-200",
  cod: "bg-gray-50 text-gray-700 ring-gray-200",
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={clsx("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1", paymentTone[status])}>{paymentStatusLabel[status]}</span>;
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}
export const th = "border-b border-line bg-gray-50/80 px-4 py-3 text-xs font-bold tracking-wider text-gray-500 uppercase";
export const td = "border-b border-line px-4 py-3 align-middle";

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-4 py-14 text-center">
      <p className="font-semibold">{title}</p>
      {text && <p className="text-sm text-muted">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Page links that keep the current filters (plain links, so they work without JavaScript). */
export function Pagination({ page, pages, basePath, params }: { page: number; pages: number; basePath: string; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    if (p > 1) sp.set("page", String(p));
    else sp.delete("page");
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const btn = "inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold";
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between">
      <p className="text-sm text-muted">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? <Link href={href(page - 1)} className={clsx(btn, "hover:border-brand-500")}><ChevronLeft className="size-4" /> Previous</Link> : <span className={clsx(btn, "opacity-40")}><ChevronLeft className="size-4" /> Previous</span>}
        {page < pages ? <Link href={href(page + 1)} className={clsx(btn, "hover:border-brand-500")}>Next <ChevronRight className="size-4" /></Link> : <span className={clsx(btn, "opacity-40")}>Next <ChevronRight className="size-4" /></span>}
      </div>
    </nav>
  );
}

export const inputClass = "h-10 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

/** Plain GET form for list filters: submitting updates the URL, which the server page reads. */
export function FilterBar({ children }: { children: ReactNode }) {
  return <form method="get" className="mb-4 flex flex-wrap items-end gap-2">{children}</form>;
}

export function pageParam(v: string | string[] | undefined) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export function strParam(v: string | string[] | undefined) {
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s || undefined;
}
