/**
 * Shared wording for the company pages (Home, About, Catalog, Team, Salt Inspector).
 * One description of the company keeps titles, meta descriptions and hero copy aligned
 * (changeui.md, Owner input 1 default).
 */
export const BRAND = 'Syncytium Health';

export const POSITIONING = 'Medicines and daily supplements';

export const POSITIONING_DESCRIPTION =
  'Syncytium Health is a pharmaceutical and nutraceutical company. We make our own formulations, from prescription medicines to daily supplements, and sell part of the range direct across India.';

/** Header and footer navigation. Every entry is a real route. */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/portfolio/about' },
  { label: 'Catalog', href: '/portfolio/catalog' },
  { label: 'Salt Inspector', href: '/portfolio/salt-inspector' },
  { label: 'Team', href: '/portfolio/team' },
] as const;

/** The partner and enquiry form lives on Home. TODO(owner): move to /contact if that page is added. */
export const CONTACT_HREF = '/#contact';

/** Standard advice shown under composition tables. */
export const LABEL_ADVICE =
  'Read the label before use, and ask your doctor or pharmacist before starting a new medicine or supplement.';

/**
 * Catalogue rows name the company several ways, including the misspelling "SYNCTIUM"
 * ("SYNCTIUM Healthcare", "SYNCTIUM Pharma Labs", "SYNCTIUM Urology"). Show them all as one correctly
 * spelled brand. Third-party makers (e.g. "Synokem Pharma") keep their own name.
 * Display-only: fix the rows themselves in Admin -> Catalog.
 */
export function displayBrand(brand: string): string {
  return /\bsync[a-z]*ium\b/i.test(brand) ? BRAND : brand;
}

/** True for the catalogue's "Prescription (Rx)" category. */
export function isPrescription(category: string): boolean {
  return /prescription|\(rx\)/i.test(category);
}

/** Plain label for the catalogue categories. */
export function categoryLabel(category: string): string {
  if (isPrescription(category)) return 'Prescription';
  if (/over-the-counter|\(otc\)/i.test(category)) return 'Over the counter';
  return category;
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}
