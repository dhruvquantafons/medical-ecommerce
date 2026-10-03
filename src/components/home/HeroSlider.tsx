"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import type { HeroSlide } from "@/data/types";

const INTERVAL = 6500;

/** Full-bleed hero carousel. Slides cross-fade; autoplay pauses on hover/focus and for reduced motion. */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, reduceMotion, slides.length]);

  const go = (d: number) => setIndex((i) => (i + d + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative -mt-[72px] h-[88svh] max-h-[820px] min-h-[560px] overflow-hidden bg-brand-800 md:-mt-[80px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
          aria-hidden={i !== index}
          inert={i !== index}
          className={clsx("absolute inset-0 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")}
        >
          <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" unoptimized={s.image.endsWith(".svg")} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/35" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 pt-16 text-center text-white">
            <p className="text-xs font-medium tracking-[0.2em] uppercase md:text-sm">{s.eyebrow}</p>
            <h1 className="display mt-4 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
              {s.title} <em className="text-lime">{s.emphasis}</em>
            </h1>
            <Link
              href={s.href}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-lime py-1.5 pr-1.5 pl-5 text-[15px] font-semibold text-brand-800 transition hover:bg-lime-strong"
            >
              {s.cta}
              <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-14 flex items-center justify-center gap-4 text-sm text-white md:bottom-16">
          <span className="tabular-nums" aria-live="polite">
            {index + 1}/{slides.length}
          </span>
          <span className="relative h-px w-28 bg-white/35" aria-hidden>
            <span className="absolute inset-y-0 bg-white transition-all duration-500" style={{ width: `${100 / slides.length}%`, left: `${(index * 100) / slides.length}%` }} />
          </span>
          <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className="grid size-8 place-items-center rounded-full hover:bg-white/15">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" aria-label="Next slide" onClick={() => go(1)} className="-ml-3 grid size-8 place-items-center rounded-full hover:bg-white/15">
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
}
