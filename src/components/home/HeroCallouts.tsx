import { Bone, Dna, Droplet, Footprints, HeartPulse, Pill, Sun, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import type { CSSProperties } from "react";
import type { HeroCallout } from "@/data/types";

const ICONS: Record<string, LucideIcon> = { Bone, Dna, Droplet, Footprints, HeartPulse, Pill, Sun };

/** Orbit radius shared by the ring and the callouts sitting on it; set per breakpoint on the hero section. */
const RADIUS = "var(--hero-orbit)";

const glass = "border border-white/30 bg-white/12 shadow-[0_8px_32px_rgb(30_10_80/0.25),inset_0_1px_0_rgb(255_255_255/0.35)] backdrop-blur-md";

/** Thin orbit ring around the model; a dashed outer ring turns slowly. */
export function HeroOrbit({ active }: { active: boolean }) {
  const ring = { width: `calc(${RADIUS} * 2)`, height: `calc(${RADIUS} * 2)` };
  return (
    <div aria-hidden className={clsx("absolute inset-0 grid place-items-center transition-opacity duration-1000", active ? "opacity-100" : "opacity-0")}>
      <div className="absolute rounded-full border border-white/25" style={ring} />
      <div className="absolute rounded-full border border-dashed border-white/20 motion-safe:animate-[hero-spin_80s_linear_infinite]" style={{ width: `calc(${RADIUS} * 2 + 48px)`, height: `calc(${RADIUS} * 2 + 48px)` }} />
    </div>
  );
}

function Bars() {
  return (
    <span className="flex h-7 items-end gap-[3px]">
      {[0.45, 0.7, 0.55, 0.9, 0.75].map((h, i) => (
        <span
          key={i}
          className="w-1.5 origin-bottom rounded-full bg-gradient-to-t from-sky-300 to-white motion-safe:animate-[hero-bar_2.4s_ease-in-out_infinite]"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

function Pulse() {
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-20" fill="none">
      <path
        d="M0 16h16l4-8 6 16 6-22 5 14h10l3-4 3 4h27"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="[stroke-dasharray:1] motion-safe:animate-[hero-draw_2.6s_ease-in-out_infinite]"
      />
    </svg>
  );
}

function Callout({ c }: { c: HeroCallout }) {
  if (c.kind === "card") {
    return (
      <div className={clsx(glass, "flex items-center gap-4 rounded-2xl py-3 pr-4 pl-4 text-white")}>
        <div>
          <p className="text-[11px] tracking-wide text-white/70">{c.label}</p>
          <p className="text-base leading-tight font-semibold whitespace-nowrap">{c.value}</p>
        </div>
        {c.viz === "pulse" ? <Pulse /> : <Bars />}
      </div>
    );
  }
  const Icon = ICONS[c.icon ?? ""] ?? HeartPulse;
  return (
    <div className="flex flex-col items-center gap-2 text-white">
      <span className={clsx(glass, "grid size-16 place-items-center rounded-full")}>
        <Icon className="size-6" strokeWidth={1.6} />
      </span>
      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap backdrop-blur-sm">{c.label}</span>
    </div>
  );
}

/** Glass bubbles and stat cards placed on the orbit ring; they rise in one after another and then drift. */
export function HeroCallouts({ callouts, active }: { callouts: HeroCallout[]; active: boolean }) {
  return (
    // Desktop only: on a phone the model area is too small for cards around it.
    <div aria-hidden className="absolute inset-0 hidden lg:block">
      {callouts.map((c, i) => {
        const rad = (c.angle * Math.PI) / 180;
        const pos: CSSProperties = {
          left: `calc(50% + ${Math.cos(rad).toFixed(3)} * ${RADIUS})`,
          top: `calc(50% + ${Math.sin(rad).toFixed(3)} * ${RADIUS})`,
        };
        const delay = active ? `${300 + i * 140}ms` : "0ms";
        return (
          <div key={c.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos}>
            <div
              className={clsx("transition duration-700 ease-out", active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
              style={{ transitionDelay: delay }}
            >
              <div className="motion-safe:animate-[hero-float_6s_ease-in-out_infinite]" style={{ animationDelay: `${i * -1.5}s` }}>
                <Callout c={c} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
