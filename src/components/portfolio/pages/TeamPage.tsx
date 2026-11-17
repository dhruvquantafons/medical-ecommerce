"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Employee } from '@/lib/employees';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Container, Section } from '../site';
import { BRAND, CONTACT_HREF } from '../copy';
import { Backdrop, Badge, Card, Reveal } from '../kit';

/*
  Team (changeui.md, Problem 17). People come from Admin -> Employees.
  Portraits are shown in monochrome (a CSS filter; the image files are unchanged) so photos from
  different sources sit together as one set. A faint brand tint sits over each portrait and lifts
  on hover or keyboard focus, when the role details slide up over the photo.
  No department filter and no careers section (owner decision, 2026-11-17): employees have no
  department field and there are no open roles.
  TODO(owner): the current entries look like placeholders (invented names, stock photos). Replace them
  with real people: name, role, qualification, a two-sentence biography and a portrait at least
  800px square on a plain background.
*/

const rise = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

export function TeamPage({ members }: { members: Employee[] }) {
  const [selected, setSelected] = useState<Employee | null>(null);

  return (
    <>
      <section aria-labelledby="pf-page-title" className="relative isolate overflow-hidden">
        <Backdrop
          washes={[{ at: 'tr', color: 'orchid', size: 0.6 }, { at: 'bl', color: 'violet', size: 0.5 }]}
          pattern="dots"
          patternFrom="tl"
          motif={['a', 'c']}
          motifOpacity={0.7}
          particles
        />
        <Container className="pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
            <h1
              id="pf-page-title"
              className="pf-rise text-[56px] leading-[0.95] tracking-[-0.045em] sm:text-[72px] lg:text-[104px]"
              style={rise(0)}
            >
              Team
            </h1>
            <p className="pf-rise max-w-[44ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[20px] lg:justify-self-end" style={rise(120)}>
              The people who develop, test and review {BRAND} formulations.
            </p>
          </div>
        </Container>
      </section>

      <Section
        tone="tint"
        curveFrom="default"
        className="md:py-24"
        backdrop={{ washes: [{ at: 'r', color: 'violet', size: 0.5 }, { at: 'bl', color: 'orchid', size: 0.45 }], pattern: 'grid', patternFrom: 'top' }}
      >
        <h2 className="sr-only">Team members</h2>
        {members.length === 0 ? (
          <Card className="rounded-[20px] px-6 py-14 text-center text-muted-foreground">Team profiles will appear here soon.</Card>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
            {members.map((m, i) => (
              <Reveal as="li" key={m.id} delay={Math.min(i, 5) * 60} className="min-w-0">
                <MemberCard member={m} onOpen={() => setSelected(m)} />
              </Reveal>
            ))}
          </ul>
        )}

        <Reveal>
          <Card className="mt-20 flex flex-col items-start justify-between gap-4 rounded-[20px] px-6 py-6 sm:flex-row sm:items-center sm:px-8">
            <p className="text-[17px] text-foreground">
              To reach the team, use the{' '}
              <Link href={CONTACT_HREF} className="rounded-sm font-semibold text-primary underline underline-offset-4">
                contact form
              </Link>
            </p>
            <Link
              href={CONTACT_HREF}
              aria-hidden="true"
              tabIndex={-1}
              className="hidden size-11 shrink-0 place-items-center rounded-full bg-[#efebfd] text-primary transition-transform duration-300 hover:translate-x-0.5 sm:grid"
            >
              <ArrowRight className="size-5" strokeWidth={1.75} />
            </Link>
          </Card>
        </Reveal>
      </Section>

      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        {selected && (
          <DialogContent className="overflow-hidden rounded-[24px] border-border p-0 shadow-[var(--pf-shadow-3)] sm:max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="relative aspect-[4/3] bg-surface sm:aspect-auto">
                {selected.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.photoUrl} alt={`Portrait of ${selected.name}`} className="absolute inset-0 size-full object-cover contrast-[1.05] grayscale" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-display text-7xl font-semibold text-subtle" aria-hidden="true">
                    {selected.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <DialogHeader className="gap-3 pr-10 text-left">
                  <Badge tone="brand">{selected.role}</Badge>
                  <DialogTitle className="font-display text-[34px] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[40px]">{selected.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mt-4 whitespace-pre-line text-[16px] leading-[1.65] text-foreground">{selected.bio}</DialogDescription>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

/**
 * Portrait card. With a biography, the whole card is a button that opens it, and on hover or
 * keyboard focus the role and biography slide up over the portrait (on touch screens, tap opens
 * the dialog). Without a biography the card is static.
 */
function MemberCard({ member: m, onOpen }: { member: Employee; onOpen: () => void }) {
  const hasBio = m.bio.trim().length > 0;

  const portrait = (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-border bg-surface shadow-[var(--pf-shadow-1)] transition-shadow duration-500 ease-[var(--ease-out-expo)] group-hover:shadow-[var(--pf-shadow-3)] group-focus-visible:shadow-[var(--pf-shadow-3)]">
      {m.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.photoUrl}
          alt={`Portrait of ${m.name}`}
          loading="lazy"
          className="size-full object-cover contrast-[1.05] grayscale transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
      ) : (
        <div className="flex size-full items-center justify-center font-display text-7xl font-semibold text-subtle" aria-hidden="true">
          {m.name.charAt(0)}
        </div>
      )}
      {/* Brand tint over the monochrome portrait; it lifts on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#3d2e86] opacity-[0.14] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
      />
      {hasBio && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 bottom-2 hidden translate-y-3 rounded-[14px] bg-white/95 p-4 opacity-0 shadow-[var(--pf-shadow-2)] transition-[opacity,transform] duration-400 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:block"
        >
          <p className="text-[13px] font-semibold text-primary">{m.role}</p>
          <p className="mt-1.5 line-clamp-3 text-[14px] leading-[1.5] text-foreground">{m.bio}</p>
        </div>
      )}
    </div>
  );

  const caption = (
    <div className="mt-4 border-t border-foreground/70 pt-3">
      <h3 className="font-display text-[20px] leading-[1.1] font-semibold tracking-[-0.03em] text-foreground sm:text-[24px] md:text-[26px]">{m.name}</h3>
      <p className="mt-1.5 text-[15px] text-muted-foreground sm:text-[16px]">{m.role}</p>
    </div>
  );

  if (!hasBio) {
    return (
      <div className="group">
        {portrait}
        {caption}
      </div>
    );
  }

  return (
    <button type="button" onClick={onOpen} className="group block w-full rounded-[20px] text-left">
      {portrait}
      {caption}
      <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-primary">
        Read biography<span className="sr-only"> of {m.name}</span>
        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true" />
      </span>
    </button>
  );
}
