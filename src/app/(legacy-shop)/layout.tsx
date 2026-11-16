import { Nunito_Sans } from "next/font/google";
import { Header } from "@/components/legacy-store/layout/Header";
import { Footer } from "@/components/legacy-store/layout/Footer";
import "./legacy-store.css";

const brandFont = Nunito_Sans({ variable: "--font-brand", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

/**
 * /shop keeps the original store design (header, footer, Nunito Sans, soft-violet palette and product cards),
 * at the owner's request. Every other route uses the shared design system. The `.legacy-store` scope in
 * legacy-store.css restores the old tokens for this subtree only.
 */
export default function LegacyShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`legacy-store ${brandFont.variable} flex min-h-full flex-1 flex-col bg-white pt-3 md:pt-4`}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
