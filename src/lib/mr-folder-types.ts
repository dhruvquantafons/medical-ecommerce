export interface MrBreadcrumb {
  id: string;
  name: string;
  slug: string;
}

export interface MrFolderSummary {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  active: boolean;
  imageCount: number;
  subfolderCount: number;
  coverSrc: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MrFolderPage {
  id: string;
  folderId: string;
  title: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  sortOrder: number;
  src: string;
  createdAt: Date;
}

export interface MrFolderDetail {
  folder: MrFolderSummary;
  breadcrumbs: MrBreadcrumb[];
  subfolders: MrFolderSummary[];
  pages: MrFolderPage[];
}

/** Formats byte counts into readable KB / MB labels for the admin UI. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

