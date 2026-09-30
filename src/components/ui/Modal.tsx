"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import clsx from "clsx";

export function Modal({
  open,
  onClose,
  title,
  children,
  side,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Render as a drawer sliding in from the left instead of a centred dialog. */
  side?: "left";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={clsx("fixed inset-0 z-50 flex bg-black/40", side ? "justify-start" : "items-center justify-center p-4")} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "flex flex-col bg-white shadow-xl",
          side ? "h-full w-[85%] max-w-sm" : "max-h-[90vh] w-full max-w-md rounded-2xl",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-gray-100">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
