/**
 * Product descriptions are plain text with light formatting, so admins can write them in a textarea:
 * - a line starting with "-", "*" or "•" is a bullet;
 * - a short line directly followed by bullets is a heading;
 * - other lines are paragraphs (a blank line starts a new one).
 */

export type DescriptionBlock = { type: "p"; text: string } | { type: "h"; text: string } | { type: "ul"; items: string[] };

const BULLET = /^[-*•●▪]\s+/;
const MAX_HEADING = 80;

export function parseDescription(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let para: string[] = [];
  let lastSingleLine = false; // was the last paragraph pushed a single line? (it may be a heading)
  const flush = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      lastSingleLine = para.length === 1;
    }
    para = [];
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (BULLET.test(line)) {
      // A single short line right before the first bullet (blank line allowed) is its heading.
      if (para.length === 1 && para[0].length <= MAX_HEADING) {
        blocks.push({ type: "h", text: para[0].replace(/:$/, "") });
        para = [];
      } else if (!para.length && lastSingleLine && blocks.at(-1)?.type === "p" && (blocks.at(-1) as { text: string }).text.length <= MAX_HEADING) {
        blocks[blocks.length - 1] = { type: "h", text: (blocks.at(-1) as { text: string }).text.replace(/:$/, "") };
      } else flush();
      lastSingleLine = false;
      const item = line.replace(BULLET, "");
      const last = blocks.at(-1);
      if (last?.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
      continue;
    }
    para.push(line);
  }
  flush();
  return blocks;
}

/** Splits a description into its opening paragraphs (the summary) and the structured rest (headings and bullets). */
export function splitDescription(text: string) {
  const blocks = parseDescription(text);
  const firstStructured = blocks.findIndex((b) => b.type !== "p");
  const cut = firstStructured === -1 ? blocks.length : firstStructured;
  return {
    summary: blocks.slice(0, cut).map((b) => (b as { text: string }).text),
    details: blocks.slice(cut),
  };
}

/** Plain-text summary for meta tags and short teasers. */
export function descriptionSummary(text: string, max = 300) {
  const { summary, details } = splitDescription(text);
  const plain =
    summary.join(" ") ||
    details
      .flatMap((b) => (b.type === "ul" ? b.items : [b.text]))
      .join(". ");
  return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain;
}
