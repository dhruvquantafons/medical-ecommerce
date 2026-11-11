import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicMrFolderBySlug } from "@/lib/mr-folders";
import { MrFolderViewer } from "@/components/mr/MrFolderViewer";

export async function generateMetadata({ params }: PageProps<"/mr/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublicMrFolderBySlug(slug);
  return { title: detail ? detail.folder.name : "Folder" };
}

export default async function MrFolderPage({ params }: PageProps<"/mr/[slug]">) {
  const { slug } = await params;
  const detail = await getPublicMrFolderBySlug(slug);
  if (!detail) notFound();

  return <MrFolderViewer detail={detail} />;
}

