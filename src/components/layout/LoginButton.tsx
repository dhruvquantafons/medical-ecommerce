"use client";

import { User } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

export function LoginButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-gray-100">
        <User className="size-5" />
        <span className="hidden md:inline">Login</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Login / Sign up">
        <p className="text-sm text-muted">
          Accounts are coming soon. For now your cart, prescriptions and orders are saved on this device.
        </p>
      </Modal>
    </>
  );
}
