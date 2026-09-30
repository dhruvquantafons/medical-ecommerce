export const PRESCRIPTION_MAX_BYTES = 2 * 1024 * 1024;
export const PRESCRIPTION_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

/** Detects the real file type from its first bytes (don't trust the browser-declared type). */
export function sniffType(buf: Uint8Array): (typeof PRESCRIPTION_TYPES)[number] | null {
  const starts = (...b: number[]) => b.every((v, i) => buf[i] === v);
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (starts(0x89, 0x50, 0x4e, 0x47)) return "image/png";
  if (starts(0x25, 0x50, 0x44, 0x46)) return "application/pdf"; // %PDF
  if (starts(0x52, 0x49, 0x46, 0x46) && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "image/webp";
  return null;
}
