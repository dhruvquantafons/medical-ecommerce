import type { Metadata } from "next";
import Link from "next/link";
import { LOW_STOCK, listAdminCategories, listAdminProducts } from "@/lib/admin.server";
import { formatPrice } from "@/lib/format";
import { EmptyState, FilterBar, PageHeader, Pagination, Table, inputClass, pageParam, strParam, td, th } from "@/components/admin/ui";
import { ProductImage } from "@/components/product/ProductImage";
import { RxBadge } from "@/components/product/Badges";
import { Button, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Products" };

const statuses = { active: "Visible", inactive: "Hidden", low: "Low stock" } as const;

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = strParam(sp.q);
  const category = Number(strParam(sp.category)) || undefined;
  const status = (Object.keys(statuses) as (keyof typeof statuses)[]).find((s) => s === strParam(sp.status));
  const page = pageParam(sp.page);
  const [{ rows, total, pages }, categories] = await Promise.all([listAdminProducts({ q, category, status, page }), listAdminCategories()]);

  return (
    <>
      <PageHeader title="Products" subtitle={`${total} product${total === 1 ? "" : "s"}`} actions={<ButtonLink href="/admin/products/new">+ New product</ButtonLink>} />
      <FilterBar>
        <input name="q" defaultValue={q} placeholder="Name, brand or composition" aria-label="Search products" className={`${inputClass} w-64 max-w-full`} />
        <select name="category" defaultValue={category ?? ""} aria-label="Category" className={inputClass}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="status" defaultValue={status ?? ""} aria-label="Status" className={inputClass}>
          <option value="">Any status</option>
          {Object.entries(statuses).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <Button type="submit">Filter</Button>
        {(q || category || status) && <ButtonLink href="/admin/products" variant="ghost">Clear</ButtonLink>}
      </FilterBar>
      {rows.length ? (
        <>
          <Table>
            <thead>
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={`${th} text-right`}>Price</th>
                <th className={`${th} text-right`}>Stock</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-brand-50/40">
                  <td className={td}>
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                      <span className="w-11 shrink-0"><ProductImage product={p} /></span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-semibold hover:text-brand-700">
                          <span className="truncate">{p.name}</span> {p.rxRequired && <RxBadge />}
                        </span>
                        <span className="block text-xs text-muted">{p.brand} · {p.packSize}</span>
                      </span>
                    </Link>
                  </td>
                  <td className={td}>{p.categoryName}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    <span className="font-semibold">{formatPrice(p.price)}</span>
                    {p.discountPct > 0 && <span className="block text-xs text-muted line-through">{formatPrice(p.mrp)}</span>}
                  </td>
                  <td className={`${td} text-right tabular-nums`}>
                    <span className={p.stock === 0 ? "font-bold text-red-700" : p.stock <= LOW_STOCK ? "font-bold text-amber-700" : ""}>{p.stock}</span>
                  </td>
                  <td className={td}>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${p.active ? "bg-green-50 text-green-700 ring-green-200" : "bg-gray-100 text-gray-600 ring-gray-200"}`}>
                      {p.active ? "Visible" : "Hidden"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={page} pages={pages} basePath="/admin/products" params={{ q, category: category ? String(category) : undefined, status }} />
        </>
      ) : (
        <EmptyState title="No products match" text="Try a different search or filter." action={<ButtonLink href="/admin/products/new">+ New product</ButtonLink>} />
      )}
    </>
  );
}
