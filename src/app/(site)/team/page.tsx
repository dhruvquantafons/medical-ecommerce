import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { company } from "@/content/site";
import { getEmployees } from "@/lib/employees";
import { TeamPage } from "@/components/portfolio/pages/TeamPage";

export const metadata: Metadata = pageMetadata({ title: "Team", description: `The people behind ${company.name}.`, path: "/team" });

export default async function Team() {
  // The employee rows in the database are placeholder people with placeholder-avatar photos, so the page
  // stays hidden until the owner confirms a real team (content/site.ts → company.hasTeam).
  if (!company.hasTeam) notFound();
  return <TeamPage members={await getEmployees()} />;
}
