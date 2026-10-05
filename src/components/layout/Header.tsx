import { Search } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import { getSession } from "@/lib/session";
import { SearchBox } from "./SearchBox";
import { CartLink } from "./CartLink";
import { AccountMenu } from "./AccountMenu";
import { CollectionsMenu } from "./CollectionsMenu";
import { MobileMenu } from "./MobileMenu";

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className={`display text-2xl leading-none md:text-[26px] ${light ? "text-white" : "text-brand-800"}`} aria-label={`${site.name} home`}>
      {site.shortName}
    </Link>
  );
}

const navLink = "rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white";

/** Floating dark nav bar. On the home page the hero slides underneath it. */
export async function Header() {
  const [categories, session] = await Promise.all([getCategories(), getSession()]);
  const user = session && { name: session.user.name, email: session.user.email, isAdmin: session.user.role === "admin" };
  return (
    <header className="sticky top-3 z-40 px-3 md:top-4 md:px-6">
      <div className="mx-auto grid h-[60px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center rounded-2xl bg-brand-gradient px-2 shadow-lg shadow-brand-900/15 backdrop-blur md:h-[64px] md:px-4">
        <nav className="flex items-center gap-1" aria-label="Main">
          <MobileMenu categories={categories} user={user} />
          <div className="hidden items-center gap-0.5 lg:flex">
            <Link href="/shop" className={navLink}>Shop</Link>
            <CollectionsMenu categories={categories} />
            <Link href="/#science" className={navLink}>Our science</Link>
            <Link href="/#faq" className={navLink}>FAQ</Link>
          </div>
        </nav>
        <Logo />
        <div className="flex items-center justify-end gap-0.5">
          <div className="hidden w-60 xl:block">
            <SearchBox variant="nav" />
          </div>
          <Link href="/search" aria-label="Search" className="hidden size-10 place-items-center rounded-full text-white hover:bg-white/10 lg:grid xl:hidden">
            <Search className="size-5" />
          </Link>
          <AccountMenu user={user} />
          <CartLink />
        </div>
      </div>
    </header>
  );
}
