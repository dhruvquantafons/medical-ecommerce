import { cn } from '@/lib/utils';

/** Loading placeholder block. Size it with classes, e.g. <Skeleton className="h-4 w-32" />. */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('pf-skeleton block', className)} />;
}
