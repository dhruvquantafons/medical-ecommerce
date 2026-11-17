import * as React from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

/**
 * White card on the company pages: 16px radius, hairline border, violet-tinted offset shadow.
 * - elevation 1: resting content (default). 2: panels that hold an interaction (forms, inspectors).
 * - lift: for cards that are links. Rises 4px with a deeper shadow on hover and keyboard focus;
 *   an element inside with class "pf-card-media" eases in slightly.
 * Do not nest cards.
 */
export function Card({
  asChild = false,
  elevation = 1,
  lift = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean; elevation?: 1 | 2; lift?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div';
  return <Comp className={cn('pf-card', elevation === 2 && 'pf-card-raised', lift && 'pf-card-lift', className)} {...props} />;
}
