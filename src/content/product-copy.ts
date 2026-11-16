import type { Product } from "@/data/types";
import { descriptionSummary } from "@/lib/description";

/*
 * Reviewed one-sentence product summaries (changeui.md Problem 03): what the product is and who it is
 * for, keeping only claims already present in the product data and adding no new health claims.
 * The database descriptions are unedited pack copy ("Trust the Trustworthy SYN-GUT…"), so the site
 * shows these instead wherever a short description appears.
 *
 * TODO(owner): approve these sentences and paste them into each product's description in the admin
 * panel (as the first paragraph); then this file can be deleted.
 */
const summaries: Record<string, string> = {
  "calcitium-tablets":
    "Calcium citrate malate tablets with vitamin D3 and folic acid, for adults who want to support strong, healthy bones.",
  "calcitium-d3-nano-shots":
    "A sugar-free 5 ml oral shot of vitamin D3 (cholecalciferol, 60,000 IU), for people advised to restore their vitamin D levels.",
  "hep-ob-tablets":
    "Tablets combining oleoylethanolamide (OEA), pantethine and L-valine, a nutritional formula to support liver health and healthy fat metabolism.",
  "lycotium-softgel":
    "Omega-3 fish oil softgels (1000 mg, with 180 mg EPA and 120 mg DHA) for adults looking after their heart health.",
  "syn-gut-suspension":
    "A probiotic suspension of Bacillus clausii, 2 billion spores in each 5 ml mini bottle, to support digestive health.",
  "syn-ortho-roll-on-oil":
    "A herbal roll-on oil with Boswellia serrata and turmeric, applied to the skin over aching joints and muscles.",
};

/** One-sentence summary for cards, teasers, meta descriptions and structured data. */
export function productSummary(p: Pick<Product, "slug" | "description">, max = 300): string {
  return summaries[p.slug] ?? descriptionSummary(cleanDescription(p.description), max);
}

/** Whether a reviewed summary exists, so the product page can show it in place of the pack copy. */
export function hasReviewedSummary(slug: string) {
  return slug in summaries;
}

/**
 * Display-only fixes to typos in database descriptions.
 * TODO(owner): correct these in the admin panel too.
 */
export function cleanDescription(text: string): string {
  return text.replace(/SuspensionThe\b/g, "Suspension. The");
}
