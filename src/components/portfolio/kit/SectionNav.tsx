"use client";

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Sticky "On this page" bar for long company pages. Sits under the site header, highlights the
 * section being read (a pill slides between links) and scrolls to a section with the header and
 * this bar taken into account. Links are real anchors, so it works without JavaScript too.
 * Each item's id must be the id of a section on the page.
 */
export function SectionNav({ items, label = 'On this page' }: { items: { id: string; label: string }[]; label?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items.map(i => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        // The first section (in page order) crossing the reading line is the current one.
        const current = items.find(i => visible.get(i.id));
        setActive(current?.id ?? null);
      },
      // A thin band a third of the way down the viewport acts as the reading line.
      { rootMargin: '-30% 0px -65% 0px' },
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector<HTMLElement>('[data-portfolio] header');
    const bar = e.currentTarget.closest<HTMLElement>('[data-section-nav]');
    const offset = (header?.offsetHeight ?? 0) + (bar?.offsetHeight ?? 0) - 1;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', `#${id}`);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  return (
    <nav
      data-section-nav
      aria-label={label}
      className="sticky top-14 z-30 border-b border-border bg-white md:top-16"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <ul className="pf-no-scrollbar relative -mx-1 flex gap-1 overflow-x-auto py-2">
          {items.map(item => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  onClick={e => go(e, item.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'relative flex h-9 items-center rounded-lg px-3.5 text-[14px] font-semibold whitespace-nowrap transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pf-section-nav-pill"
                      className="absolute inset-0 rounded-lg bg-[#efebfd]"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
