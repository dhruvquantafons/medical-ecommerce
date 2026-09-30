"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

/**
 * Navigate to `basePath` with the given params merged in (null/empty removes a key).
 * `params` reflects the change immediately, before the server round-trip completes.
 */
export function useQueryNav(basePath: string, current: Record<string, string>) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [params, setParams] = useOptimistic(current);

  function update(patch: Record<string, string | null | undefined>) {
    const next = { ...params };
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === "") delete next[k];
      else next[k] = v;
    }
    const qs = new URLSearchParams(next).toString();
    start(() => {
      setParams(next);
      router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
    });
  }
  return { params, update, pending };
}
