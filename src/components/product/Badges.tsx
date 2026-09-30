import { Star } from "lucide-react";
import { formatCount } from "@/lib/format";

export function RxBadge({ className = "" }: { className?: string }) {
  return (
    <span title="Prescription required" className={`inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-red-600 ring-1 ring-red-200 ${className}`}>
      Rx
    </span>
  );
}

export function Rating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <span className="inline-flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5 font-semibold text-white">
        {rating.toFixed(1)} <Star className="size-3 fill-white" />
      </span>
      ({formatCount(count)})
    </span>
  );
}
