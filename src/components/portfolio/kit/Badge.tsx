import { cn } from '@/lib/utils';

/**
 * Small rectangular badges (6px radius, 24px tall). Tones:
 * - neutral: white with hairline, for facts such as dosage form.
 * - brand: pale violet, for categories.
 * - rx: solid violet, only for prescription items (use <RxBadge>).
 * - success / caution: states. Caution marks data that is not yet verified.
 */
export type BadgeTone = 'neutral' | 'brand' | 'rx' | 'success' | 'caution';

export function Badge({
  tone = 'neutral',
  icon,
  className,
  children,
}: {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn('pf-badge', `pf-badge-${tone}`, className)}>
      {icon}
      {children}
    </span>
  );
}

/** "Rx Prescription" badge. `compact` shows "Rx" only, with the full meaning for screen readers. */
export function RxBadge({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn('pf-badge pf-badge-rx', className)}>
      <span className="font-mono text-[11px] font-medium tracking-normal" aria-hidden="true">
        Rx
      </span>
      {compact ? <span className="sr-only">Prescription required</span> : <span>Prescription</span>}
    </span>
  );
}
