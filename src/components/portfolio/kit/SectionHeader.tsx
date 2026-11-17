import { cn } from '@/lib/utils';

/**
 * Section header for the company pages. No eyebrow or kicker: the heading carries the section.
 * - layout "split": heading and lead left, actions bottom-right on wide screens.
 * - layout "stack": everything in one column.
 * Sizes: "section" 30/44px, "display" 40/64px (page titles).
 */
export function SectionHeader({
  id,
  title,
  lead,
  actions,
  as: Heading = 'h2',
  size = 'section',
  layout = 'split',
  className,
}: {
  id: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  as?: 'h1' | 'h2';
  size?: 'section' | 'display';
  layout?: 'split' | 'stack';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        layout === 'split' && actions && 'lg:flex-row lg:items-end lg:justify-between lg:gap-12',
        className,
      )}
    >
      <div className="max-w-[62ch]">
        <Heading
          id={id}
          className={
            size === 'display'
              ? 'text-[40px] leading-[1.05] tracking-[-0.035em] md:text-[64px] md:leading-[1.02] md:tracking-[-0.04em]'
              : 'text-[30px] leading-[1.12] tracking-[-0.03em] md:text-[44px] md:leading-[1.06] md:tracking-[-0.035em]'
          }
        >
          {title}
        </Heading>
        {lead && <p className="mt-5 max-w-[56ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[19px]">{lead}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
