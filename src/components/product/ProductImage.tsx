import { getCategory } from "@/data/categories";
import type { Product } from "@/data/types";
import clsx from "clsx";

/** Placeholder packshot drawn from the product's form and category colour. Swap for real images later. */
export function ProductImage({ product, className }: { product: Product; className?: string }) {
  const color = getCategory(product.categorySlug)?.color ?? "#10847e";
  const label = product.brand.length > 11 ? product.brand.slice(0, 10) + "…" : product.brand;
  return (
    <div className={clsx("relative aspect-square w-full overflow-hidden rounded-lg", className)} style={{ background: `${color}12` }}>
      <svg viewBox="0 0 200 200" className="size-full" role="img" aria-label={product.name}>
        <Shape form={product.form} color={color} label={label} />
      </svg>
    </div>
  );
}

function Label({ x, y, w, label, color, size = 15 }: { x: number; y: number; w: number; label: string; color: string; size?: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={size + 14} rx="4" fill="#fff" />
      <text x={x + w / 2} y={y + size + 3} textAnchor="middle" fontSize={size} fontWeight="700" fill={color} fontFamily="system-ui, sans-serif">
        {label}
      </text>
    </>
  );
}

function Shape({ form, color, label }: { form: Product["form"]; color: string; label: string }) {
  switch (form) {
    case "tablet":
    case "capsule":
      return (
        <g>
          <rect x="30" y="40" width="140" height="120" rx="10" fill="#e5e7eb" stroke="#cbd5e1" />
          <rect x="30" y="40" width="140" height="34" rx="10" fill={color} />
          <text x="100" y="63" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">
            {label}
          </text>
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) =>
              form === "capsule" ? (
                <rect key={`${r}${c}`} x={44 + c * 30} y={84 + r * 24} width="22" height="14" rx="7" fill="#fff" stroke={color} strokeOpacity=".5" />
              ) : (
                <circle key={`${r}${c}`} cx={55 + c * 30} cy={92 + r * 24} r="9" fill="#fff" stroke={color} strokeOpacity=".5" />
              ),
            ),
          )}
        </g>
      );
    case "syrup":
    case "bottle":
      return (
        <g>
          <rect x="82" y="22" width="36" height="22" rx="4" fill="#374151" />
          <path d="M72 50 Q72 44 80 44 H120 Q128 44 128 50 V60 Q150 68 150 92 V168 Q150 178 140 178 H60 Q50 178 50 168 V92 Q50 68 72 60 Z" fill={color} opacity={form === "syrup" ? 0.9 : 1} />
          <Label x={58} y={100} w={84} label={label} color={color} size={14} />
          <rect x="66" y="140" width="68" height="6" rx="3" fill="#fff" opacity=".5" />
        </g>
      );
    case "drops":
      return (
        <g>
          <path d="M92 20 H108 L112 60 H88 Z" fill="#374151" />
          <rect x="65" y="60" width="70" height="110" rx="12" fill={color} />
          <Label x={70} y={100} w={60} label={label} color={color} size={11} />
        </g>
      );
    case "cream":
      return (
        <g>
          <path d="M60 40 H140 L130 150 Q100 160 70 150 Z" fill={color} />
          <rect x="84" y="150" width="32" height="26" rx="4" fill="#374151" />
          <Label x={70} y={80} w={60} label={label} color={color} size={12} />
        </g>
      );
    case "powder":
      return (
        <g>
          <rect x="52" y="36" width="96" height="26" rx="6" fill="#374151" />
          <rect x="46" y="58" width="108" height="118" rx="14" fill={color} />
          <Label x={56} y={100} w={88} label={label} color={color} size={14} />
        </g>
      );
    case "device":
      return (
        <g>
          <rect x="45" y="35" width="110" height="140" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="60" y="52" width="80" height="50" rx="6" fill="#1f2937" />
          <text x="100" y="84" textAnchor="middle" fontSize="18" fontWeight="700" fill="#5eead4" fontFamily="ui-monospace, monospace">
            120/80
          </text>
          <circle cx="100" cy="135" r="16" fill={color} />
          <text x="100" y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill={color} fontFamily="system-ui, sans-serif">
            {label}
          </text>
        </g>
      );
    default:
      return (
        <g>
          <path d="M50 60 L100 38 L150 60 V160 L100 178 L50 160 Z" fill={color} />
          <path d="M100 82 L150 60 V160 L100 178 Z" fill="#000" opacity=".12" />
          <path d="M50 60 L100 38 L150 60 L100 82 Z" fill="#fff" opacity=".25" />
          <Label x={56} y={106} w={60} label={label} color={color} size={11} />
        </g>
      );
  }
}
