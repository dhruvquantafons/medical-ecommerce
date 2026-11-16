import type { Employee } from "@/lib/employees";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";

/*
 * /team. Only rendered when content/site.ts says a real team exists (company.hasTeam). Interim version
 * (Problems 02, 03): pill, gradient heading, "Back to Home" button and per-person contact buttons are
 * removed. Problem 17 rebuilds the page.
 */
export function TeamPage({ members }: { members: Employee[] }) {
  return (
    <Section>
      <SectionHeading as="h1" title="Our team" />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <li key={m.id}>
            <div className="aspect-[4/5] overflow-hidden rounded-card bg-surface">
              {m.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs on any host
                <img src={m.photoUrl} alt={m.name} className="size-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-full place-items-center font-display text-5xl text-ink-muted">
                  {m.name.charAt(0)}
                </span>
              )}
            </div>
            <h2 className="mt-4 text-lg font-medium text-ink">{m.name}</h2>
            <p className="text-[15px] text-ink-muted">{m.role}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
