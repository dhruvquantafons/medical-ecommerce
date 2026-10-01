import type { Metadata } from "next";
import { listAdminCategories } from "@/lib/admin.server";
import { PageHeader } from "@/components/admin/ui";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Collections" };

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();
  return (
    <>
      <PageHeader title="Collections" subtitle="Shown in the store navigation, shop tabs and home page, in this order. Collections without visible products are hidden from the store." />
      <CategoryManager categories={categories} />
    </>
  );
}
