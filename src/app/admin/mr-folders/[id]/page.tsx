import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminMrFolderById } from "@/lib/mr-folders";
import { MrFolderDetail } from "@/components/admin/MrFolderDetail";

export async function generateMetadata({ params }: PageProps<"/admin/mr-folders/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getAdminMrFolderById(id);
  return { title: detail ? detail.folder.name : "Folder" };
}

export default async function AdminMrFolderDetailPage({ params }: PageProps<"/admin/mr-folders/[id]">) {
  const { id } = await params;
  const detail = await getAdminMrFolderById(id);
  if (!detail) notFound();

  return <MrFolderDetail detail={detail} />;
}

