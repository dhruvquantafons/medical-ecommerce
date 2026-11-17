"use client";

import { BlurFade } from './ui/blur-fade';
import { cn } from '@/lib/utils';

/** 1200px container with 16px (mobile) / 24px gutters. */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6', className)}>{children}</div>;
}

/**
 * The one entrance on the company pages: the page header fades in with an 8px rise, once, on load.
 * Sections below are never hidden, so content is visible without JavaScript, in print and in captures.
 * Reduced motion is honoured through <MotionConfig reducedMotion="user"> in PortfolioShell.
 */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <BlurFade direction="up" offset={8} duration={0.5} delay={delay} blur="0px" className={className}>
      {children}
    </BlurFade>
  );
}

/** default: white. surface: pale grey-violet with hairlines. tint: the lavender band for headers and features. */
export type Tone = 'default' | 'surface' | 'tint';

export function toneClass(tone: Tone) {
  if (tone === 'surface') return 'border-y border-border bg-surface';
  if (tone === 'tint') return 'bg-tint';
  return '';
}

interface SectionProps {
  id?: string;
  labelledBy?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

/** Section padding 112px desktop / 72px mobile. */
export function Section({ id, labelledBy, tone = 'default', className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('scroll-mt-16 py-[72px] md:py-28', toneClass(tone), className)}>
      <Container>{children}</Container>
    </section>
  );
}

/** Small label in IBM Plex Mono, like the reference line on a lab report. Sentence case. */
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('font-mono text-[12px] leading-4 text-subtle', className)}>{children}</p>;
}

/** Eyebrow above a headline: Plex Mono in the accent, after a short rule. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-start gap-3 font-mono text-[13px] leading-5 font-medium text-primary', className)}>
      <span className="mt-2.5 h-px w-6 shrink-0 bg-primary" aria-hidden="true" />
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  as?: 'h1' | 'h2';
  size?: 'default' | 'display';
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, lead, as = 'h2', size, className }: SectionHeadingProps) {
  const Heading = as;
  const display = size ? size === 'display' : as === 'h1';
  return (
    <div className={cn('max-w-[62ch]', className)}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        className={
          display
            ? 'text-[40px] leading-[1.06] tracking-[-0.035em] md:text-[64px] md:leading-[1.03] md:tracking-[-0.045em]'
            : 'text-[30px] leading-[1.12] tracking-[-0.03em] md:text-[44px] md:leading-[1.08] md:tracking-[-0.035em]'
        }
      >
        {title}
      </Heading>
      {lead && <p className="mt-5 max-w-[56ch] text-[18px] leading-[1.6] text-muted-foreground md:text-[20px] md:leading-[1.55]">{lead}</p>}
    </div>
  );
}

/** Small rectangular tag for "Prescription required". Quiet text, not a pill. */
export function RxTag({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-6 w-fit items-center gap-2 rounded-[4px] border border-border bg-background px-2 text-[12px] tracking-normal whitespace-nowrap text-foreground', className)}>
      <span className="font-mono text-[12px] font-medium text-primary" aria-hidden="true">Rx</span>
      {/* "required" is dropped on phones so the tag fits a two-column card. */}
      Prescription<span className="max-sm:sr-only"> required</span>
    </span>
  );
}
