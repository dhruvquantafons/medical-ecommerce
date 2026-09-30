"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Banner } from "@/data/types";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [paused, banners.length]);

  useEffect(() => {
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
  }, [index]);

  const go = (d: number) => setIndex((i) => (i + d + banners.length) % banners.length);

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index && Math.abs(el.scrollLeft - i * el.clientWidth) < 4) setIndex(i);
        }}
      >
        {banners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="relative flex min-h-44 w-full shrink-0 snap-start flex-col justify-center overflow-hidden p-6 text-white md:min-h-56 md:p-10"
            style={{ background: `linear-gradient(120deg, ${b.from}, ${b.to})` }}
          >
            <div className="absolute -right-10 -bottom-16 size-64 rounded-full bg-white/10" />
            <div className="absolute top-6 right-24 size-24 rounded-full bg-white/10" />
            <h3 className="relative max-w-md text-2xl font-extrabold md:text-3xl">{b.title}</h3>
            <p className="relative mt-2 max-w-md text-sm text-white/90 md:text-base">{b.subtitle}</p>
            <span className="relative mt-4 inline-flex w-fit rounded-lg bg-white px-4 py-2 text-sm font-bold" style={{ color: b.from }}>
              {b.cta}
            </span>
          </Link>
        ))}
      </div>
      <button aria-label="Previous banner" onClick={() => go(-1)} className="absolute top-1/2 left-2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow md:block">
        <ChevronLeft className="size-5" />
      </button>
      <button aria-label="Next banner" onClick={() => go(1)} className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow md:block">
        <ChevronRight className="size-5" />
      </button>
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {banners.map((b, i) => (
          <button key={b.id} aria-label={`Go to banner ${i + 1}`} onClick={() => setIndex(i)} className={clsx("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-white" : "w-1.5 bg-white/60")} />
        ))}
      </div>
    </div>
  );
}
