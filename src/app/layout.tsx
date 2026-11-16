import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { company } from "@/content/site";
import { defaultShareImage } from "@/lib/seo";
import { ToastViewport } from "@/components/ui/Toast";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

// Exposed to Tailwind as --font-display, --font-sans and --font-mono in globals.css.
const display = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], weight: ["500"], display: "swap" });
const sans = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

// Pages read live prices, stock, orders and sessions from the database on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: `${company.name}: ${company.tagline}`, template: `%s | ${company.name}` },
  description: company.description,
  applicationName: company.name,
  // Default share data; each public page sets its own title, description and canonical URL (lib/seo.ts).
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_IN",
    title: company.name,
    description: company.description,
    images: [defaultShareImage],
  },
  twitter: { card: "summary_large_image", title: company.name, description: company.description, images: [defaultShareImage.url] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(display.variable, sans.variable, mono.variable, "h-full scroll-smooth antialiased")}>
      <body className="flex min-h-full flex-col font-sans">
        <TooltipProvider>
          {children}
          <ToastViewport />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
