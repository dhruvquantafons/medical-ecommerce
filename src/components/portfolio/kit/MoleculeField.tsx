"use client";

import { cn } from '@/lib/utils';
import { usePauseOffscreen } from './motion';

/*
  Decorative background: generic skeletal-formula ring systems (hexagonal rings, chains and atom
  nodes) in the brand violet at low contrast. They are not any specific molecule. Bonds draw in
  once on load; each cluster then drifts a few pixels. The drift pauses off screen and is removed
  under reduced motion. Place inside a `relative overflow-hidden` parent.
*/

type Pt = [number, number];
const S3 = Math.sqrt(3);

function hexVertices([cx, cy]: Pt, r: number): Pt[] {
  // Pointy-top hexagon: vertex 0 at the top, clockwise.
  return [0, 1, 2, 3, 4, 5].map(k => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt;
  });
}

const f = (n: number) => n.toFixed(1);

function ringPath(c: Pt, r: number) {
  const v = hexVertices(c, r);
  return `M${v.map(p => `${f(p[0])} ${f(p[1])}`).join(' L')} Z`;
}

/** Inner lines on alternate edges, as drawn for double bonds in an aromatic ring. */
function innerBonds(c: Pt, r: number): string[] {
  const inner = hexVertices(c, r * 0.74);
  return [0, 2, 4].map(k => {
    const a = inner[k];
    const b = inner[(k + 1) % 6];
    const t = 0.16;
    const p1: Pt = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const p2: Pt = [b[0] + (a[0] - b[0]) * t, b[1] + (a[1] - b[1]) * t];
    return `M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])}`;
  });
}

const chain = (pts: Pt[]) => `M${pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L')}`;

interface Cluster {
  at: Pt;
  rings: Pt[];
  r: number;
  aromatic?: number[]; // indexes of rings drawn with inner bonds
  chains: Pt[][];
  nodes: { p: Pt; accent?: boolean }[];
  drift: { dx: number; dy: number; dur: number };
  delay: number;
  opacity: number;
}

function buildClusters(): Cluster[] {
  // Three fused rings with side chains.
  const r = 46;
  const a1: Pt = [0, 0];
  const a2: Pt = [r * S3, 0];
  const a3: Pt = [r * S3 + (r * S3) / 2, 1.5 * r];
  const A: Cluster = {
    at: [1010, 520],
    rings: [a1, a2, a3],
    r,
    aromatic: [0, 2],
    chains: [
      [[-r * S3 / 2, -r / 2], [-r * S3, 0], [-1.5 * r * S3, -r / 2]],
      [[r * S3, -r], [r * S3, -2 * r]],
      [[a3[0] + (r * S3) / 2, a3[1] + r / 2], [a3[0] + r * S3, a3[1]], [a3[0] + 1.5 * r * S3, a3[1] + r / 2]],
    ],
    nodes: [
      { p: [-1.5 * r * S3, -r / 2], accent: true },
      { p: [r * S3, -2 * r] },
      { p: [a3[0] + 1.5 * r * S3, a3[1] + r / 2] },
      { p: [0, r] },
    ],
    drift: { dx: -8, dy: -14, dur: 16 },
    delay: 200,
    opacity: 0.5,
  };

  // A single ring with two substituents.
  const rb = 34;
  const B: Cluster = {
    at: [70, 610],
    rings: [[0, 0]],
    r: rb,
    aromatic: [0],
    chains: [
      [[0, -rb], [0, -2 * rb]],
      [[0, rb], [(rb * S3) / 2, 1.5 * rb], [(rb * S3) / 2, 2.5 * rb]],
    ],
    nodes: [{ p: [0, -2 * rb], accent: true }, { p: [(rb * S3) / 2, 2.5 * rb] }],
    drift: { dx: 6, dy: -10, dur: 13 },
    delay: 500,
    opacity: 0.38,
  };

  // Two fused rings, upper right.
  const rc = 30;
  const C: Cluster = {
    at: [1120, 70],
    rings: [[0, 0], [rc * S3, 0]],
    r: rc,
    aromatic: [1],
    chains: [[[-(rc * S3) / 2, rc / 2], [-rc * S3, 0], [-rc * S3, -rc]]],
    nodes: [{ p: [-rc * S3, -rc] }, { p: [rc * S3, rc] , accent: true }],
    drift: { dx: -5, dy: 9, dur: 15 },
    delay: 800,
    opacity: 0.42,
  };

  return [A, B, C];
}

const CLUSTERS = buildClusters();

export function MoleculeField({ className }: { className?: string }) {
  const ref = usePauseOffscreen<SVGSVGElement>();
  const stagger = (base: number, i: number) => `${base + i * 90}ms`;

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 720"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-primary', className)}
    >
      {CLUSTERS.map((c, ci) => {
        return (
          <g key={ci} transform={`translate(${c.at[0]} ${c.at[1]})`} opacity={c.opacity}>
            <g
              className="pf-drift"
              style={{ '--dx': `${c.drift.dx}px`, '--dy': `${c.drift.dy}px`, '--dur': `${c.drift.dur}s` } as React.CSSProperties}
            >
              <g fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                {c.rings.map((ring, ri) => (
                  <path key={`r${ri}`} d={ringPath(ring, c.r)} pathLength={1} className="pf-draw" style={{ animationDelay: stagger(c.delay, ri) }} />
                ))}
                {(c.aromatic ?? []).flatMap(ri =>
                  innerBonds(c.rings[ri], c.r).map((d, bi) => (
                    <path key={`i${ri}-${bi}`} d={d} pathLength={1} className="pf-draw" strokeOpacity={0.7} style={{ animationDelay: stagger(c.delay + 300, bi) }} />
                  )),
                )}
                {c.chains.map((pts, chi) => (
                  <path key={`c${chi}`} d={chain(pts)} pathLength={1} className="pf-draw" style={{ animationDelay: stagger(c.delay + 450, chi) }} />
                ))}
              </g>
              {c.nodes.map((n, ni) => (
                <circle
                  key={`n${ni}`}
                  cx={n.p[0]}
                  cy={n.p[1]}
                  r={n.accent ? 6 : 4.5}
                  className="pf-pop"
                  fill={n.accent ? 'var(--share-2)' : '#ffffff'}
                  stroke="currentColor"
                  strokeWidth={1.4}
                  style={{ animationDelay: `${c.delay + 900 + ni * 120}ms` }}
                />
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
