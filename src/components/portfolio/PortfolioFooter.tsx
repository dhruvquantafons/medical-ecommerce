import Link from 'next/link';
import type { Category } from '@/data/types';
import { Logo } from './Logo';
import { BRAND, CONTACT_HREF } from './copy';

/*
  Footer for the company pages (changeui.md, Problem 05): light surface, top border, no gradient,
  no headline, no call to action. Every link is a real route.
  TODO(owner): company address, phone, email and licence numbers (shown here once supplied).
  TODO(owner): add a Help column (FAQ, Shipping and returns, Privacy policy, Terms) once those pages exist.
*/
export function PortfolioFooter({ collections }: { collections: Category[] }) {
  const columns = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/portfolio/about' },
        { label: 'Team', href: '/portfolio/team' },
        { label: 'Contact', href: CONTACT_HREF },
      ],
    },
    {
      title: 'Catalog',
      links: [
        { label: 'All formulations', href: '/portfolio/catalog' },
        { label: 'Salt Inspector', href: '/portfolio/salt-inspector' },
      ],
    },
    {
      title: 'Shop',
      links: [
        ...collections.map(c => ({ label: c.name, href: `/collections/${c.slug}` })),
        { label: 'All products', href: '/shop' },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo height={32} />
            <p className="mt-4 max-w-[36ch] text-[14px] text-muted-foreground">
              Pharmaceutical and nutraceutical formulations, sold direct across India.
            </p>
          </div>
          {columns.map(col => (
            <nav key={col.title} aria-labelledby={`pf-footer-${col.title}`}>
              <h2 id={`pf-footer-${col.title}`} className="font-sans text-[12px] font-semibold tracking-normal text-foreground">
                {col.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[14px] text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[12px] text-subtle">
          <p>© {new Date().getFullYear()} {BRAND}</p>
          <p>
            Site by{' '}
            <a href="https://www.blumargins.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              BluMargins Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
