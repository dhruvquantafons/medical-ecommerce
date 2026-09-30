import type { Metadata } from "next";
import { listAdminCategories } from "@/lib/admin.server";
import { PageHeader } from "@/components/admin/ui";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();
  return (
    <>
      <PageHeader title="Categories" subtitle="Shown in the store header, footer and home page, in this order." />
      <CategoryManager categories={categories} />
    </>
  );
}
