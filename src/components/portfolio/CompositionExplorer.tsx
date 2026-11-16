"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog-item-types";
import { parseSalts } from "@/lib/catalog-item-types";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipCard } from "@/components/ui/tooltip-card";

/*
 * "What's inside" (changeui.md Problem 14), at the landing section id "salt-inspector" so old links still
 * land here. Tabs for a handful of catalogue products; each shows the pack, then a table of ingredient,
 * amount per unit and role. All wording comes from the catalogue data: no new pharmacological claims.
 *
 * TODO(owner): a two-sentence plain-language explanation for each ingredient. Until then the info card
 * repeats the role and CAS number from the data. Pack sizes are not stored for catalogue items either.
 */
export function CompositionExplorer({ items }: { items: CatalogItem[] }) {
  const featured = items.filter((i) => parseSalts(i.salts).length > 0).slice(0, 5);
  if (featured.length === 0) return null;

  return (
    <Section id="salt-inspector">
      <SectionHeading
        eyebrow="Composition"
        title="See exactly what's in each formulation"
        lead="Choose a product to see every ingredient, the amount in each unit and what it is there for."
      />
      <Tabs defaultValue={featured[0].id} className="mt-10 gap-6">
        <TabsList aria-label="Products" className="no-scrollbar h-auto max-w-full justify-start overflow-x-auto">
          {featured.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="min-h-11 shrink-0 px-4">
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {featured.map((item) => {
          const salts = parseSalts(item.salts);
          return (
            <TabsContent key={item.id} value={item.id} className="grid gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-4">
                <div className="aspect-square overflow-hidden rounded-card border border-line bg-surface">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs on any host
                    <img src={item.imageUrl} alt={`${item.name} pack`} loading="lazy" className="size-full object-contain p-[12%]" />
                  )}
                </div>
                <h3 className="mt-4 text-xl font-medium text-ink">{item.name}</h3>
                <p className="mt-1 text-[15px] text-ink-muted">
                  {item.dosageForm} · {item.category}
                </p>
                <Link
                  href={`/products?item=${encodeURIComponent(item.id)}`}
                  className="mt-2 inline-flex min-h-11 items-center text-[15px] font-medium text-brand hover:underline hover:underline-offset-4"
                >
                  View product details
                </Link>
              </div>

              <div className="md:col-span-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Ingredient</TableHead>
                      <TableHead scope="col">Amount per unit</TableHead>
                      <TableHead scope="col">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salts.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="text-[15px] whitespace-normal text-ink">
                          <span className="inline-flex items-center gap-1">
                            {s.name}
                            <TooltipCard
                              label={`About ${s.name}`}
                              content={
                                <>
                                  <span className="block font-medium text-ink">{s.name}</span>
                                  {s.purpose && <span className="mt-1 block">{s.purpose}.</span>}
                                  {s.casNumber && (
                                    <span className="mt-1 block">
                                      CAS number <span className="font-mono text-ink">{s.casNumber}</span>
                                    </span>
                                  )}
                                </>
                              }
                            >
                              <Info aria-hidden className="size-4" />
                            </TooltipCard>
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-ink">{s.amount}</TableCell>
                        <TableCell className="text-[15px] whitespace-normal text-ink-muted">{s.purpose}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-4 text-sm text-ink-subtle">Read the label before use and take medicines only as advised by your doctor.</p>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </Section>
  );
}
