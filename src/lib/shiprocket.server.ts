import "server-only";

// Thin client for the Shiprocket REST API (https://apidocs.shiprocket.in).
// Auth uses an "API user" (Shiprocket → Settings → API → Configure), not the main login.

const BASE = "https://apiv2.shiprocket.in/v1/external";
/** Tokens are valid for 10 days; refresh a day early. */
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;

export class ShiprocketError extends Error {}

let cachedToken: { value: string; expires: number } | undefined;

export function shiprocketConfigured() {
  return Boolean(process.env.SHIPROCKET_API_EMAIL && process.env.SHIPROCKET_API_PASSWORD);
}

/** The pickup location nickname set in Shiprocket → Settings → Pickup Addresses. */
export function pickupLocationName() {
  return process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";
}

async function login() {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;
  if (!email || !password) {
    throw new ShiprocketError("Shiprocket is not configured. Set SHIPROCKET_API_EMAIL and SHIPROCKET_API_PASSWORD in .env.local");
  }
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { token?: string; message?: string };
  if (!res.ok || !data.token) throw new ShiprocketError(`Shiprocket login failed: ${data.message ?? res.status}`);
  cachedToken = { value: data.token, expires: Date.now() + TOKEN_TTL_MS };
  return data.token;
}

/** Pulls a readable message out of Shiprocket's error bodies ({ message, errors: { field: [msg] } }). */
function errorMessage(data: unknown, status: number) {
  const d = (data ?? {}) as { message?: string; errors?: Record<string, string[] | string> };
  const fieldErrors = d.errors ? Object.values(d.errors).flat().join(" ") : "";
  return [d.message, fieldErrors].filter(Boolean).join(" ") || `Shiprocket request failed (${status})`;
}

async function request<T>(method: "GET" | "POST", path: string, body?: unknown, retried = false): Promise<T> {
  const token = cachedToken && cachedToken.expires > Date.now() ? cachedToken.value : await login();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (res.status === 401 && !retried) {
    cachedToken = undefined;
    return request(method, path, body, true);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ShiprocketError(errorMessage(data, res.status));
  return data as T;
}

// ---- Pickup location

let cachedPickupPincode: string | undefined;

/** Pincode of the configured pickup location (needed for serviceability checks). */
export async function pickupPincode() {
  if (cachedPickupPincode) return cachedPickupPincode;
  const res = await request<{ data?: { shipping_address?: { pickup_location: string; pin_code: string | number }[] } }>("GET", "/settings/company/pickup");
  const name = pickupLocationName();
  const loc = res.data?.shipping_address?.find((a) => a.pickup_location === name);
  if (!loc) throw new ShiprocketError(`Pickup location "${name}" not found in Shiprocket. Add it under Settings → Pickup Addresses.`);
  cachedPickupPincode = String(loc.pin_code);
  return cachedPickupPincode;
}

// ---- Serviceability

export interface CourierOption {
  courierName: string;
  etd: string;
  days: number;
  rate: number;
  cod: boolean;
}

/** Couriers that can deliver to `pincode`, fastest first. Empty if the pincode isn't serviceable. */
export async function checkServiceability(pincode: string, opts: { weightKg: number; cod: boolean }): Promise<CourierOption[]> {
  const pickup = await pickupPincode();
  const qs = new URLSearchParams({ pickup_postcode: pickup, delivery_postcode: pincode, weight: String(opts.weightKg), cod: opts.cod ? "1" : "0" });
  const res = await request<{
    status?: number;
    data?: { available_courier_companies?: { courier_name: string; etd: string; estimated_delivery_days: string; rate: number; cod: number }[] };
  }>("GET", `/courier/serviceability/?${qs}`).catch((e) => {
    // Shiprocket answers 404 for pincodes no courier serves.
    if (e instanceof ShiprocketError && /not serviceable|404/i.test(e.message)) return { data: undefined };
    throw e;
  });
  return (res.data?.available_courier_companies ?? [])
    .map((c) => ({ courierName: c.courier_name, etd: c.etd, days: Number(c.estimated_delivery_days) || 0, rate: c.rate, cod: c.cod === 1 }))
    .sort((a, b) => a.days - b.days);
}

// ---- Orders and shipments

export interface ShiprocketOrderInput {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: true;
  order_items: { name: string; sku: string; units: number; selling_price: number; discount?: number; tax?: number; hsn?: string }[];
  payment_method: "Prepaid" | "COD";
  shipping_charges: number;
  total_discount: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export async function createOrder(input: ShiprocketOrderInput) {
  const res = await request<{ order_id?: number; shipment_id?: number; message?: string }>("POST", "/orders/create/adhoc", input);
  if (!res.order_id || !res.shipment_id) throw new ShiprocketError(res.message ?? "Shiprocket did not return an order");
  return { orderId: String(res.order_id), shipmentId: String(res.shipment_id) };
}

/** Assigns a courier (Shiprocket's recommended one, per your courier priority settings) and returns the AWB. */
export async function assignAwb(shipmentId: string) {
  const res = await request<{
    awb_assign_status?: number;
    message?: string;
    response?: { data?: { awb_code?: string; courier_name?: string; awb_assign_error?: string } };
  }>("POST", "/courier/assign/awb", { shipment_id: shipmentId });
  const data = res.response?.data;
  if (res.awb_assign_status !== 1 || !data?.awb_code) {
    throw new ShiprocketError(data?.awb_assign_error ?? res.message ?? "Could not assign a courier. Check your Shiprocket wallet balance.");
  }
  return { awbCode: data.awb_code, courierName: data.courier_name ?? "" };
}

export async function requestPickup(shipmentId: string) {
  try {
    await request("POST", "/courier/generate/pickup", { shipment_id: [shipmentId] });
  } catch (e) {
    // Treat "already scheduled" as success so retries are safe.
    if (e instanceof ShiprocketError && /already/i.test(e.message)) return;
    throw e;
  }
}

export async function generateLabel(shipmentId: string) {
  const res = await request<{ label_created?: number; label_url?: string; response?: string }>("POST", "/courier/generate/label", { shipment_id: [shipmentId] });
  if (!res.label_url) throw new ShiprocketError(res.response ?? "Shiprocket could not generate the label");
  return res.label_url;
}

export async function cancelOrder(shiprocketOrderId: string) {
  await request("POST", "/orders/cancel", { ids: [Number(shiprocketOrderId)] });
}

/** Latest courier status for an AWB, e.g. "IN TRANSIT". */
export async function trackAwb(awb: string) {
  const res = await request<{
    tracking_data?: { shipment_track?: { current_status?: string }[]; error?: string };
  }>("GET", `/courier/track/awb/${encodeURIComponent(awb)}`);
  return res.tracking_data?.shipment_track?.[0]?.current_status ?? null;
}

export const trackingUrl = (awb: string) => `https://shiprocket.co/tracking/${encodeURIComponent(awb)}`;
