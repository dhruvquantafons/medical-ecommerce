"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { HeroSlide } from "@/data/types";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/site/Container";

/*
 * Store hero carousel. Interim version (changeui.md Problems 02, 07, 08): the 3D knee and heart models,
 * the floating "72 bpm" instrument chips, the gradient and dark overlay and the auto-advance are gone.
 * Slides change only with the previous and next buttons, and only the active slide is rendered, so two
 * headlines are never visible at once. Problem 20 redesigns the store hero.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  if (slides.length === 0) return null;
  const go = (d: number) => setIndex((i) => (i + d + slides.length) % slides.length);
  const s = slides[index];

  return (
    <section aria-roledescription="carousel" aria-label="Featured collections" className="border-b border-line bg-surface">
      <Container className="grid items-center gap-8 py-12 md:grid-cols-12 md:gap-12 md:py-16">
        <div
          key={s.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
          className="animate-enter md:col-span-6"
        >
          <p className="text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">{s.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">{s.title}</h2>
          <ButtonLink href={s.href} className="mt-8">
            {s.cta} <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
        <div className="md:col-span-6">
          <div className="overflow-hidden rounded-card border border-line bg-background">
            <Image
              key={s.image}
              src={s.image}
              alt={s.imageAlt}
              width={s.imageWidth}
              height={s.imageHeight}
              priority={index === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>

        {slides.length > 1 && (
          <div className="flex items-center gap-2 md:col-span-12">
            <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-control border border-line bg-background text-ink hover:border-ink-subtle">
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => go(1)} className="grid size-11 place-items-center rounded-control border border-line bg-background text-ink hover:border-ink-subtle">
              <ChevronRight aria-hidden className="size-5" />
            </button>
            <span className="ml-2 text-sm text-ink-muted tabular-nums" aria-live="polite">
              {index + 1} of {slides.length}
            </span>
          </div>
        )}
      </Container>
    </section>
  );
}
