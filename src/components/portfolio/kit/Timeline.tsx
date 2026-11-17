"use client";

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInViewOnce } from './motion';

/**
 * Vertical timeline for an ordered sequence (process steps, or dated milestones via `meta`).
 * The rail fills as the reader scrolls through the list, and each node turns solid once the
 * reader reaches it. Each entry is an icon-led card. Under reduced motion the rail is drawn full.
 */
export interface TimelineItem {
  title: string;
  body: React.ReactNode;
  icon?: LucideIcon;
  /** Optional short line above the title, e.g. a date for milestones. */
  meta?: string;
}

export function Timeline({ items, label }: { items: TimelineItem[]; label?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <ol ref={ref} aria-label={label} className="relative">
      {/* Rail: a hairline track with the brand fill on top, through the node centres. */}
      <span aria-hidden="true" className="absolute top-6 bottom-6 left-[23px] w-px bg-border" />
      <motion.span
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-[23px] w-px origin-top bg-primary"
        style={{ scaleY: reduce ? 1 : fill }}
      />
      {items.map((item, i) => (
        <TimelineEntry key={item.title} item={item} index={i} total={items.length} />
      ))}
    </ol>
  );
}

function TimelineEntry({ item, index, total }: { item: TimelineItem; index: number; total: number }) {
  const [ref, reached] = useInViewOnce<HTMLLIElement>('0px 0px -45% 0px');
  const Icon = item.icon;
  return (
    <li ref={ref} className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 pb-6 last:pb-0 sm:gap-6">
      <div className="relative z-10 pt-3">
        <span
          className={cn(
            'grid size-12 place-items-center rounded-full border font-mono text-[14px] font-medium transition-[background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
            reached
              ? 'border-primary bg-primary text-white shadow-[0_6px_16px_-6px_rgba(61,46,134,0.6)]'
              : 'border-[#d3cee2] bg-white text-muted-foreground',
          )}
        >
          <span aria-hidden="true">{index + 1}</span>
          <span className="sr-only">
            Step {index + 1} of {total}
          </span>
        </span>
      </div>

      <div className="group pf-card p-5 transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:border-[#d3cee2] hover:shadow-[var(--pf-shadow-2)] sm:p-7">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
          {Icon && (
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#efebfd] text-primary transition-[background-color,color] duration-300 group-hover:bg-primary group-hover:text-white"
            >
              <Icon className="size-[22px]" strokeWidth={1.6} />
            </span>
          )}
          <div className="min-w-0">
            {item.meta && <p className="mb-1 font-mono text-[12px] text-subtle">{item.meta}</p>}
            <h3 className="font-display text-[20px] leading-[1.2] font-semibold tracking-[-0.025em] sm:text-[22px]">{item.title}</h3>
            <div className="mt-2.5 text-[16px] leading-[1.6] text-muted-foreground">{item.body}</div>
          </div>
        </div>
      </div>
    </li>
  );
}
