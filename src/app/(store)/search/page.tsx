import type { Metadata } from "next";
import { ListingView } from "@/components/listing/ListingView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const sp = await searchParams;
  const q = str(sp.q);
  const label = str(sp.label);
  return { title: q ? `Search results for “${q}”` : label || "All products" };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = str(sp.q);
  const label = str(sp.label);
  const heading = q ? <>Results for “{q}”</> : label || "All products";

  return (
    <ListingView
      basePath="/search"
      searchParams={sp}
      header={
        <>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: q ? "Search" : label || "All products" }]} />
          <h1 className="mt-3 text-xl font-bold md:text-2xl">{heading}</h1>
        </>
      }
    />
  );
}
