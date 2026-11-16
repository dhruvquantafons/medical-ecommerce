import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

type PriceProps = {
  price: number;
  /** Maximum retail price. Shown struck through when higher than `price`. */
  mrp?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { price: "text-base", meta: "text-sm" },
  md: { price: "text-lg", meta: "text-sm" },
  lg: { price: "text-2xl", meta: "text-base" },
} as const;

/** Selling price, with MRP and the saving when the item is discounted. Figures use tabular numerals. */
export function Price({ price, mrp, size = "md", className }: PriceProps) {
  const discounted = mrp !== undefined && mrp > price;
  const pct = discounted ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const s = sizes[size];
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums", className)}>
      <span className={cn("font-semibold text-ink", s.price)}>{formatPrice(price)}</span>
      {discounted && (
        <>
          <span className={cn("text-muted-foreground line-through", s.meta)}>
            <span className="sr-only">MRP </span>
            {formatPrice(mrp)}
          </span>
          {pct > 0 && <span className={cn("font-medium text-success", s.meta)}>{pct}% off</span>}
        </>
      )}
    </p>
  );
}
