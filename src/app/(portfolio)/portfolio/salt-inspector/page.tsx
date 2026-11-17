import type { Metadata } from 'next';
import { getCatalogItems } from '@/lib/catalog-items';
import { SaltInspector } from '@/components/portfolio/SaltInspector';
import { Container } from '@/components/portfolio/site';
import { Backdrop } from '@/components/portfolio/kit';

export const metadata: Metadata = {
  title: 'Salt Inspector',
  description:
    'See what is in each Syncytium Health formulation: every active ingredient, its amount per unit, its role and its CAS registry number.',
};

export default async function SaltInspectorPage({ searchParams }: PageProps<'/portfolio/salt-inspector'>) {
  const [items, sp] = await Promise.all([getCatalogItems(), searchParams]);
  const initialId = typeof sp.item === 'string' ? sp.item : undefined;

  return (
    <section aria-labelledby="pf-page-title" className="relative isolate border-b border-border bg-tint">
      <Backdrop
        washes={[{ at: 'tr', color: 'violet', size: 0.65 }, { at: 'bl', color: 'orchid', size: 0.55 }, { at: 'r', color: 'iris', size: 0.45 }]}
        pattern="grid"
        patternFrom="top"
        motif={['c']}
        motifOpacity={0.6}
        particles
      />
      <Container className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="pf-rise mb-12 max-w-[62ch] md:mb-14">
          {/* The second line was the eyebrow; it is now part of the title. */}
          <h1 id="pf-page-title" className="text-[40px] leading-[1.04] tracking-[-0.035em] md:text-[64px] md:leading-[1.02] md:tracking-[-0.042em]">
            Salt Inspector
            <span className="mt-2 block text-[22px] leading-[1.25] tracking-[-0.02em] text-muted-foreground md:text-[30px]">
              Composition, ingredient by ingredient
            </span>
          </h1>
          <p className="mt-6 max-w-[56ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[19px]">
            Choose a product to see each active ingredient it contains, its share by weight, its amount per unit, what it does and its CAS registry number.
          </p>
        </div>
        <SaltInspector items={items} initialId={initialId} />
      </Container>
    </section>
  );
}
