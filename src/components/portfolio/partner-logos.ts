/**
 * Partner logos for the strip under the Home hero.
 *
 * TODO(owner): add real partners only, with their permission. Put each logo (SVG preferred, or a
 * transparent PNG) in public/partners/ and list it here. While this list is empty the strip is not
 * shown at all, so nothing implies a partnership that does not exist.
 *
 * Example entry:
 *   { name: 'Example Pharmacy', src: '/partners/example-pharmacy.svg', width: 140, height: 40 },
 */
export interface PartnerLogo {
  /** Used as the image's alt text. */
  name: string;
  src: string;
  /** Intrinsic size; the strip scales logos to 32px tall. */
  width: number;
  height: number;
  /** Optional link to the partner's site (opens in a new tab). */
  href?: string;
}

export const PARTNER_LOGOS: PartnerLogo[] = [];
