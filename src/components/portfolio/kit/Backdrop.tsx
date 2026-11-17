"use client";

import { useId, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';
import { MoleculeField, type MoleculeCluster } from './MoleculeField';
import { usePauseOffscreen } from './motion';

/*
  The company pages' background system. One component, configured per section:

  layer (back to front)   what it is                                         motion
  ---------------------   ------------------------------------------------   ---------------------------
  washes                  large soft radial fields in the logo's hues        slow drift + scroll parallax
  pattern                 faint dot or line grid, masked to fade out          none
  motif                   hex-ring and bond-line clusters (MoleculeField)    draw-in, drift, parallax
  particles               a few tiny atoms and rings (xl+, in margins)        slow float

  Everything is aria-hidden, pointer-events-none and absolutely positioned (no layout shift).
  Washes are pale enough that body text keeps AA contrast on top of them (muted text on the
  strongest wash is above 5:1). Motifs and particles are placed toward the edges, away from copy.
  Animations pause off screen and stop under prefers-reduced-motion.
  Place inside a `relative isolate` element; the backdrop sits at z-index -10 within it.
*/

export type WashSpot = 'tl' | 'tr' | 'bl' | 'br' | 'l' | 'r' | 'c';
export type WashColor = 'violet' | 'orchid' | 'iris';

export interface Wash {
  at: WashSpot;
  color?: WashColor;
  /** Diameter as a share of the viewport width, capped at 900px. Default 0.6. */
  size?: number;
}

export interface BackdropProps {
  washes?: Wash[];
  pattern?: 'dots' | 'grid' | null;
  /** Where the pattern is strongest before it fades out. */
  patternFrom?: 'tl' | 'tr' | 'top' | 'center' | 'bl' | 'br';
  motif?: MoleculeCluster[] | null;
  /** Opacity of the motif (0 to 1). */
  motifOpacity?: number;
  particles?: boolean;
  parallax?: boolean;
  className?: string;
}

const SPOT: Record<WashSpot, React.CSSProperties> = {
  tl: { top: '-30%', left: '-18%' },
  tr: { top: '-30%', right: '-18%' },
  bl: { bottom: '-35%', left: '-18%' },
  br: { bottom: '-35%', right: '-15%' },
  l: { top: '15%', left: '-30%' },
  r: { top: '10%', right: '-30%' },
  c: { top: '5%', left: '28%' },
};

const MASK: Record<NonNullable<BackdropProps['patternFrom']>, string> = {
  tl: 'radial-gradient(ellipse 70% 80% at 0% 0%, #000 0%, transparent 70%)',
  tr: 'radial-gradient(ellipse 70% 80% at 100% 0%, #000 0%, transparent 70%)',
  bl: 'radial-gradient(ellipse 70% 80% at 0% 100%, #000 0%, transparent 70%)',
  br: 'radial-gradient(ellipse 70% 80% at 100% 100%, #000 0%, transparent 70%)',
  top: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000 0%, transparent 75%)',
  center: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 0%, transparent 80%)',
};

const EDGE_FADE = 'linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)';

const DRIFT = [
  { dx: '50px', dy: '30px', dur: '24s' },
  { dx: '-40px', dy: '45px', dur: '28s' },
  { dx: '35px', dy: '-35px', dur: '21s' },
];

export function Backdrop({
  washes = [],
  pattern = null,
  patternFrom = 'tl',
  motif = null,
  motifOpacity = 0.6,
  particles = false,
  parallax = true,
  className,
}: BackdropProps) {
  const pauseRef = usePauseOffscreen<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start end', 'end start'] });
  const still = reduce || !parallax;
  const washY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [-50, 50]);
  const motifY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [30, -30]);

  return (
    <div
      ref={node => {
        pauseRef.current = node;
        scrollRef.current = node;
      }}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {washes.length > 0 && (
        // Faded out at the section's top and bottom so a wash never ends in a hard line.
        <motion.div className="absolute inset-0" style={{ y: washY, maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}>
          {washes.map((w, i) => (
            <WashBlob key={i} wash={w} index={i} />
          ))}
        </motion.div>
      )}

      {pattern && <PatternLayer kind={pattern} mask={MASK[patternFrom]} />}

      {motif && motif.length > 0 && (
        <MotifLayer y={motifY} clusters={motif} opacity={motifOpacity} />
      )}

      {particles && <Particles />}
    </div>
  );
}

function WashBlob({ wash, index }: { wash: Wash; index: number }) {
  const d = DRIFT[index % DRIFT.length];
  const size = `min(${Math.round((wash.size ?? 0.6) * 100)}vw, 900px)`;
  return (
    <div
      className="pf-wash absolute aspect-square rounded-full"
      style={
        {
          ...SPOT[wash.at],
          width: size,
          background: `radial-gradient(closest-side, var(--pf-wash-${wash.color ?? 'violet'}) 0%, transparent 100%)`,
          '--dx': d.dx,
          '--dy': d.dy,
          '--dur': d.dur,
        } as React.CSSProperties
      }
    />
  );
}

function PatternLayer({ kind, mask }: { kind: 'dots' | 'grid'; mask: string }) {
  const id = useId();
  return (
    <svg className="absolute inset-0 size-full" style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <defs>
        {kind === 'dots' ? (
          <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="var(--pf-pattern-dot)" />
          </pattern>
        ) : (
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--pf-pattern-line)" strokeWidth="1" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function MotifLayer({ y, clusters, opacity }: { y: MotionValue<number>; clusters: MoleculeCluster[]; opacity: number }) {
  return (
    <motion.div className="absolute inset-0" style={{ y, opacity }}>
      <MoleculeField clusters={clusters} className="max-md:opacity-50" />
    </motion.div>
  );
}

/* Deterministic positions (no Math.random, so server and client agree). Kept inside the side
   margins outside the 1200px content column, so they never sit behind text. */
const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const side = i % 2 === 0 ? 'left' : 'right';
  const edge = 1.5 + ((i * 37) % 7); // 1.5% to 7.5% from the side
  return {
    side,
    edge,
    top: 8 + ((i * 53) % 84),
    ring: i % 3 === 0,
    size: i % 3 === 0 ? 10 : 3 + (i % 3),
    dx: `${((i * 7) % 13) - 6}px`,
    dy: `${-10 - ((i * 5) % 12)}px`,
    dur: `${10 + ((i * 3) % 8)}s`,
    delay: `${-((i * 1.7) % 9).toFixed(1)}s`,
    opacity: 0.28 + ((i * 11) % 30) / 100,
  };
});

function Particles() {
  return (
    // Only from 1280px up, where the margins beside the content column are wide enough.
    <div className="absolute inset-0 hidden xl:block">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="pf-float absolute text-primary"
          style={
            {
              [p.side]: `${p.edge}%`,
              top: `${p.top}%`,
              opacity: p.opacity,
              '--dx': p.dx,
              '--dy': p.dy,
              '--dur': p.dur,
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        >
          {p.ring ? (
            <svg width={p.size} height={p.size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 0.8 10.5 3.4V8.6L6 11.2 1.5 8.6V3.4Z" />
            </svg>
          ) : (
            <span className="block rounded-full bg-current" style={{ width: p.size, height: p.size }} />
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * Soft curved edge at the top of a section: the colour of the section above dips gently into
 * this one. Sits above the section's own background and backdrop, below its content.
 */
export function CurveEdge({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      className={cn('pointer-events-none absolute inset-x-0 top-0 -z-[5] h-7 w-full md:h-12', className)}
    >
      <path d="M0 0H1440V18C1080 62 360 62 0 18Z" fill={color} />
    </svg>
  );
}
