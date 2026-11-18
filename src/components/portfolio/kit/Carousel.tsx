"use client";

import { Children, useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Horizontal carousel built on native scroll-snap: swipe, trackpad and keyboard scrolling all work,
 * and the buttons scroll by one view. When everything fits (e.g. four cards on desktop) it is a
 * plain grid row and the controls are not shown.
 * `itemClassName` sets the item width, e.g. "basis-[78%] sm:basis-[46%] lg:basis-[calc((100%-72px)/4)]".
 */
export function Carousel({
  label,
  children,
  itemClassName,
  className,
}: {
  label: string;
  children: React.ReactNode;
  itemClassName?: string;
  className?: string;
}) {
  const trackId = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ overflow: false, canPrev: false, canNext: false, progress: 0, view: 1 });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      overflow: max > 2,
      canPrev: el.scrollLeft > 2,
      canNext: el.scrollLeft < max - 2,
      progress: max > 0 ? el.scrollLeft / max : 0,
      view: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro?.disconnect();
    };
  }, [measure]);

  const scrollByView = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' });
  };

  const items = Children.toArray(children);
  const thumb = Math.max(state.view, 0.12);

  return (
    <div className={className}>
      <ul
        id={trackId}
        ref={trackRef}
        aria-label={label}
        className="pf-no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pt-2 pb-6 sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6"
      >
        {items.map((child, i) => (
          <li key={i} className={cn('min-w-0 shrink-0 grow-0 snap-start', itemClassName)}>
            {child}
          </li>
        ))}
      </ul>

      {state.overflow && (
        <div className="mt-2 flex items-center gap-6">
          <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
            <div
              className="absolute inset-y-0 rounded-full bg-primary transition-[left] duration-300 ease-[var(--ease-out-expo)]"
              style={{ width: `${thumb * 100}%`, left: `${state.progress * (1 - thumb) * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            {([-1, 1] as const).map(dir => {
              const disabled = dir === -1 ? !state.canPrev : !state.canNext;
              const Icon = dir === -1 ? ChevronLeft : ChevronRight;
              return (
                <button
                  key={dir}
                  type="button"
                  aria-controls={trackId}
                  aria-label={dir === -1 ? 'Previous products' : 'Next products'}
                  disabled={disabled}
                  onClick={() => scrollByView(dir)}
                  className="pf-btn pf-btn-secondary size-11 rounded-full p-0"
                >
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
