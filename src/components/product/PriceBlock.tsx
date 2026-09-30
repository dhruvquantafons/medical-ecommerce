import { formatPrice } from "@/lib/format";
import clsx from "clsx";

export function PriceBlock({ price, mrp, discountPct, size = "sm" }: { price: number; mrp: number; discountPct: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={clsx("font-bold text-ink", size === "lg" ? "text-2xl" : "text-base")}>{formatPrice(price)}</span>
      {discountPct > 0 && (
        <>
          <span className={clsx("text-muted line-through", size === "lg" ? "text-base" : "text-xs")}>MRP {formatPrice(mrp)}</span>
          <span
            className={clsx(
              "rounded font-semibold text-save",
              size === "lg" ? "bg-green-50 px-2 py-0.5 text-sm" : "text-xs",
            )}
          >
            {discountPct}% OFF
          </span>
        </>
      )}
    </div>
  );
}
