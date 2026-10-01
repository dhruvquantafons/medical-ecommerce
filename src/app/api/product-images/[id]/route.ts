import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { productImages } from "@/db/schema";

/** Serves an uploaded product photo. Ids are never reused, so the response is cached for good. */
export async function GET(_request: Request, ctx: RouteContext<"/api/product-images/[id]">) {
  const { id } = await ctx.params;
  const [img] = await db
    .select({ data: productImages.data, mimeType: productImages.mimeType })
    .from(productImages)
    .where(and(eq(productImages.id, id), isNotNull(productImages.data)))
    .limit(1);
  if (!img?.data || !img.mimeType) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.mimeType,
      "Content-Length": String(img.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
