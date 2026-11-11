import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mrFolderImages, mrFolders } from "@/db/schema";
import { currentUser } from "@/lib/session";

async function areAncestorsActive(startParentId: string | null): Promise<boolean> {
  let parentId = startParentId;
  const seen = new Set<string>();
  while (parentId) {
    if (seen.has(parentId)) return false;
    seen.add(parentId);
    const [parent] = await db
      .select({ active: mrFolders.active, parentId: mrFolders.parentId })
      .from(mrFolders)
      .where(eq(mrFolders.id, parentId))
      .limit(1);
    if (!parent?.active) return false;
    parentId = parent.parentId;
  }
  return true;
}

/** Serves an uploaded MR visual-aid image at full uploaded quality. */
export async function GET(_request: Request, ctx: RouteContext<"/api/mr-images/[id]">) {
  const { id } = await ctx.params;
  const [row] = await db
    .select({
      data: mrFolderImages.data,
      mimeType: mrFolderImages.mimeType,
      folderActive: mrFolders.active,
      parentId: mrFolders.parentId,
    })
    .from(mrFolderImages)
    .innerJoin(mrFolders, eq(mrFolderImages.folderId, mrFolders.id))
    .where(eq(mrFolderImages.id, id))
    .limit(1);

  if (!row) return new Response("Not found", { status: 404 });

  const isPublic = row.folderActive && (await areAncestorsActive(row.parentId));
  if (!isPublic) {
    const user = await currentUser();
    if (user?.role !== "admin") return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(row.data.length),
      "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
