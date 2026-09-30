"use client";

import { CircleCheck } from "lucide-react";
import { create } from "zustand";

interface ToastState {
  message?: string;
  key: number;
  show: (message: string) => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToast = create<ToastState>((set) => ({
  key: 0,
  show: (message) => {
    clearTimeout(timer);
    set((s) => ({ message, key: s.key + 1 }));
    timer = setTimeout(() => set({ message: undefined }), 2200);
  },
}));

export function ToastViewport() {
  const { message, key } = useToast();
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-6" role="status">
      <div key={key} className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
        <CircleCheck className="size-4 text-brand-200" />
        {message}
      </div>
    </div>
  );
}
