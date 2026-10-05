import type { Metadata } from "next";
import { getAllCatalogItems } from "@/lib/catalog-items";
import { PageHeader } from "@/components/admin/ui";
import { CatalogItemManager } from "@/components/admin/CatalogItemManager";

export const metadata: Metadata = { title: "Catalog" };

export default async function AdminCatalogPage() {
  const items = await getAllCatalogItems();
  return (
    <>
      <PageHeader
        title="Catalog"
        subtitle="Portfolio medicine showcase. Each item appears in the digital catalog, the home page featured section, and the salt inspector."
      />
      <CatalogItemManager items={items} />
    </>
  );
}
