import type { NextRequest } from "next/server";
import { suggest } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  const results = await suggest(q);
  return Response.json(
    results.map((p) => ({ id: p.id, slug: p.slug, name: p.name, composition: p.composition, price: p.price, rxRequired: p.rxRequired })),
  );
}
