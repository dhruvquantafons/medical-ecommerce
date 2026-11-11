import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Tablet } from "lucide-react";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { default: "MR Visual Aid", template: `%s | ${site.name} MR` },
  description: "Medicine visual-aid folders for field presentation.",
  robots: { index: false, follow: false },
};

export default function MrLayout({ children }: LayoutProps<"/mr">) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <Link href="/mr" className="flex items-center overflow-visible" aria-label={`${site.name} MR Folders`}>
            <Image
              src="/brand/logo.png"
              alt={site.name}
              width={290}
              height={120}
              style={{ height: "96px", width: "auto", marginTop: "-20px", marginBottom: "-20px" }}
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 ring-1 ring-brand-200">
              <Tablet className="size-3.5 text-brand-600" />
              <span>MR Visual Aid</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
}

