import { company } from "@/content/site";
import { getCategories, getProducts } from "@/lib/catalog";
import { getCatalogItems, parseSalts } from "@/lib/catalog-items";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/site/Logo";
import { Navbar, NavBody, NavLink, type NavItem } from "@/components/ui/resizable-navbar";
import { SearchCommand, type SearchEntry } from "./SearchCommand";
import { CartLink } from "./CartLink";
import { AccountMenu } from "./AccountMenu";
import { CollectionsMenu } from "./CollectionsMenu";
import { MobileMenu } from "./MobileMenu";

export { Logo };

const products: NavItem = { name: "Products", link: "/products" };
const about: NavItem = { name: "About", link: "/about" };
const contact: NavItem = { name: "Contact", link: "/contact" };
const team: NavItem = { name: "Team", link: "/team" };

/** The one header for every public route: logo, main navigation, search, account and cart. */
export async function Header() {
  const [categories, session, storeProducts, catalog] = await Promise.all([getCategories(), getSession(), getProducts({}), getCatalogItems()]);
  const user = session && { name: session.user.name, email: session.user.email, isAdmin: session.user.role === "admin" };

  const search: SearchEntry[] = [
    ...storeProducts.map((p) => ({ id: p.id, name: p.name, detail: p.composition, href: `/product/${p.slug}`, group: "shop" as const })),
    ...catalog.map((c) => ({
      id: c.id,
      name: c.name,
      detail: parseSalts(c.salts).map((s) => s.name).join(", "),
      href: `/products?item=${encodeURIComponent(c.id)}`,
      group: "products" as const,
    })),
  ];

  const mobileItems: NavItem[] = [products, { name: "Shop", link: "/shop", match: ["/collections", "/store"] }, about, ...(company.hasTeam ? [team] : []), contact];

  return (
    <Navbar>
      <NavBody>
        <Logo size="header" className="mr-auto lg:mr-0" />
        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            <li><NavLink item={products} /></li>
            <li><CollectionsMenu categories={categories} /></li>
            <li><NavLink item={about} /></li>
            {company.hasTeam && <li><NavLink item={team} /></li>}
            <li><NavLink item={contact} /></li>
          </ul>
        </nav>
        <div className="flex items-center gap-0.5">
          <SearchCommand entries={search} />
          <div className="hidden lg:block">
            <AccountMenu user={user} />
          </div>
          <CartLink />
          <MobileMenu items={mobileItems} categories={categories} user={user} />
        </div>
      </NavBody>
    </Navbar>
  );
}
