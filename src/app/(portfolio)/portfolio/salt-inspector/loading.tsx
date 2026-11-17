import { Container } from '@/components/portfolio/site';
import { Skeleton } from '@/components/portfolio/kit';

/** Shown while the Salt Inspector route loads: the page layout with placeholder blocks. */
export default function SaltInspectorLoading() {
  return (
    <section role="status" aria-label="Loading the Salt Inspector" className="border-b border-border bg-tint">
      <Container className="pt-16 pb-20 md:pt-24 md:pb-28">
        <Skeleton className="h-12 w-72 max-w-full md:h-16 md:w-[420px]" />
        <Skeleton className="mt-4 h-7 w-80 max-w-full" />
        <Skeleton className="mt-6 h-5 w-[560px] max-w-full" />
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-14 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-8">
          <div className="pf-card space-y-3 rounded-[20px] p-4">
            <Skeleton className="h-10 rounded-[10px]" />
            <Skeleton className="h-8 w-4/5 rounded-full" />
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-9 rounded-[10px]" />
            ))}
          </div>
          <div className="pf-card overflow-hidden rounded-[24px]">
            <div className="flex gap-7 p-8">
              <Skeleton className="size-28 shrink-0 rounded-2xl sm:size-44" />
              <div className="flex-1 space-y-4 pt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-56" />
                <Skeleton className="h-8 w-full max-w-md rounded-full" />
              </div>
            </div>
            <div className="space-y-4 border-t border-border p-8">
              <Skeleton className="h-6 w-full rounded-[6px]" />
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </div>
        </div>
      </Container>
      <span className="sr-only">Loading…</span>
    </section>
  );
}
