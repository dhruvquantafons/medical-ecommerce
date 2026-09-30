import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { ListingView } from "@/components/listing/ListingView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <ListingView
      basePath={`/category/${slug}`}
      searchParams={await searchParams}
      category={slug}
      header={
        <>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} />
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl" style={{ background: `${category.color}18`, color: category.color }}>
              <Icon name={category.icon} className="size-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold md:text-2xl">{category.name}</h1>
              <p className="text-sm text-muted">{category.description}</p>
            </div>
          </div>
        </>
      }
    />
  );
}
