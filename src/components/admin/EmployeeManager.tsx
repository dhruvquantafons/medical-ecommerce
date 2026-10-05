"use client";

import { Pencil, Trash2, UserCircle2 } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import type { Employee } from "@/lib/employees";
import { createEmployee, updateEmployee, deleteEmployee } from "@/app/admin/employees/actions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAdminAction } from "./useAdminAction";
import { inputClass } from "./ui";

type Draft = {
  id: string | null;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  sortOrder: number;
  active: boolean;
};

const blank = (sortOrder: number): Draft => ({
  id: null,
  name: "",
  role: "",
  bio: "",
  photoUrl: "",
  sortOrder,
  active: true,
});

const fromEmployee = (e: Employee): Draft => ({
  id: e.id,
  name: e.name,
  role: e.role,
  bio: e.bio,
  photoUrl: e.photoUrl ?? "",
  sortOrder: e.sortOrder,
  active: e.active,
});

export function EmployeeManager({ employees }: { employees: Employee[] }) {
  const { run, pending } = useAdminAction();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const open = (d: Draft) => {
    setDraft(d);
    setErrors({});
  };
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  async function save() {
    if (!draft) return;
    const input = {
      name: draft.name,
      role: draft.role,
      bio: draft.bio,
      photoUrl: draft.photoUrl || undefined,
      sortOrder: draft.sortOrder,
      active: draft.active,
    };
    const res = draft.id
      ? await run(() => updateEmployee(draft.id!, input))
      : await run(() => createEmployee(input));
    if (res.ok) setDraft(null);
    else setErrors(res.fieldErrors ?? {});
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => open(blank((employees.at(-1)?.sortOrder ?? -1) + 1))}>
          + New employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-4 py-14 text-center">
          <p className="font-semibold">No employees yet</p>
          <p className="text-sm text-muted">Add your first team member above.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map((e) => (
            <li key={e.id} className="card flex items-center gap-3 p-4">
              {e.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.photoUrl}
                  alt={e.name}
                  className="size-11 shrink-0 rounded-full object-cover ring-1 ring-line"
                />
              ) : (
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-400">
                  <UserCircle2 className="size-6" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{e.name}</p>
                <p className="truncate text-xs text-muted">
                  {e.role}
                  {!e.active && (
                    <span className="ml-2 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Inactive
                    </span>
                  )}
                </p>
              </div>
              <button
                aria-label={`Edit ${e.name}`}
                onClick={() => open(fromEmployee(e))}
                className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-ink"
              >
                <Pencil className="size-4" />
              </button>
              <button
                aria-label={`Delete ${e.name}`}
                disabled={pending}
                onClick={() =>
                  confirm(`Delete "${e.name}"?`) && run(() => deleteEmployee(e.id))
                }
                className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit employee" : "New employee"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        }
      >
        {draft && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Name</span>
              <input
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                className={clsx(inputClass, "w-full", errors.name && "border-red-400")}
                autoFocus
              />
              {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Role / title</span>
              <input
                value={draft.role}
                onChange={(e) => set({ role: e.target.value })}
                className={clsx(inputClass, "w-full", errors.role && "border-red-400")}
              />
              {errors.role && <span className="text-xs text-red-600">{errors.role}</span>}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">Bio</span>
              <textarea
                value={draft.bio}
                onChange={(e) => set({ bio: e.target.value })}
                rows={3}
                className={clsx(
                  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
                  errors.bio && "border-red-400",
                )}
              />
              {errors.bio && <span className="text-xs text-red-600">{errors.bio}</span>}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Photo URL <span className="font-normal text-muted">(https://…, optional)</span>
              </span>
              <input
                type="url"
                value={draft.photoUrl}
                onChange={(e) => set({ photoUrl: e.target.value })}
                placeholder="https://"
                className={clsx(inputClass, "w-full", errors.photoUrl && "border-red-400")}
              />
              {errors.photoUrl && (
                <span className="text-xs text-red-600">{errors.photoUrl}</span>
              )}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Order</span>
                <input
                  type="number"
                  min={0}
                  value={draft.sortOrder}
                  onChange={(e) => set({ sortOrder: Number(e.target.value) })}
                  className={clsx(inputClass, "w-full")}
                />
              </label>

              <label className="flex cursor-pointer items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => set({ active: e.target.checked })}
                  className="size-4 rounded border-line accent-brand-600"
                />
                <span className="text-sm font-semibold">Active</span>
              </label>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
