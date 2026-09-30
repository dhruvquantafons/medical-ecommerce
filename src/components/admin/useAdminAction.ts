"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/app/admin/actions";

/** Runs an admin server action, toasts its message, and refreshes server data. */
export function useAdminAction() {
  const router = useRouter();
  const toast = useToast((s) => s.show);
  const [pending, start] = useTransition();

  function run<T>(action: () => Promise<ActionResult<T>>, onOk?: (data: T) => void) {
    return new Promise<ActionResult<T>>((resolve) => {
      start(async () => {
        const res = await action();
        if (res.ok) {
          if (res.message) toast(res.message);
          onOk?.(res.data);
          router.refresh();
        } else {
          toast(res.error, "error");
        }
        resolve(res);
      });
    });
  }
  return { run, pending };
}
