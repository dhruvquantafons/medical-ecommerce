"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Snap-scrolling row with a progress line and round prev/next buttons underneath (desktop and mobile). */
export function RailScroller({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false, visible: 1, offset: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const visible = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
      setState({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft >= max - 4,
        visible,
        offset: max > 0 ? (el.scrollLeft / max) * (1 - visible) : 0,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const scrollable = state.visible < 0.999;
  const btn = "grid size-11 place-items-center rounded-full border border-ink/15 bg-white text-ink transition hover:border-ink disabled:opacity-30 disabled:hover:border-ink/15";

  return (
    <div>
      <div ref={ref} role="region" aria-label={label} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto scroll-smooth px-4 pb-2 md:-mx-10 md:scroll-px-10 md:gap-4 md:px-10">
        {children}
      </div>
      {scrollable && (
        <div className="mt-6 flex items-center justify-between gap-6">
          <div className="relative h-0.5 w-40 overflow-hidden rounded-full bg-ink/15 md:w-52" aria-hidden>
            <span
              className="absolute inset-y-0 rounded-full bg-ink transition-[left] duration-200"
              style={{ width: `${state.visible * 100}%`, left: `${state.offset * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Scroll left" disabled={state.start} onClick={() => scroll(-1)} className={btn}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Scroll right" disabled={state.end} onClick={() => scroll(1)} className={btn}>
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
