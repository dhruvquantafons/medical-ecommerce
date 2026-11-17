"use client";

/**
 * Motion patterns for the company pages. Rules they all follow:
 * - Content is visible by default. Nothing is hidden on the server or without JavaScript.
 * - Exponential ease-out (--ease-out-expo), entrances 500-900ms, state changes 150-300ms.
 * - prefers-reduced-motion: movement is removed, final values are shown (see portfolio.css).
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { cn } from '@/lib/utils';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True once the element has entered the viewport. Never flips back. */
export function useInViewOnce<T extends Element>(
  rootMargin = '0px 0px -10% 0px',
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return [ref, inView];
}

/**
 * Fades a block up (with a short blur) when it scrolls into view. Blocks already on screen when
 * the page loads are left alone, so there is no flash. Use sparingly: for a list appearing as a
 * list, or one block per section at most.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds. Keep stagger totals under ~400ms. */
  delay?: number;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already visible
    setState('pending');
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={state === 'idle' ? undefined : state}
      className={className}
      style={state === 'shown' && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts up to a number when it first comes into view. The server renders the final value, and
 * screen readers only ever get the final value.
 */
export function CountUp({
  value,
  from = 0,
  decimals = 0,
  duration = 1400,
  delay = 0,
  className,
  start = true,
}: {
  value: number;
  from?: number;
  decimals?: number;
  duration?: number;
  /** Milliseconds before counting starts. */
  delay?: number;
  className?: string;
  /** Extra gate, e.g. wait for a parent animation. */
  start?: boolean;
}) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>('0px');
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // Without the animation the final value (the initial state) is shown.
    if (!inView || !start || prefersReducedMotion()) return;
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min(1, Math.max(0, (now - t0 - delay) / duration));
      setDisplay(from + (value - from) * easeOutExpo(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, start, value, from, duration, delay]);

  const text = display.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const final = value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}

/**
 * A bar that fills from the left once it is in view. `value` is 0-100. `from` (0-100) draws a
 * band instead, e.g. a reported range of 40-80%.
 */
export function FillBar({
  value,
  from = 0,
  color = 'var(--color-primary)',
  className,
  trackClassName,
  delay = 0,
}: {
  value: number;
  from?: number;
  color?: string;
  className?: string;
  trackClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // idle: drawn full (server, no JavaScript, reduced motion). pending: off screen, waiting. run: filling.
  const [phase, setPhase] = useState<'idle' | 'pending' | 'run'>('idle');
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setPhase('run');
        io.disconnect();
      } else {
        setPhase('pending');
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  const left = clamp(from);
  const width = Math.max(clamp(value) - left, 0.6);
  return (
    <div ref={ref} aria-hidden="true" className={cn('relative h-2 overflow-hidden rounded-full bg-[#ebe8f3]', trackClassName)}>
      <div
        className={cn('absolute inset-y-0 origin-left rounded-full', phase === 'run' && 'pf-fill', phase === 'pending' && 'scale-x-0', className)}
        style={{ left: `${left}%`, width: `${width}%`, background: color, animationDelay: `${delay}ms` }}
      />
    </div>
  );
}

/**
 * Pauses CSS animations inside the element (via data-paused) whenever it is off screen or the tab
 * is hidden, so looping decoration never runs where nobody can see it.
 */
export function usePauseOffscreen<T extends Element>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let visible = true;
    const apply = () => {
      if (visible && document.visibilityState === 'visible') el.removeAttribute('data-paused');
      else el.setAttribute('data-paused', '');
    };
    const io = new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
      apply();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);
  return ref;
}

/**
 * Pointer parallax for layered compositions: writes --px and --py (-1 to 1) on the element.
 * Children opt in with `transform: translate3d(calc(var(--px) * Npx), calc(var(--py) * Npx), 0)`.
 * Only on fine pointers, never with reduced motion.
 */
export function usePointerParallax<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return ref;
}

/** Inline style for a parallax layer. depth is the travel in px at the edge of the element. */
export const parallaxLayer = (depth: number): React.CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
  transition: 'transform 600ms var(--ease-out-expo)',
});
