import { ChevronLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminProduct, listAdminCategories } from "@/lib/admin.server";
import { toFormValues } from "@/lib/admin-product-form";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), listAdminCategories()]);
  if (!product) notFound();
  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        <ChevronLeft className="size-4" /> Products
      </Link>
      <PageHeader
        title={product.name}
        subtitle={product.active ? "Visible in store" : "Hidden from store"}
        actions={
          product.active && (
            <Link href={`/product/${product.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
              View in store <ExternalLink className="size-4" />
            </Link>
          )
        }
      />
      <ProductForm key={product.updatedAt.toISOString()} initial={toFormValues(product)} categories={categories} />
    </>
  );
}
