/*
 * Landing page copy (changeui.md Part 2). Facts shown on the page are counted from the product data at
 * request time; nothing here is a number or a claim.
 */

/**
 * Hero headline options (Problem 10). The owner picks one by setting `heroHeadlineIndex`.
 * TODO(owner): choose the headline. Option 1 is shown until then.
 * In development, append ?headline=2 or ?headline=3 to "/" to preview the others.
 */
export const heroHeadlineOptions = [
  "Medicines and daily supplements, made to be trusted.",
  "Our own medicines and supplements, sold direct.",
  "Formulations for gut, liver, bone and heart health.",
] as const;

export const heroHeadlineIndex = 0;

export const heroEyebrow = "Pharmaceuticals and nutraceuticals";

/** "Gut Health" → "gut health", "Bone & Joint" → "bone & joint" (the "&" keeps lists readable). */
export function areaPhrase(name: string) {
  return name.toLowerCase();
}

/** "a, b, c, and d" (serial comma, because area names themselves contain "and"). */
export function listPhrase(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/** Store service facts, as the store already states them (FAQ, product pages, src/config/site.ts). */
export const serviceFacts = {
  dispatch: "Ships within 24 hours",
  returns: "7-day returns on unopened products",
};
