/** Only allow same-site relative paths as post-login destinations (prevents open redirects). */
export function safeNext(next: string | string[] | undefined, fallback = "/") {
  const v = Array.isArray(next) ? next[0] : next;
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
