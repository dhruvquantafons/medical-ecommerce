import type { MetadataRoute } from "next";
import { company } from "@/content/site";
import { getCategories, getProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

// Built from the live catalogue on each request, like the rest of the site.
export const dynamic = "force-dynamic";

/** Every public, indexable route: company pages, help pages, the store, each collection and each product. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts({})]);
  const pages = ["/", "/about", "/products", ...(company.hasTeam ? ["/team"] : []), "/contact", "/store", "/shop", "/faq", "/shipping-returns", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({ url: absoluteUrl(`/product/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
