"use client";

import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Text field with a floating label. The label sits inside the field and moves up when the field
 * has focus or a value. States:
 * - focus: brand border with a soft ring;
 * - error: red border and a message under the field (linked with aria-describedby);
 * - valid: a small check at the right once the visitor has left a correct field.
 * Placeholders (hints) appear only while the field has focus, so they never collide with the label.
 */
type BaseProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  valid?: boolean;
  optional?: boolean;
  className?: string;
};

type InputProps = BaseProps & { multiline?: false } & Omit<React.ComponentProps<'input'>, 'id' | 'value' | 'onChange' | 'onBlur' | 'className'>;
type TextareaProps = BaseProps & { multiline: true; rows?: number } & Omit<React.ComponentProps<'textarea'>, 'id' | 'value' | 'onChange' | 'onBlur' | 'className'>;

const fieldBase =
  'peer block w-full rounded-[10px] border bg-white px-4 text-[16px] text-foreground transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out-expo)] placeholder:text-transparent focus:placeholder:text-subtle focus-visible:outline-none disabled:opacity-60';

export function FloatingField(props: InputProps | TextareaProps) {
  const { id, label, value, onValueChange, onBlur, error, valid, optional, className, multiline, ...rest } = props;
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const errorId = `${id}-error`;
  const state = error ? 'error' : valid ? 'valid' : 'idle';

  const stateClasses = cn(
    state === 'error'
      ? 'border-destructive focus:shadow-[0_0_0_4px_rgba(220,38,38,0.14)]'
      : 'border-input hover:border-foreground/60 focus:border-primary focus:shadow-[0_0_0_4px_rgba(61,46,134,0.16)]',
  );

  const shared = {
    id,
    value,
    'aria-invalid': state === 'error' || undefined,
    'aria-describedby': error ? errorId : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      onBlur?.();
    },
  };

  return (
    <div className={cn('relative', className)}>
      {multiline ? (
        <textarea
          {...(rest as React.ComponentProps<'textarea'>)}
          {...shared}
          onChange={e => onValueChange(e.target.value)}
          className={cn(fieldBase, stateClasses, 'min-h-32 resize-y pt-7 pb-3')}
        />
      ) : (
        <input
          {...(rest as React.ComponentProps<'input'>)}
          {...shared}
          onChange={e => onValueChange(e.target.value)}
          className={cn(fieldBase, stateClasses, 'h-14 pt-5 pr-11 pb-1.5')}
        />
      )}
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute top-0 left-4 origin-left text-[16px] transition-[transform,color] duration-200 ease-[var(--ease-out-expo)]',
          floated ? 'translate-y-[7px] scale-[0.8]' : 'translate-y-[16px]',
          state === 'error' ? 'text-destructive' : focused ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {label}
        {optional && <span className="text-subtle"> (optional)</span>}
      </label>
      {!multiline && state === 'valid' && !focused && (
        <span className="absolute top-[18px] right-4 grid size-5 place-items-center rounded-full bg-[#e4f4ec]" aria-hidden="true">
          <Check className="size-3.5 text-success" strokeWidth={2.5} />
        </span>
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-[14px] leading-5 text-destructive">
          <AlertCircle className="mt-px size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
