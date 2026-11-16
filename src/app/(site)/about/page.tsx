import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/content/site";
import { getCategories } from "@/lib/catalog";
import { AboutPage } from "@/components/portfolio/pages/AboutPage";

export const metadata: Metadata = pageMetadata({ title: "About", description: company.description, path: "/about" });

export default async function About() {
  return <AboutPage categories={await getCategories()} />;
}
