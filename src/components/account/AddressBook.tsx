"use client";

import { MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Address } from "@/data/types";
import { deleteAddress, saveAddress } from "@/app/actions/account";
import { useLocation } from "@/store/location";
import { AddressForm } from "@/components/checkout/AddressForm";
import { Button } from "@/components/ui/Button";

export function AddressBook({ initial }: { initial: Address[] }) {
  const [list, setList] = useState(initial);
  const [adding, setAdding] = useState(initial.length === 0);
  const pincode = useLocation((s) => s.pincode);

  return (
    <div className="space-y-4">
      {list.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className="card flex gap-3 p-4 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold">
                  {a.name} <span className="rounded bg-gray-100 px-1.5 text-[10px] font-bold uppercase text-muted">{a.label}</span>
                </p>
                <p className="text-gray-700">{a.line1}{a.line2 && `, ${a.line2}`}</p>
                <p className="text-gray-700">{a.city}, {a.state} {a.pincode}</p>
                <p className="text-muted">{a.phone}</p>
              </div>
              <button
                aria-label={`Delete address for ${a.name}`}
                onClick={async () => {
                  const res = await deleteAddress(a.id);
                  if (res.ok) setList((l) => l.filter((x) => x.id !== a.id));
                }}
                className="self-start rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {adding ? (
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Add a new address</h2>
          <AddressForm
            defaultPincode={pincode}
            onCancel={list.length ? () => setAdding(false) : undefined}
            onSave={async (fields) => {
              const res = await saveAddress(fields);
              if (!res.ok) return res.error;
              setList((l) => [res.data, ...l]);
              setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)}>+ Add new address</Button>
      )}
    </div>
  );
}
