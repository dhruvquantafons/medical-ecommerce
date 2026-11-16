import type { Metadata } from "next";
import type { Product } from "@/data/types";
import { company } from "@/content/site";
import { productSummary } from "@/content/product-copy";

/** Absolute URL on the production origin, for canonical links, Open Graph and JSON-LD. */
export function absoluteUrl(path: string) {
  return new URL(path, `${company.url}/`).toString();
}

/**
 * Page metadata with a canonical URL and matching Open Graph and Twitter tags. `title` goes through the
 * root template ("%s | Syncytium Health"); pass `absoluteTitle` for the home page.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  image,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  image?: { url: string; alt: string; width?: number; height?: number };
  noindex?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${company.name}`;
  const img = image ?? defaultShareImage;
  const ogImages = { images: [img] };
  const twImages = { images: [img.url] };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: company.name, locale: "en_IN", url: path, title: fullTitle, description, ...ogImages },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...twImages },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Default share image: the logo on white, 1200×630 (public/brand/share.png). */
export const defaultShareImage = { url: "/brand/share.png", width: 1200, height: 630, alt: company.name };

type JsonLdObject = Record<string, unknown>;

/** Organization for the landing page. Only fields that are known (non-null in content/site.ts) are emitted. */
export function organizationJsonLd(): JsonLdObject {
  const org: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.url,
    logo: absoluteUrl("/brand/logo.png"),
    description: company.description,
  };
  if (company.legalName) org.legalName = company.legalName;
  if (company.email) org.email = company.email;
  if (company.phone) org.telephone = company.phone;
  if (company.address) org.address = { "@type": "PostalAddress", streetAddress: company.address.join(", "), addressCountry: "IN" };
  if (company.social.length) org.sameAs = company.social.map((s) => s.href);
  return org;
}

/** BreadcrumbList from a trail of { name, path } (first item is usually Home). */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: absoluteUrl(t.path) })),
  };
}

/** Product with an Offer for a store product page. No rating or review data: there are no real reviews. */
export function productJsonLd(p: Product): JsonLdObject {
  const url = absoluteUrl(`/product/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: productSummary(p) || undefined,
    image: p.images.length ? p.images.map((src) => absoluteUrl(src)) : undefined,
    sku: p.slug,
    brand: { "@type": "Brand", name: company.name },
    url,
    offers: {
      "@type": "Offer",
      url,
      price: p.price.toFixed(2),
      priceCurrency: "INR",
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
