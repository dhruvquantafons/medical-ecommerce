"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { Employee } from '@/lib/employees';
import { FocusCards, type FocusCard } from '../ui/focus-cards';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Container, Reveal, SectionHeading } from '../site';
import { BRAND, CONTACT_HREF } from '../copy';

/*
  Team (changeui.md, Problem 17). People come from Admin -> Employees.
  TODO(owner): the current entries look like placeholders (invented names, stock photos). Replace them
  with real people: name, role, qualification, a two-sentence biography and a portrait at least
  800px square on a plain background.
*/
export function TeamPage({ members }: { members: Employee[] }) {
  const [selected, setSelected] = useState<Employee | null>(null);

  const cards: FocusCard[] = members.map(m => ({
    id: m.id,
    name: m.name,
    role: m.role,
    photoUrl: m.photoUrl,
    hasDetails: m.bio.trim().length > 0,
  }));

  return (
    <Container className="py-16 md:py-24">
      <Reveal>
        <SectionHeading
          as="h1"
          id="pf-page-title"
          title="Our team"
          lead={`The people who develop, test and review ${BRAND} formulations.`}
        />

        <h2 className="sr-only">Team members</h2>
        {members.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Team profiles will appear here soon.</p>
        ) : (
          <div className="mt-12">
            <FocusCards cards={cards} onSelect={card => setSelected(members.find(m => m.id === card.id) ?? null)} />
          </div>
        )}

        <p className="mt-16 border-t border-border pt-6 text-[15px] text-muted-foreground">
          Want to get in touch with the team?{' '}
          <Link href={CONTACT_HREF} className="font-medium text-primary underline underline-offset-4">Contact us</Link>
        </p>
      </Reveal>

      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        {selected && (
          <DialogContent>
            <DialogHeader className="pr-10 text-left">
              <DialogTitle className="font-display text-[32px] font-medium tracking-[-0.02em]">{selected.name}</DialogTitle>
              <p className="text-[15px] text-muted-foreground">{selected.role}</p>
            </DialogHeader>
            <DialogDescription className="whitespace-pre-line text-base text-foreground">{selected.bio}</DialogDescription>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
}
