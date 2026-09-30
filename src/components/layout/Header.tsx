import Link from "next/link";
import { site } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import { SearchBox } from "./SearchBox";
import { PincodeChip } from "./PincodeChip";
import { CartLink } from "./CartLink";
import { getSession } from "@/lib/session";
import { AccountMenu } from "./AccountMenu";
import { CategoryNav } from "./CategoryNav";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-900/20">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-xl leading-none font-extrabold tracking-tight text-brand-700">{site.name}</span>
    </Link>
  );
}

export async function Header() {
  const [categories, session] = await Promise.all([getCategories(), getSession()]);
  const user = session && { name: session.user.name, email: session.user.email, isAdmin: session.user.role === "admin" };
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:gap-5">
        <Logo />
        <div className="hidden lg:block">
          <PincodeChip />
        </div>
        <div className="hidden flex-1 md:block">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <AccountMenu user={user} />
          <CartLink />
        </div>
      </div>
      <div className="px-4 pb-2.5 md:hidden">
        <SearchBox />
      </div>
      <CategoryNav categories={categories} />
    </header>
  );
}
