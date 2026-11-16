/**
 * Company facts: the single source for everything the site states about Syncytium Health.
 *
 * Rule (CLAUDE.md, Content): never invent a fact. Every value here is either confirmed from the
 * repo or null. Components must render nothing for a null value, never a placeholder.
 */

export type Licence = { label: string; number: string };
export type SocialLink = { label: string; href: string };

export const company = {
  /** Brand name, spelled exactly like this everywhere. */
  name: "Syncytium Health",
  /** TODO(owner): registered legal entity name (for example "Syncytium Health Pvt. Ltd."). */
  legalName: null as string | null,
  /** One plain sentence describing the company. Used for meta descriptions and the footer. */
  description:
    "Syncytium Health is a pharmaceutical and nutraceutical company that makes its own formulations and sells part of the range direct.",
  /** Short line for the browser title on the home page. */
  tagline: "Pharmaceuticals and nutraceuticals",
  /** Production origin, confirmed from trustedOrigins in src/lib/auth.ts. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.syncytiumhealth.com",

  /** TODO(owner): registered office address, one line per array item. */
  address: null as string[] | null,
  /** TODO(owner): customer support phone number. */
  phone: null as string | null,
  /** TODO(owner): customer support email address on the company domain. */
  email: null as string | null,
  /** TODO(owner): support hours, for example "Mon–Sat, 10:00–18:00 IST". */
  hours: null as string | null,

  /**
   * TODO(owner): licences and certifications that may be named publicly, with numbers
   * (drug manufacturing licence, FSSAI licence, WHO-GMP, ISO). Empty until supplied.
   */
  licences: [] as Licence[],

  /** TODO(owner): official social profiles. Empty until supplied. */
  social: [] as SocialLink[],

  /**
   * TODO(owner): set to true once content/team.ts holds real people (name, role, qualification,
   * biography, a real portrait). While false, /team returns 404 and "Team" is hidden from navigation.
   */
  hasTeam: false,
};

/** Supplement disclaimer shown in the footer. Plain statement about the product category; no regulatory claim. */
export const supplementDisclaimer =
  "Our nutraceutical products are food supplements. They are not intended to diagnose, treat, cure or prevent any disease. Consult your doctor before use if you are pregnant, nursing, taking medication or have a medical condition.";

/** Developer credit, a single line at the very bottom of the footer. */
export const developerCredit = { label: "Site by BluMargins Technologies", href: "https://www.blumargins.com/" };
