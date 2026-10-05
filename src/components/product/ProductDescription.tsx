import clsx from "clsx";
import type { DescriptionBlock } from "@/lib/description";

/** Renders a parsed product description: headings, bullet lists and paragraphs. */
export function ProductDescription({ blocks, className }: { blocks: DescriptionBlock[]; className?: string }) {
  return (
    <div className={clsx("space-y-3", className)}>
      {blocks.map((b, i) =>
        b.type === "h" ? (
          <h3 key={i} className={clsx("text-sm font-semibold tracking-wide text-ink uppercase", i > 0 && "pt-3")}>
            {b.text}
          </h3>
        ) : b.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-brand-600">
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{b.text}</p>
        ),
      )}
    </div>
  );
}
