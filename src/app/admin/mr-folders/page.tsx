import type { Metadata } from "next";
import { listAdminRootMrFolders } from "@/lib/mr-folders";
import { PageHeader } from "@/components/admin/ui";
import { MrFolderManager } from "@/components/admin/MrFolderManager";

export const metadata: Metadata = { title: "MR Folders" };

export default async function AdminMrFoldersPage() {
  const folders = await listAdminRootMrFolders();

  return (
    <>
      <PageHeader
        title="MR Medicine Folders"
        subtitle="Create folders and upload high-quality advertisement / visual-aid pages (up to 4 MB each) for MRs to present on tablets."
      />
      <MrFolderManager folders={folders} />
    </>
  );
}

