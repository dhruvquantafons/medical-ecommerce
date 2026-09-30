"use client";

import { useState } from "react";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";

interface Day {
  day: string; // YYYY-MM-DD (India time)
  revenue: number;
  orders: number;
}

const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });
const dateLabel = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** A "nice" axis maximum and step (1, 2, 2.5, 5 × 10ⁿ) so ticks are clean round numbers. */
function niceScale(max: number, ticks = 4) {
  if (max <= 0) return { top: 1000, step: 250 };
  const raw = max / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  return { top: step * ticks, step };
}

/** Daily sales column chart: single series, hover/focus tooltip per bar, table view below. */
export function SalesChart({ data }: { data: Day[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.revenue));
  const { top, step } = niceScale(max);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step).reverse();
  const peak = max > 0 ? data.findIndex((d) => d.revenue === max) : -1;

  return (
    <div>
      <div className="flex gap-3">
        {/* y-axis */}
        <div className="flex h-52 flex-col justify-between pb-0 text-right text-[11px] text-muted tabular-nums" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              ₹{compact.format(t)}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          {/* gridlines */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-52 flex-col justify-between" aria-hidden>
            {ticks.map((t) => (
              <span key={t} className={clsx("h-px w-full", t === 0 ? "bg-gray-300" : "bg-gray-100")} />
            ))}
          </div>
          {max === 0 && (
            <p className="absolute inset-x-0 top-20 text-center text-sm text-muted">No sales in the last 14 days yet</p>
          )}
          {/* bars */}
          <div className="relative flex h-52 items-end gap-0.5" onMouseLeave={() => setActive(null)}>
            {data.map((d, i) => {
              const h = (d.revenue / top) * 100;
              return (
                <div key={d.day} className="relative flex h-full flex-1 items-end justify-center">
                  {i === peak && active !== i && (
                    <span className="absolute text-[11px] font-semibold text-ink tabular-nums" style={{ bottom: `calc(${h}% + 4px)` }}>
                      ₹{compact.format(d.revenue)}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`${dateLabel(d.day)}: ${formatPrice(d.revenue)} from ${d.orders} order${d.orders === 1 ? "" : "s"}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="group flex h-full w-full items-end justify-center outline-none"
                  >
                    <span
                      className={clsx(
                        "block w-full max-w-6 rounded-t-[4px] transition-colors",
                        active === i ? "bg-brand-700" : "bg-brand-500",
                        d.revenue > 0 && "min-h-[3px]",
                        "group-focus-visible:ring-2 group-focus-visible:ring-brand-700 group-focus-visible:ring-offset-2",
                      )}
                      style={{ height: `${h}%` }}
                    />
                  </button>
                  {active === i && (
                    <div
                      role="tooltip"
                      className={clsx(
                        "pointer-events-none absolute z-10 w-max rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-lg",
                        i > data.length - 4 ? "right-0" : i < 3 ? "left-0" : "left-1/2 -translate-x-1/2",
                      )}
                      style={{ bottom: `calc(${Math.max(h, 8)}% + 8px)` }}
                    >
                      <p className="text-sm font-bold text-ink tabular-nums">{formatPrice(d.revenue)}</p>
                      <p className="text-muted">
                        {dateLabel(d.day)} · {d.orders} order{d.orders === 1 ? "" : "s"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* x-axis */}
          <div className="mt-2 flex gap-0.5 text-[11px] text-muted" aria-hidden>
            {data.map((d, i) => {
              // Label every 2nd day (counting back from today), every 4th on narrow screens.
              const fromEnd = data.length - 1 - i;
              return (
                <span key={d.day} className="relative h-4 min-w-0 flex-1">
                  {fromEnd % 2 === 0 && (
                    <span className={clsx("absolute left-1/2 -translate-x-1/2 whitespace-nowrap", fromEnd % 4 !== 0 && "hidden sm:inline", fromEnd === 0 && "right-0 left-auto translate-x-0")}>
                      {dateLabel(d.day)}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-brand-700">View as table</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-xs text-muted">
              <th className="py-1 font-semibold">Date</th>
              <th className="py-1 text-right font-semibold">Orders</th>
              <th className="py-1 text-right font-semibold">Sales</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {data.map((d) => (
              <tr key={d.day} className="border-t border-line">
                <td className="py-1">{dateLabel(d.day)}</td>
                <td className="py-1 text-right">{d.orders}</td>
                <td className="py-1 text-right">{formatPrice(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
