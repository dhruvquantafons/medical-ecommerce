"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";
import type { HeroSlide } from "@/data/types";
import { HeroCallouts, HeroOrbit } from "./HeroCallouts";

const INTERVAL = 6500;

// three.js is ~250 KB: load it in its own chunk, client-only, and only on pages whose hero has a model.
const HeroModel = dynamic(() => import("./HeroModel"), { ssr: false });

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

  const models = useMemo(() => slides.flatMap((s) => (s.model ? [s.model] : [])), [slides]);

  // On phones the model sits under the text, so track where the tallest slide's text ends (it changes with wrapping
  // and font loading) and start the model area below it.
  const sectionRef = useRef<HTMLElement>(null);
  const [textBottom, setTextBottom] = useState(0);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || models.length === 0) return;
    const measure = () => {
      const top = section.getBoundingClientRect().top;
      const ctas = section.querySelectorAll<HTMLElement>("[data-hero-cta]");
      setTextBottom(Math.max(0, ...Array.from(ctas, (el) => el.getBoundingClientRect().bottom - top)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    section.querySelectorAll("h1").forEach((h) => ro.observe(h));
    return () => ro.disconnect();
  }, [models.length]);

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
      ref={sectionRef}
      className={clsx(
        "relative -mt-[72px] h-[88svh] max-h-[820px] min-h-[560px] overflow-hidden bg-brand-gradient-glow md:-mt-[80px] lg:[--hero-orbit:min(19vw,30svh)]",
        // Phones: full screen height so the model under the text gets room; the orbit ring fits the model area.
        models.length > 0 && "max-lg:h-[100svh] max-lg:max-h-none max-lg:min-h-[640px] [--hero-orbit:min(40cqw,40cqh)]",
      )}
      // Slides with a model: on phones the text sits at the top and the model fills the space between it and the slide
      // controls. On desktop they lay out inside the header's max-w-7xl column: text on the left 45%, model on the
      // right 55%, so the two stay together on wide screens. Percentages resolve against the section's width.
      style={
        {
          "--hero-edge": "max(1.5rem, calc((100% - 80rem) / 2))",
          "--hero-model-w": "calc((100% - 2 * var(--hero-edge)) * 0.55)",
          "--hero-text-bottom": `${textBottom}px`,
        } as CSSProperties
      }
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
          {s.image && !s.model && (
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              unoptimized={s.image.endsWith(".svg")}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/35" />
          <div
            className={clsx(
              "relative flex h-full flex-col items-center justify-center px-6 pt-16 text-center text-white",
              s.model && "max-lg:justify-start max-lg:pt-[max(6rem,12svh)] lg:items-start lg:pr-[calc(var(--hero-edge)+var(--hero-model-w))] lg:pl-[calc(var(--hero-edge)+1rem)] lg:text-left",
            )}
          >
            <p className="text-xs font-medium tracking-[0.2em] uppercase md:text-sm">{s.eyebrow}</p>
            <h1 className="display mt-4 max-w-3xl text-4xl text-balance sm:text-5xl lg:text-6xl">
              {s.title} <em className="text-accent">{s.emphasis}</em>
            </h1>
            <Link
              href={s.href}
              data-hero-cta
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent py-1.5 pr-1.5 pl-5 text-[15px] font-semibold text-brand-800 transition hover:bg-accent-strong"
            >
              {s.cta}
              <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      ))}

      {models.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--hero-text-bottom)+0.75rem)] bottom-24 [container-type:size] lg:inset-y-0 lg:right-(--hero-edge) lg:left-auto lg:w-(--hero-model-w)">
          {slides.map((s, i) => (
            <div
              key={s.id}
              aria-hidden
              className={clsx("absolute inset-0 transition-opacity duration-1000", i === index && s.model ? "opacity-100" : "opacity-0")}
              style={{ backgroundImage: `radial-gradient(40% 40% at 50% 52%, ${s.glow ?? "rgb(237 233 254 / 0.35)"}, transparent 70%)` }}
            />
          ))}
          <HeroOrbit active={!!slides[index].model} />
          <HeroModel slide={slides[index]} models={models} still={reduceMotion} />
          {slides.map((s, i) => s.callouts && <HeroCallouts key={s.id} callouts={s.callouts} active={i === index} />)}
        </div>
      )}

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
