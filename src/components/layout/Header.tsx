import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { SearchBox } from "./SearchBox";
import { PincodeChip } from "./PincodeChip";
import { CartLink } from "./CartLink";
import { LoginButton } from "./LoginButton";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-lg font-black text-white">+</span>
      <span className="text-xl font-extrabold tracking-tight text-brand-700">{site.name}</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:gap-5">
        <Logo />
        <div className="hidden lg:block">
          <PincodeChip />
        </div>
        <div className="hidden flex-1 md:block">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <LoginButton />
          <CartLink />
        </div>
      </div>
      <div className="px-4 pb-2.5 md:hidden">
        <SearchBox />
      </div>
      <nav className="hidden border-t border-line md:block">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="shrink-0 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-brand-600 hover:text-brand-700">
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
