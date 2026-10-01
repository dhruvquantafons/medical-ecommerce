import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Shop chrome (floating header and footer) for every customer-facing page. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pt-3 md:pt-4">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
