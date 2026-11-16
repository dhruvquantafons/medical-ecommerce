import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { company } from "@/content/site";
import { areaPhrase, heroEyebrow, listPhrase } from "@/content/landing";
import { ButtonLink } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";
import { Container } from "@/components/site/Container";
import { cn } from "@/lib/utils";

export type HeroFact = { value: number; label: string };

/*
 * Landing hero (changeui.md Problem 10): what the company makes and what a visitor can do, in one screen.
 * Two columns (text first on mobile), a composed still of real packs, and a proof row of facts counted from
 * the product data. No avatars, star ratings, customer counts or brand chips.
 */
export function HeroSection({ headline, areas, facts }: { headline: string; areas: string[]; facts: HeroFact[] }) {
  const areaList = listPhrase(areas.map(areaPhrase));
  return (
    <section id="hero" className="relative overflow-hidden border-b border-line">
      {/* Magic UI Dot Pattern in the border colour, fading out by the middle of the section. */}
      <DotPattern width={20} height={20} cr={1.2} className="text-line [mask-image:linear-gradient(to_bottom,#000,transparent_55%)]" />
      <Container className="relative py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-sm font-medium tracking-[0.08em] text-ink-muted uppercase">{heroEyebrow}</p>
            <TextAnimate
              as="h1"
              by="word"
              animation="blurIn"
              once
              startOnView={false}
              duration={0.6}
              className="mt-4 max-w-[14ch] font-display text-4xl font-medium tracking-[-0.02em] text-ink lg:text-6xl"
            >
              {headline}
            </TextAnimate>
            {areas.length > 0 && (
              <p className="mt-6 max-w-prose text-lg text-ink-muted">
                {company.name} makes its own formulations for {areaList}. Part of the range is sold direct through our store.
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/shop" size="lg">
                Shop the range <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/products" variant="outline" size="lg">
                View all products
              </ButtonLink>
            </div>
          </div>

          {/* A composed still of real packs: one large frame and two smaller shots offset below. No rotation. */}
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-card border border-line bg-surface">
              <Image
                src="/portfolio/assets/medicine_hep_ob.jpg"
                alt="HEP-OB tablets carton and blister strip"
                width={1013}
                height={1024}
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="relative -mt-10 ml-[18%] grid grid-cols-2 gap-3 md:-mt-14">
              {[
                { src: "/portfolio/assets/medicine_syngut.jpg", alt: "SYN-GUT suspension carton with a 5 ml mini bottle", w: 1024, h: 898 },
                { src: "/portfolio/assets/medicine_lycotium_softgel.png", alt: "LYCOTIUM omega-3 softgels jar", w: 878, h: 1048 },
              ].map((img) => (
                <div key={img.src} className="overflow-hidden rounded-card border border-line bg-background p-1.5 shadow-raised">
                  <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes="(min-width: 768px) 18vw, 40vw" className="aspect-square w-full rounded-[10px] object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proof row: only facts counted from the product data (see app/(site)/page.tsx). */}
        {facts.length >= 3 && (
          <dl className="mt-16 grid grid-cols-1 border-y border-line sm:grid-cols-3 md:mt-20">
            {facts.map((f, i) => (
              <div key={f.label} className={cn("flex flex-col gap-1 py-6 sm:px-6", i > 0 && "border-t border-line sm:border-t-0 sm:border-l", i === 0 && "sm:pl-0")}>
                <dt className="order-2 text-[15px] text-ink-muted">{f.label}</dt>
                <dd className="order-1 font-display text-4xl font-medium tracking-[-0.02em] text-ink">
                  <NumberTicker value={f.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
        {/* TODO(owner): certification and licence marks. When content/site.ts lists them, show them here in one quiet
            row (Magic UI Marquee only if there are more than six). */}
      </Container>
    </section>
  );
}
