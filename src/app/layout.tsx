import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/config/site";
import { ToastViewport } from "@/components/ui/Toast";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ variable: "--font-brand", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Pages read live prices, stock, orders and sessions from the database on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: "Order medicines, healthcare products and wellness essentials online with fast home delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
