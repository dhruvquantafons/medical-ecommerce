"use client";

import { ChevronLeft, ChevronRight, Maximize, Minimize, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import type { MrFolderPage } from "@/lib/mr-folder-types";

const ZOOM_STEPS = [1, 1.75, 2.5] as const;

export function MrSlideShow({
  folderName,
  pages,
  initialIndex,
  onClose,
}: {
  folderName: string;
  pages: MrFolderPage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [hudVisible, setHudVisible] = useState(true);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const gesture = useRef<{
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
    moved: boolean;
    lastTap: number;
  }>({ startX: 0, startY: 0, originPanX: 0, originPanY: 0, moved: false, lastTap: 0 });

  const current = pages[index];
  const hasPrev = index > 0;
  const hasNext = index < pages.length - 1;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, nextIndex));
      setIndex(clamped);
      resetZoom();
    },
    [pages.length, resetZoom],
  );

  const zoomIn = useCallback(() => {
    setZoom((z) => ZOOM_STEPS.find((step) => step > z) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1]);
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const lower = [...ZOOM_STEPS].reverse().find((step) => step < z) ?? 1;
      if (lower === 1) setPan({ x: 0, y: 0 });
      return lower;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // iPad Safari and some embedded browsers restrict Fullscreen API; modal already fills viewport.
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) goTo(index - 1);
      else if (e.key === "ArrowRight" && hasNext) goTo(index + 1);
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
      else if (e.key === "0") resetZoom();
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("keydown", onKey);
    };
  }, [goTo, hasNext, hasPrev, index, onClose, resetZoom, zoomIn, zoomOut]);

  // Preload previous and next high-res pages for instant flipping.
  useEffect(() => {
    for (const neighbor of [pages[index - 1], pages[index + 1]]) {
      if (!neighbor) continue;
      const img = new window.Image();
      img.src = neighbor.src;
    }
  }, [index, pages]);

  function onPointerDown(clientX: number, clientY: number) {
    gesture.current.startX = clientX;
    gesture.current.startY = clientY;
    gesture.current.originPanX = pan.x;
    gesture.current.originPanY = pan.y;
    gesture.current.moved = false;
  }

  function onPointerMove(clientX: number, clientY: number) {
    const dx = clientX - gesture.current.startX;
    const dy = clientY - gesture.current.startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) gesture.current.moved = true;
    if (zoom > 1) {
      setPan({ x: gesture.current.originPanX + dx, y: gesture.current.originPanY + dy });
    }
  }

  function onPointerEnd(clientX: number) {
    const dx = clientX - gesture.current.startX;
    if (zoom === 1 && Math.abs(dx) > 55) {
      if (dx < 0 && hasNext) goTo(index + 1);
      else if (dx > 0 && hasPrev) goTo(index - 1);
      return;
    }
    if (!gesture.current.moved) {
      const now = Date.now();
      if (now - gesture.current.lastTap < 280) {
        gesture.current.lastTap = 0;
        if (zoom > 1) resetZoom();
        else setZoom(2);
      } else {
        gesture.current.lastTap = now;
        setHudVisible((v) => !v);
      }
    }
  }

  if (!current) return null;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${folderName} presentation`}
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white select-none"
    >
      {/* Top HUD */}
      <div
        className={clsx(
          "absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 via-black/45 to-transparent px-4 py-3 transition-opacity duration-200",
          hudVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white md:text-base">{folderName}</p>
          <p className="truncate text-xs text-white/75">
            Page {index + 1} of {pages.length}
            {current.title ? ` · ${current.title}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom === 1}
            aria-label="Zoom out"
            className="grid size-10 place-items-center rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-35"
          >
            <ZoomOut className="size-4.5" />
          </button>
          <span className="min-w-11 text-center text-xs font-bold tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom === ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            aria-label="Zoom in"
            className="grid size-10 place-items-center rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-35"
          >
            <ZoomIn className="size-4.5" />
          </button>
          {zoom > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="grid size-10 place-items-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            className="hidden size-10 place-items-center rounded-full bg-white/15 hover:bg-white/25 sm:grid"
          >
            {isFullscreen ? <Minimize className="size-4.5" /> : <Maximize className="size-4.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close presentation"
            className="ml-1 grid size-10 place-items-center rounded-full bg-white/20 hover:bg-white/30"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main slide canvas (touch swipe + zoom/pan) */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden touch-none"
        onTouchStart={(e) => {
          if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={(e) => {
          if (e.changedTouches.length === 1) onPointerEnd(e.changedTouches[0].clientX);
        }}
        onMouseDown={(e) => {
          if (e.button === 0) onPointerDown(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) onPointerMove(e.clientX, e.clientY);
        }}
        onMouseUp={(e) => {
          if (e.button === 0) onPointerEnd(e.clientX);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution MR slide */}
        <img
          src={current.src}
          alt={current.title || `${folderName} page ${index + 1}`}
          draggable={false}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transition: zoom === 1 ? "transform 180ms ease-out" : undefined,
          }}
          className="max-h-full max-w-full object-contain select-none"
        />

        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index - 1);
            }}
            aria-label="Previous page"
            className={clsx(
              "absolute top-1/2 left-3 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/80",
              hudVisible ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index + 1);
            }}
            aria-label="Next page"
            className={clsx(
              "absolute top-1/2 right-3 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/80",
              hudVisible ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>

      {/* Bottom filmstrip */}
      {pages.length > 1 && (
        <div
          className={clsx(
            "absolute inset-x-0 bottom-0 z-20 flex items-center justify-center bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pt-6 pb-3 transition-opacity duration-200",
            hudVisible ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto py-1">
            {pages.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Jump to page ${i + 1}`}
                className={clsx(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-neutral-900 transition",
                  i === index ? "border-brand-500 ring-2 ring-brand-500/40" : "border-white/20 opacity-65 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail in filmstrip */}
                <img src={p.src} alt="" className="size-full object-contain" />
                <span className="absolute right-1 bottom-0.5 rounded bg-black/75 px-1 text-[10px] font-bold">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}

