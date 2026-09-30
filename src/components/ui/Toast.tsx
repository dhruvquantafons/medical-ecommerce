"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { create } from "zustand";
import clsx from "clsx";

type Tone = "success" | "error";

interface ToastState {
  message?: string;
  tone: Tone;
  key: number;
  show: (message: string, tone?: Tone) => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToast = create<ToastState>((set) => ({
  key: 0,
  tone: "success",
  show: (message, tone = "success") => {
    clearTimeout(timer);
    set((s) => ({ message, tone, key: s.key + 1 }));
    // Errors (and long messages) stay up longer so they can be read.
    timer = setTimeout(() => set({ message: undefined }), tone === "error" || message.length > 60 ? 5000 : 2200);
  },
}));

export function ToastViewport() {
  const { message, tone, key } = useToast();
  if (!message) return null;
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 md:bottom-6" role={tone === "error" ? "alert" : "status"}>
      <div key={key} className={clsx("flex max-w-lg items-start gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg", tone === "error" ? "bg-red-700" : "bg-gray-900")}>
        <Icon className={clsx("mt-0.5 size-4 shrink-0", tone === "error" ? "text-red-100" : "text-brand-200")} />
        {message}
      </div>
    </div>
  );
}
