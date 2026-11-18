"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Logo } from './Logo';
import { NAV_LINKS } from './copy';

interface NavbarProps {
  onSearchClick: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '/portfolio';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Solid white header with a bottom border: 64px desktop, 56px mobile. No blur, no gradient. */
export function Navbar({ onSearchClick }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 md:h-16">
        <Link href="/" className="shrink-0 rounded-md" aria-label="Syncytium Health home">
          <Logo height={30} priority />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex h-11 items-center rounded-md px-3 text-[15px] transition-colors',
                      active ? 'font-medium text-foreground underline decoration-primary decoration-2 underline-offset-8' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onSearchClick} aria-label="Search products">
            <Search className="size-5" aria-hidden="true" />
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/store">
              Shop
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>

          {/* Mobile menu: shadcn sheet with large plain links (changeui.md, Problem 04). */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
              <SheetHeader className="h-14 justify-center border-b border-border px-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
                <Logo height={26} />
              </SheetHeader>
              <nav aria-label="Main" className="flex flex-col px-4 py-4">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(pathname, href) ? 'page' : undefined}
                    className="border-b border-border py-4 font-display text-[26px] font-semibold tracking-[-0.03em] text-foreground aria-[current=page]:text-primary"
                  >
                    {label}
                  </Link>
                ))}
                <Button asChild className="mt-6">
                  <Link href="/store" onClick={() => setMenuOpen(false)}>
                    Shop the store
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
