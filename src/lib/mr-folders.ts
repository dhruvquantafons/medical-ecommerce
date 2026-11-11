import "server-only";
import { cache } from "react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { mrFolderImages, mrFolders } from "@/db/schema";
import { mrImagePath } from "./files";
import type { MrBreadcrumb, MrFolderDetail, MrFolderPage, MrFolderSummary } from "./mr-folder-types";

type FolderRow = typeof mrFolders.$inferSelect;

interface ImageMetaRow {
  id: string;
  folderId: string;
  title: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: Date;
}

const loadMrTree = cache(async () => {
  const [folders, images] = await Promise.all([
    db.select().from(mrFolders).orderBy(asc(mrFolders.sortOrder), asc(mrFolders.createdAt)),
    // Never select `data` here so listing folders stays lightweight.
    db
      .select({
        id: mrFolderImages.id,
        folderId: mrFolderImages.folderId,
        title: mrFolderImages.title,
        fileName: mrFolderImages.fileName,
        mimeType: mrFolderImages.mimeType,
        sizeBytes: mrFolderImages.sizeBytes,
        width: mrFolderImages.width,
        height: mrFolderImages.height,
        sortOrder: mrFolderImages.sortOrder,
        createdAt: mrFolderImages.createdAt,
      })
      .from(mrFolderImages)
      .orderBy(asc(mrFolderImages.sortOrder), asc(mrFolderImages.createdAt)),
  ]);
  return { folders, images };
});

function buildTreeIndex(folders: FolderRow[], images: ImageMetaRow[], includeInactive: boolean) {
  const folderById = new Map<string, FolderRow>(folders.map((f) => [f.id, f]));

  const isVisible = (folder: FolderRow): boolean => {
    if (includeInactive) return true;
    let cur: FolderRow | undefined = folder;
    const seen = new Set<string>();
    while (cur) {
      if (!cur.active || seen.has(cur.id)) return false;
      seen.add(cur.id);
      cur = cur.parentId ? folderById.get(cur.parentId) : undefined;
    }
    return true;
  };

  const visibleFolders = folders.filter(isVisible);
  const childrenMap = new Map<string | null, FolderRow[]>();
  for (const f of visibleFolders) {
    const list = childrenMap.get(f.parentId) ?? [];
    list.push(f);
    childrenMap.set(f.parentId, list);
  }

  const imagesMap = new Map<string, MrFolderPage[]>();
  for (const img of images) {
    const list = imagesMap.get(img.folderId) ?? [];
    list.push({ ...img, src: mrImagePath(img.id) });
    imagesMap.set(img.folderId, list);
  }

  const coverMemo = new Map<string, string | null>();
  const findCover = (folderId: string, seen = new Set<string>()): string | null => {
    if (coverMemo.has(folderId)) return coverMemo.get(folderId) ?? null;
    if (seen.has(folderId)) return null;
    seen.add(folderId);
    const direct = imagesMap.get(folderId)?.[0]?.src ?? null;
    if (direct) {
      coverMemo.set(folderId, direct);
      return direct;
    }
    for (const child of childrenMap.get(folderId) ?? []) {
      const subCover = findCover(child.id, seen);
      if (subCover) {
        coverMemo.set(folderId, subCover);
        return subCover;
      }
    }
    coverMemo.set(folderId, null);
    return null;
  };

  const toSummary = (f: FolderRow): MrFolderSummary => ({
    id: f.id,
    parentId: f.parentId,
    name: f.name,
    slug: f.slug,
    description: f.description,
    sortOrder: f.sortOrder,
    active: f.active,
    imageCount: imagesMap.get(f.id)?.length ?? 0,
    subfolderCount: childrenMap.get(f.id)?.length ?? 0,
    coverSrc: findCover(f.id),
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  });

  const buildBreadcrumbs = (folder: FolderRow): MrBreadcrumb[] => {
    const trail: MrBreadcrumb[] = [];
    const seen = new Set<string>();
    let cur: FolderRow | undefined = folder;
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      trail.unshift({ id: cur.id, name: cur.name, slug: cur.slug });
      cur = cur.parentId ? folderById.get(cur.parentId) : undefined;
    }
    return trail;
  };

  const toDetail = (folder: FolderRow): MrFolderDetail => ({
    folder: toSummary(folder),
    breadcrumbs: buildBreadcrumbs(folder),
    subfolders: (childrenMap.get(folder.id) ?? []).map(toSummary),
    pages: imagesMap.get(folder.id) ?? [],
  });

  return { visibleFolders, childrenMap, toSummary, toDetail };
}

/** Lists root folders for the admin MR Folders overview. */
export const listAdminRootMrFolders = cache(async (): Promise<MrFolderSummary[]> => {
  const { folders, images } = await loadMrTree();
  const { childrenMap, toSummary } = buildTreeIndex(folders, images, true);
  return (childrenMap.get(null) ?? []).map(toSummary);
});

/** Lists active root folders and all active folders (for search) for the MR tablet view. */
export const listPublicMrFolders = cache(async (): Promise<{ roots: MrFolderSummary[]; all: MrFolderSummary[] }> => {
  const { folders, images } = await loadMrTree();
  const { visibleFolders, childrenMap, toSummary } = buildTreeIndex(folders, images, false);
  return {
    roots: (childrenMap.get(null) ?? []).map(toSummary),
    all: visibleFolders.map(toSummary),
  };
});

/** Loads a single folder by id for the admin folder editor (includes inactive folders). */
export const getAdminMrFolderById = cache(async (id: string): Promise<MrFolderDetail | null> => {
  const { folders, images } = await loadMrTree();
  const folder = folders.find((f) => f.id === id);
  if (!folder) return null;
  return buildTreeIndex(folders, images, true).toDetail(folder);
});

/** Loads an active folder by slug for the MR tablet viewer. Returns null if hidden or missing. */
export const getPublicMrFolderBySlug = cache(async (slug: string): Promise<MrFolderDetail | null> => {
  const { folders, images } = await loadMrTree();
  const { visibleFolders, toDetail } = buildTreeIndex(folders, images, false);
  const folder = visibleFolders.find((f) => f.slug === slug);
  return folder ? toDetail(folder) : null;
});

