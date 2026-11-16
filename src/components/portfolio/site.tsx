"use client";

import { BlurFade } from './ui/blur-fade';
import { cn } from '@/lib/utils';

/** 1200px container with 16px (mobile) / 24px gutters. */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6', className)}>{children}</div>;
}

/**
 * The one entrance animation on the company pages (changeui.md, Motion):
 * fade with an 8px rise, 200ms, once, when the section enters view. Magic UI Blur Fade, no blur.
 * Reduced motion is honoured through <MotionConfig reducedMotion="user"> in PortfolioShell.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <BlurFade inView inViewMargin="0px" direction="up" offset={8} duration={0.2} blur="0px" className={className}>
      {children}
    </BlurFade>
  );
}

interface SectionProps {
  id?: string;
  labelledBy?: string;
  /** "surface" puts the section on the warm off-white with hairlines above and below. */
  tone?: 'default' | 'surface';
  className?: string;
  children: React.ReactNode;
}

/** Section padding 96px desktop / 64px mobile, content wrapped in the single fade-in. */
export function Section({ id, labelledBy, tone = 'default', className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('py-16 md:py-24', tone === 'surface' && 'border-y border-border bg-surface', className)}
    >
      <Container>
        <Reveal>{children}</Reveal>
      </Container>
    </section>
  );
}

interface SectionHeadingProps {
  id: string;
  /** Optional small uppercase label in muted ink: plain text, no pill, no icon. */
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, lead, as = 'h2', className }: SectionHeadingProps) {
  const Heading = as;
  return (
    <div className={cn('max-w-[65ch]', className)}>
      {eyebrow && <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</p>}
      <Heading
        id={id}
        className={as === 'h1' ? 'text-[44px] leading-[1.08] md:text-[60px]' : 'text-[32px] leading-[1.15] md:text-[44px]'}
      >
        {title}
      </Heading>
      {lead && <p className="mt-4 text-lg text-muted-foreground">{lead}</p>}
    </div>
  );
}
