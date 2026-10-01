export function RxBadge({ className = "" }: { className?: string }) {
  return (
    <span title="Prescription required" className={`inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-red-600 ring-1 ring-red-200 ${className}`}>
      Rx
    </span>
  );
}
