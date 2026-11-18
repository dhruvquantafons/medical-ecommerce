import { Container } from './site';
import { Marquee } from './kit';
import { PARTNER_LOGOS, type PartnerLogo } from './partner-logos';

/**
 * Auto-scrolling strip of partner logos, paused on hover or focus. Renders nothing until real
 * logos are listed in partner-logos.ts (TODO(owner)). Logos are greyed and come to full colour on hover.
 */
export function PartnerStrip({ logos = PARTNER_LOGOS }: { logos?: PartnerLogo[] }) {
  if (logos.length === 0) return null;

  const items = logos.map(logo => {
    const img = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        loading="lazy"
        className="h-8 w-auto opacity-60 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
      />
    );
    return {
      key: logo.src,
      node: logo.href ? (
        <a href={logo.href} target="_blank" rel="noopener noreferrer" className="block rounded-sm">
          {img}
        </a>
      ) : (
        img
      ),
    };
  });

  return (
    <div className="border-b border-border bg-white py-8">
      <Container>
        <Marquee items={items} label="Partners" duration={Math.max(24, logos.length * 5)} />
      </Container>
    </div>
  );
}
