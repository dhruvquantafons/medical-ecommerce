import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/types";
import { company } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";

/*
 * /about. Interim version (Problems 02, 03, 04, 07): removed the two pills, the "Back to Home" button,
 * the four unsourced statistics, the DNA helix, the three tabs (including the schema JSON panel), the
 * sentence naming Apollo Pharmacy, MedPlus and Netmeds as collaborators, all FDA / WHO wording and the
 * four "Verified Standard" cards. Problem 16 rebuilds this page with the owner's real story.
 *
 * TODO(owner): two short paragraphs on who the company is, where it is based and when it started;
 * a real photograph of the facility, team or product range; the quality process step by step.
 */
export function AboutPage({ categories }: { categories: Category[] }) {
  return (
    <>
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <SectionHeading as="h1" title={`About ${company.name}`} lead={company.description} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/products">
                View all products <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contact us <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-card border border-line bg-surface">
              <Image
                src="/portfolio/assets/medicine_lycotium_softgel.png"
                alt="LYCOTIUM omega-3 softgels jar with loose softgels"
                width={878}
                height={1048}
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {categories.length > 0 && (
        <Section tone="surface">
          <SectionHeading eyebrow="Range" title="What we make" lead="Our store range covers these therapeutic areas." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  className="flex h-full flex-col rounded-card border border-line bg-background p-6 transition-colors hover:border-ink-subtle"
                >
                  <span className="text-lg font-medium text-ink">{c.name}</span>
                  <span className="mt-2 text-[15px] text-ink-muted">{c.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
