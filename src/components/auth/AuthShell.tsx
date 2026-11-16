import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { site } from "@/config/site";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-card border border-line bg-background p-6 md:p-10">
        <h1 className="display text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-ink-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div>}
      <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-muted">
        <ShieldCheck aria-hidden className="size-4" /> Your data is kept private and secure with {site.name}.{" "}
        <Link href="/privacy" className="font-medium text-brand hover:underline">Privacy policy</Link>
      </p>
    </div>
  );
}
