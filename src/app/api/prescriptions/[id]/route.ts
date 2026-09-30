import { eq } from "drizzle-orm";
import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { currentUser } from "@/lib/session";

/** Serves a prescription file to its owner or an admin. Everyone else gets 404. */
export async function GET(_request: Request, ctx: RouteContext<"/api/prescriptions/[id]">) {
  const { id } = await ctx.params;
  const user = await currentUser();
  if (!user) return new Response("Not found", { status: 404 });

  const [rx] = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
  if (!rx || (rx.userId !== user.id && user.role !== "admin")) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(rx.data), {
    headers: {
      "Content-Type": rx.mimeType,
      "Content-Length": String(rx.sizeBytes),
      "Content-Disposition": `inline; filename="${rx.fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      // Chrome's PDF viewer can't run in a sandboxed document; images get the stricter policy.
      ...(rx.mimeType.startsWith("image/") && { "Content-Security-Policy": "default-src 'none'; img-src 'self'; sandbox" }),
    },
  });
}
