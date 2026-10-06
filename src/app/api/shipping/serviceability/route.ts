import { site } from "@/config/site";
import { checkServiceability, shiprocketConfigured } from "@/lib/shiprocket.server";

/** GET ?pincode=110001[&cod=1] → { serviceable, etd, days, cod } for the product page delivery check. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const pincode = params.get("pincode") ?? "";
  if (!/^[1-9]\d{5}$/.test(pincode)) return Response.json({ error: "Enter a valid 6-digit pincode." }, { status: 400 });
  if (!shiprocketConfigured()) return Response.json({ error: "Delivery check is unavailable." }, { status: 503 });

  try {
    const couriers = await checkServiceability(pincode, { weightKg: site.parcel.minWeightKg, cod: params.get("cod") === "1" });
    const fastest = couriers[0];
    return Response.json(
      fastest
        ? { serviceable: true, etd: fastest.etd, days: fastest.days, cod: couriers.some((c) => c.cod) }
        : { serviceable: false },
      { headers: { "Cache-Control": "public, max-age=3600" } },
    );
  } catch (e) {
    console.error("[shiprocket] serviceability failed", e);
    return Response.json({ error: "Delivery check is unavailable right now." }, { status: 502 });
  }
}
