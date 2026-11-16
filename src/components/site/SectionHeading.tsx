import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Optional small uppercase label above the title. Plain text: no pill, no icon. */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** One sentence under the title. */
  lead?: ReactNode;
  /** Use "h1" once per page (the page title); sections use "h2". */
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  className?: string;
};

const titleSize = {
  h1: "text-4xl md:text-5xl",
  h2: "text-3xl md:text-4xl",
  h3: "text-2xl md:text-3xl",
} as const;

/** Eyebrow, heading and lead in the marketing type style. The heading is always a single colour. */
export function SectionHeading({ eyebrow, title, lead, as: Tag = "h2", align = "start", className }: SectionHeadingProps) {
  return (
    <div className={cn("flex max-w-prose flex-col gap-3", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && <p className="text-sm font-medium tracking-[0.08em] text-muted-foreground uppercase">{eyebrow}</p>}
      <Tag className={cn("font-display font-medium tracking-[-0.02em] text-ink", titleSize[Tag])}>{title}</Tag>
      {lead && <p className="text-lg text-muted-foreground">{lead}</p>}
    </div>
  );
}
