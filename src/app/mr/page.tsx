import type { Metadata } from "next";
import { listPublicMrFolders } from "@/lib/mr-folders";
import { MrFolderBrowser } from "@/components/mr/MrFolderBrowser";

export const metadata: Metadata = {
  title: "Medicine Folders",
};

export default async function MrHomePage() {
  const { roots, all } = await listPublicMrFolders();
  return <MrFolderBrowser roots={roots} all={all} />;
}

