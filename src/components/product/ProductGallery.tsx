"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import clsx from "clsx";
import type { Product } from "@/data/types";
import { ProductImage } from "./ProductImage";

/** Product page photos: main image with arrows / swipe, and a thumbnail strip when there is more than one. */
export function ProductGallery({ product }: { product: Product }) {
  const images = product.images;
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const go = (i: number) => setIndex((i + count) % count);

  if (count <= 1) return <ProductImage product={product} className="mx-auto max-w-lg" priority />;

  return (
    <div>
      <div
        className="group/main relative mx-auto max-w-lg"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${product.name} photos`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "ArrowRight") go(index + 1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <ProductImage product={product} src={images[index]} alt={`${product.name}, photo ${index + 1} of ${count}`} priority />
        {[
          { dir: -1, label: "Previous photo", Icon: ChevronLeft, pos: "left-2" },
          { dir: 1, label: "Next photo", Icon: ChevronRight, pos: "right-2" },
        ].map(({ dir, label, Icon, pos }) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(index + dir)}
            aria-label={label}
            className={clsx(
              "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white md:opacity-0 md:group-hover/main:opacity-100 md:focus-visible:opacity-100",
              pos,
            )}
          >
            <Icon className="size-5" />
          </button>
        ))}
      </div>

      <ul className="mt-5 flex justify-center gap-2.5 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <li key={src} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={clsx("block size-16 overflow-hidden rounded-xl border-2 bg-white/60 transition md:size-20", i === index ? "border-brand-800" : "border-transparent hover:border-brand-800/30")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- uploads and admin-provided URLs on any host */}
              <img src={src} alt="" className="size-full object-contain p-1.5" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
