import type { Metadata } from "next";
import { listAdminCategories } from "@/lib/admin.server";
import { emptyProduct } from "@/lib/admin-product-form";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await listAdminCategories();
  return (
    <>
      <PageHeader title="New product" />
      <ProductForm initial={emptyProduct} categories={categories} />
    </>
  );
}
