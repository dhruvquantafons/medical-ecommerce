import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Company-page buttons. Styles live in portfolio.css (.pf-btn-*):
 * - primary: solid brand violet with an inner highlight and a soft violet drop shadow.
 * - secondary: white with a hairline border; lifts 1px on hover.
 * - ghost: text in the brand colour, tinted background on hover.
 * Every size meets the 44px touch target except `sm` (use only in dense rows).
 * `arrow` adds a trailing arrow that nudges forward on hover.
 */
export const actionButtonVariants = cva('pf-btn', {
  variants: {
    variant: {
      primary: 'pf-btn-primary',
      secondary: 'pf-btn-secondary',
      ghost: 'pf-btn-ghost',
    },
    size: {
      sm: 'h-9 px-3.5 text-[14px]',
      md: 'h-11 px-5 text-[15px]',
      lg: 'h-12 px-6 text-[16px]',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

type ActionButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof actionButtonVariants> & {
    asChild?: boolean;
    arrow?: boolean;
  };

export function ActionButton({ className, variant, size, asChild = false, arrow = false, children, ...props }: ActionButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp data-variant={variant ?? 'primary'} className={cn(actionButtonVariants({ variant, size }), className)} {...props}>
      <Slot.Slottable>{children}</Slot.Slottable>
      {arrow && <ArrowRight className="pf-btn-arrow size-4" strokeWidth={2} aria-hidden="true" />}
    </Comp>
  );
}
