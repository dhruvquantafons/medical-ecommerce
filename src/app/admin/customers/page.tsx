import type { Metadata } from "next";
import Link from "next/link";
import { listCustomers } from "@/lib/admin.server";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/lib/order-labels";
import { EmptyState, FilterBar, PageHeader, Pagination, Table, inputClass, pageParam, strParam, td, th } from "@/components/admin/ui";
import { Button, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage({ searchParams }: PageProps<"/admin/customers">) {
  const sp = await searchParams;
  const q = strParam(sp.q);
  const page = pageParam(sp.page);
  const { rows, total, pages } = await listCustomers({ q, page });

  return (
    <>
      <PageHeader title="Customers" subtitle={`${total} account${total === 1 ? "" : "s"}`} />
      <FilterBar>
        <input name="q" defaultValue={q} placeholder="Name or email" aria-label="Search customers" className={`${inputClass} w-64 max-w-full`} />
        <Button type="submit">Search</Button>
        {q && <ButtonLink href="/admin/customers" variant="ghost">Clear</ButtonLink>}
      </FilterBar>
      {rows.length ? (
        <>
          <Table>
            <thead>
              <tr>
                <th className={th}>Customer</th>
                <th className={th}>Joined</th>
                <th className={`${th} text-right`}>Orders</th>
                <th className={`${th} text-right`}>Total spent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-brand-50/40">
                  <td className={td}>
                    <Link href={`/admin/customers/${c.id}`} className="font-semibold hover:text-brand-700">{c.name}</Link>
                    {c.role === "admin" && <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800 uppercase">Admin</span>}
                    {c.banned && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 uppercase">Banned</span>}
                    <p className="text-xs text-muted">{c.email}</p>
                  </td>
                  <td className={`${td} text-muted`}>{formatDateTime(c.createdAt)}</td>
                  <td className={`${td} text-right tabular-nums`}>{c.orderCount}</td>
                  <td className={`${td} text-right font-semibold tabular-nums`}>{formatPrice(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={page} pages={pages} basePath="/admin/customers" params={{ q }} />
        </>
      ) : (
        <EmptyState title="No customers match" />
      )}
    </>
  );
}
