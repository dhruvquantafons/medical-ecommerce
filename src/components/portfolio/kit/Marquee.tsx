import { cn } from '@/lib/utils';

/**
 * Auto-scrolling strip. The list is rendered twice and the track moves by half its width, so the
 * loop is seamless. Pauses on hover and while anything inside has keyboard focus. Under reduced
 * motion it becomes a static, wrapping row (portfolio.css). The duplicate is hidden from
 * assistive technology and from the tab order.
 */
export function Marquee({
  items,
  label,
  duration = 40,
  className,
  itemClassName,
}: {
  items: { key: string; node: React.ReactNode }[];
  /** Accessible name for the strip. */
  label: string;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
  itemClassName?: string;
}) {
  if (items.length === 0) return null;
  const list = (copy: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      {...(copy ? { 'aria-hidden': true, 'data-marquee-copy': '', inert: true } : {})}
    >
      {items.map(item => (
        <li key={item.key} className={cn('shrink-0 px-6 sm:px-10', itemClassName)}>
          {item.node}
        </li>
      ))}
    </ul>
  );
  return (
    <div role="region" aria-label={label} className={cn('pf-marquee', className)}>
      <div className="pf-marquee-track" style={{ '--pf-marquee-duration': `${duration}s` } as React.CSSProperties}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
