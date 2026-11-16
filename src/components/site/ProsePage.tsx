import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

/**
 * Long-form text page (legal, help): h1, an optional lead, and body copy at a 65-character measure.
 * Body elements are styled here so pages can be written as plain HTML.
 */
export function ProsePage({
  title,
  lead,
  draft,
  updated,
  children,
}: {
  title: string;
  lead?: ReactNode;
  /** Show the "Draft for legal review" notice. */
  draft?: boolean;
  /** Human-readable "last updated" date. */
  updated?: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-16 md:py-24">
      <article className="mx-auto max-w-prose">
        {draft && (
          <p role="note" className="mb-8 rounded-control border border-warning/30 bg-warning/5 px-4 py-3 text-[15px] text-warning">
            <strong className="font-medium">Draft for legal review.</strong> This text has not been approved and is not yet binding.
          </p>
        )}
        <h1 className="font-display text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">{title}</h1>
        {lead && <p className="mt-5 text-lg text-ink-muted">{lead}</p>}
        {updated && <p className="mt-3 text-sm text-ink-subtle">Last updated {updated}</p>}
        <div className={cn(prose, "mt-10")}>{children}</div>
      </article>
    </Container>
  );
}

const prose = cn(
  "text-base text-ink",
  "[&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-[-0.02em] [&_h2]:text-ink first:[&_h2]:mt-0",
  "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-ink",
  "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
  "[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-brand-hover",
);
