"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Employee } from '@/lib/employees';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Container, Label, Reveal, SectionHeading } from '../site';
import { BRAND, CONTACT_HREF } from '../copy';

/*
  Team (changeui.md, Problem 17). People come from Admin -> Employees.
  Portraits are shown in monochrome (a CSS filter; the image files are unchanged) so photos from
  different sources sit together as one set.
  TODO(owner): the current entries look like placeholders (invented names, stock photos). Replace them
  with real people: name, role, qualification, a two-sentence biography and a portrait at least
  800px square on a plain background.
*/
export function TeamPage({ members }: { members: Employee[] }) {
  const [selected, setSelected] = useState<Employee | null>(null);

  return (
    <>
      <section aria-labelledby="pf-page-title" className="border-b border-border bg-tint">
        <Container className="pt-16 pb-14 md:pt-24 md:pb-20">
          <Reveal className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
            <SectionHeading as="h1" id="pf-page-title" title="Team" />
            <p className="max-w-[44ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[20px] lg:justify-self-end">
              The people who develop, test and review {BRAND} formulations.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <h2 className="sr-only">Team members</h2>
        {members.length === 0 ? (
          <p className="text-muted-foreground">Team profiles will appear here soon.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3">
            {members.map(m => {
              const body = (
                <>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface">
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photoUrl}
                        alt={`Portrait of ${m.name}`}
                        loading="lazy"
                        className="size-full object-cover contrast-[1.05] grayscale"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-display text-7xl font-semibold text-subtle" aria-hidden="true">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 border-t border-foreground/70 pt-3">
                    <h3 className="font-display text-[24px] leading-[1.1] font-semibold tracking-[-0.03em] text-foreground md:text-[28px]">{m.name}</h3>
                  </div>
                  <p className="mt-2 text-[16px] text-muted-foreground">{m.role}</p>
                </>
              );
              return (
                <li key={m.id} className="min-w-0">
                  {m.bio.trim() ? (
                    <button type="button" onClick={() => setSelected(m)} className="group block w-full rounded-2xl text-left">
                      {body}
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                        Read biography<span className="sr-only"> of {m.name}</span>
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    </button>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-20 border-t border-border pt-6 text-[16px] text-muted-foreground">
          To reach the team, use the{' '}
          <Link href={CONTACT_HREF} className="rounded-sm font-medium text-primary underline underline-offset-4">contact form</Link>
        </p>
      </Container>

      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        {selected && (
          <DialogContent className="rounded-2xl sm:p-8">
            <DialogHeader className="pr-10 text-left">
              <Label>{selected.role}</Label>
              <DialogTitle className="font-display text-[40px] leading-[1.1] font-semibold tracking-[-0.03em]">{selected.name}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="whitespace-pre-line text-[16px] leading-[1.6] text-foreground">{selected.bio}</DialogDescription>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
