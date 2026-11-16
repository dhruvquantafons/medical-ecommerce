"use client";

import type { CatalogItem } from "@/lib/catalog-item-types";
import { displayBrand, parseSalts } from "@/lib/catalog-item-types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Chip } from "@/components/site/Chip";

/*
 * Catalogue product details. Interim version (Problems 02, 03, 08, 09): a shadcn dialog (focus trap,
 * Escape, focus returns to the trigger, scrolls inside on short screens). The "Google Schema" code
 * panel, the "Verified Salt Formula" badge, the "Digital ID" line and the bracketed percentages are
 * removed. Problem 19 replaces this dialog with a page per product.
 */
export function MedicineModal({ item, onClose }: { item: CatalogItem | null; onClose: () => void }) {
  const salts = item ? parseSalts(item.salts) : [];
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      {item && (
        <DialogContent className="flex max-h-[calc(100svh-2rem)] flex-col gap-0 p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-line p-6 pr-14">
            <p className="flex flex-wrap items-center gap-2">
              <Chip>{item.category}</Chip>
              <Chip>{item.dosageForm}</Chip>
            </p>
            <DialogTitle className="mt-2 font-display text-3xl font-medium tracking-[-0.02em] text-ink">{item.name}</DialogTitle>
            <DialogDescription className="text-[15px] text-ink-muted">Made by {displayBrand(item.brand)}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {item.imageUrl && (
              <div className="mx-auto aspect-square max-w-xs overflow-hidden rounded-card bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs on any host */}
                <img src={item.imageUrl} alt={`${item.name} pack`} className="size-full object-contain p-[8%]" />
              </div>
            )}
            {item.description && <p className="mt-6 max-w-prose text-base whitespace-pre-line text-ink">{item.description}</p>}

            {salts.length > 0 && (
              <>
                <h3 className="mt-8 text-lg font-medium text-ink">Composition</h3>
                <Table className="mt-3">
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Ingredient</TableHead>
                      <TableHead scope="col">Amount</TableHead>
                      <TableHead scope="col">Role</TableHead>
                      <TableHead scope="col">CAS number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salts.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="text-[15px] whitespace-normal text-ink">{s.name}</TableCell>
                        <TableCell className="font-mono text-sm">{s.amount}</TableCell>
                        <TableCell className="text-[15px] whitespace-normal text-ink-muted">{s.purpose}</TableCell>
                        <TableCell className="font-mono text-sm text-ink-muted">{s.casNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>

          <DialogFooter className="mx-0 mb-0 border-line bg-background">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
