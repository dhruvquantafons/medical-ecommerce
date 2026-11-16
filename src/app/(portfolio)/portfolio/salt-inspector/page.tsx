import type { Metadata } from 'next';
import { getCatalogItems } from '@/lib/catalog-items';
import { SaltInspector } from '@/components/portfolio/SaltInspector';
import { Container, Reveal, SectionHeading } from '@/components/portfolio/site';

export const metadata: Metadata = {
  title: 'Salt Inspector',
  description:
    'See what is in each Syncytium Health formulation: every active ingredient, its amount per unit, its role and its CAS registry number.',
};

export default async function SaltInspectorPage({ searchParams }: PageProps<'/portfolio/salt-inspector'>) {
  const [items, sp] = await Promise.all([getCatalogItems(), searchParams]);
  const initialId = typeof sp.item === 'string' ? sp.item : undefined;

  return (
    <Container className="py-16 md:py-24">
      <Reveal>
        <SectionHeading
          as="h1"
          id="pf-page-title"
          eyebrow="Composition"
          title="Salt Inspector"
          lead="Choose a product to see each active ingredient it contains, the amount per unit, what it does and its CAS registry number."
          className="mb-10"
        />
        <SaltInspector items={items} initialId={initialId} />
      </Reveal>
    </Container>
  );
}
