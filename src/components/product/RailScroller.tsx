"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

/** Horizontal snap-scrolling row with desktop arrow buttons that hide at either end. */
export function RailScroller({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  const arrow = (show: boolean) =>
    clsx(
      "absolute top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full bg-white p-2 shadow-md ring-1 ring-line transition hover:bg-brand-50",
      show && "md:grid",
    );
  return (
    <div className="relative">
      <div ref={ref} role="region" aria-label={label} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto scroll-smooth px-4 pt-1 pb-3">
        {children}
      </div>
      <button aria-label="Scroll left" onClick={() => scroll(-1)} className={clsx(arrow(!edges.start), "-left-3")}>
        <ChevronLeft className="size-5" />
      </button>
      <button aria-label="Scroll right" onClick={() => scroll(1)} className={clsx(arrow(!edges.end), "-right-3")}>
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
