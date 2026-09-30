import type { Metadata } from "next";
import { getCategories } from "@/lib/catalog";
import { concerns } from "@/data/home";
import { CategoryGrid, ConcernGrid, SectionTitle } from "@/components/home/Sections";

export const metadata: Metadata = { title: "All categories" };

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      <div>
        <SectionTitle>All categories</SectionTitle>
        <CategoryGrid categories={categories} />
      </div>
      <div>
        <SectionTitle>Shop by health concern</SectionTitle>
        <ConcernGrid concerns={concerns} />
      </div>
    </div>
  );
}
