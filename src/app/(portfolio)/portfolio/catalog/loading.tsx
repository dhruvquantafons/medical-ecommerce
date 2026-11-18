import { Container } from '@/components/portfolio/site';
import { CatalogCardSkeleton } from '@/components/portfolio/CatalogCard';
import { Skeleton } from '@/components/portfolio/kit';

/** Shown while the catalog route loads: the same layout as the page, with placeholder blocks. */
export default function CatalogLoading() {
  return (
    <div role="status" aria-label="Loading the product catalog">
      <section className="bg-tint">
        <Container className="pt-16 pb-12 md:pt-24 md:pb-16">
          <Skeleton className="h-12 w-72 max-w-full md:h-16 md:w-[460px]" />
          <Skeleton className="mt-6 h-5 w-[560px] max-w-full" />
          <Skeleton className="mt-3 h-5 w-[420px] max-w-full" />
        </Container>
      </section>
      <div className="border-y border-border bg-white">
        <Container className="flex flex-wrap gap-3 py-3">
          <Skeleton className="h-11 w-full rounded-[10px] lg:w-80" />
          <Skeleton className="h-11 w-72 rounded-xl" />
          <Skeleton className="h-11 w-44 rounded-[10px]" />
        </Container>
      </div>
      <Container className="pt-6 pb-20">
        <Skeleton className="h-4 w-40" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <CatalogCardSkeleton key={i} />
          ))}
        </div>
      </Container>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
