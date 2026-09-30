"use client";

import { useState } from "react";
import { setCustomerBanned } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useAdminAction } from "./useAdminAction";
import { inputClass } from "./ui";

export function BanControl({ userId, banned, disabledReason }: { userId: string; banned: boolean; disabledReason?: string }) {
  const { run, pending } = useAdminAction();
  const [reason, setReason] = useState("");
  if (disabledReason) return <p className="text-sm text-muted">{disabledReason}</p>;
  if (banned) {
    return (
      <Button variant="outline" disabled={pending} onClick={() => run(() => setCustomerBanned({ userId, banned: false }))}>
        Unban customer
      </Button>
    );
  }
  return (
    <div className="space-y-2">
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" aria-label="Ban reason" maxLength={200} className={`${inputClass} w-full`} />
      <Button
        variant="outline"
        className="border-red-300 text-red-700 hover:bg-red-50"
        disabled={pending}
        onClick={() => confirm("Ban this customer? They will be signed out and unable to log in.") && run(() => setCustomerBanned({ userId, banned: true, reason }))}
      >
        Ban customer
      </Button>
    </div>
  );
}
