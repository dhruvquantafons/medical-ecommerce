"use client";

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import type { Category } from '@/data/types';
import { Logo } from './Logo';
import { BRAND, CONTACT_HREF } from './copy';

/*
  Footer for the company pages: a brand column and three link columns on a 12-column grid, then a
  base row. Every link is a real route.
  TODO(owner): company address, phone, email and licence numbers (a "Contact" column goes here
  once supplied).
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

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-16 pb-8 sm:px-6 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5 lg:col-span-6">
            <Logo height={34} />
            <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.6] text-muted-foreground">
              Pharmaceutical and nutraceutical formulations, sold direct across India.
            </p>
          </div>

          {columns.map((col, i) => (
            <nav
              key={col.title}
              aria-labelledby={`pf-footer-${col.title}`}
              className={i === 2 ? 'col-span-2 sm:col-span-1 md:col-span-3 lg:col-span-2' : 'col-span-1 md:col-span-2'}
            >
              <h2 id={`pf-footer-${col.title}`} className="text-[14px] font-semibold tracking-normal text-foreground">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="rounded-sm text-[15px] text-muted-foreground underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-foreground hover:decoration-current"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border pt-6 text-[13px] text-subtle">
          <p>© {new Date().getFullYear()} {BRAND}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p>
              Site by{' '}
              <a
                href="https://www.blumargins.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm underline underline-offset-4 hover:text-foreground"
              >
                BluMargins Technologies
              </a>
            </p>
            <button
              type="button"
              onClick={toTop}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-3.5 text-[13px] font-medium text-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#a9a2bf] hover:shadow-[var(--pf-shadow-1)]"
            >
              <ArrowUp className="size-3.5" strokeWidth={2} aria-hidden="true" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
