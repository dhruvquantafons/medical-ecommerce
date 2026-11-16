import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** One header and one footer for every public route: company pages, store, account and auth. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-brand px-4 py-2 text-brand-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
