import type { ActiveSalt } from '@/lib/catalog-item-types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

/**
 * Ingredient, amount per unit, role and CAS number (Geist Mono for amounts and CAS).
 * The bracketed percentage shares in the data are left out: they do not follow from the
 * milligram amounts (changeui.md, Problem 14). Roles are the data's own wording.
 */
export function CompositionTable({ salts, productName, compact = false }: { salts: ActiveSalt[]; productName: string; compact?: boolean }) {
  return (
    <Table>
      <TableCaption className="sr-only">Composition of {productName}</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-muted-foreground">Ingredient</TableHead>
          <TableHead className="text-muted-foreground">Amount per unit</TableHead>
          <TableHead className="text-muted-foreground">Role</TableHead>
          {!compact && <TableHead className="text-muted-foreground">CAS number</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {salts.map((salt, i) => (
          <TableRow key={`${salt.name}-${i}`} className="hover:bg-transparent">
            <TableHead scope="row" className="whitespace-normal font-medium text-foreground">{salt.name}</TableHead>
            <TableCell className="font-mono text-[14px]">{salt.amount}</TableCell>
            {/* TODO(owner): confirm each ingredient's role; empty cells mean the data has none. */}
            <TableCell className="whitespace-normal text-muted-foreground">{salt.purpose}</TableCell>
            {!compact && <TableCell className="font-mono text-[14px] text-muted-foreground">{salt.casNumber}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
