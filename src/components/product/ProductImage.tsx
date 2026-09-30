import clsx from "clsx";
import type { Product } from "@/data/types";

/** Placeholder packshot drawn from the product's form, brand and name. Swap for real images later. */

const palette = ["#0f847e", "#2563eb", "#dc2626", "#7c3aed", "#d97706", "#0891b2", "#db2777", "#15803d", "#475569", "#ea580c"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const font = "system-ui, sans-serif";

function Label({ x, y, w, h = 26, text, color, size = 13 }: { x: number; y: number; w: number; h?: number; text: string; color: string; size?: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#fff" />
      <text x={x + w / 2} y={y + h / 2 + size / 3} textAnchor="middle" fontSize={size} fontWeight="800" fill={color} fontFamily={font}>
        {text}
      </text>
    </>
  );
}

function Sheen({ id, ...rect }: { id: string } & React.SVGProps<SVGRectElement>) {
  return <rect {...rect} fill={`url(#${id})`} />;
}

export function ProductImage({ product, className }: { product: Product; className?: string }) {
  const color = palette[hash(product.brand) % palette.length];
  const label = product.brand.length > 10 ? product.brand.slice(0, 9) + "…" : product.brand;
  const sheen = `sheen-${product.id}`;
  if (product.imageUrl) {
    return (
      <div className={clsx("relative aspect-square w-full overflow-hidden rounded-lg bg-white", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided URL on any host */}
        <img src={product.imageUrl} alt={product.name} className="size-full object-contain p-2" loading="lazy" />
      </div>
    );
  }
  return (
    <div className={clsx("relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-b from-slate-50 to-slate-100", className)}>
      <svg viewBox="0 0 200 200" className="size-full" role="img" aria-label={product.name}>
        <defs>
          <linearGradient id={sheen} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".35" />
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="176" rx="62" ry="7" fill="#0f172a" opacity=".08" />
        <Shape product={product} color={color} label={label} sheen={sheen} />
      </svg>
    </div>
  );
}

function Shape({ product, color, label, sheen }: { product: Product; color: string; label: string; sheen: string }) {
  switch (product.form) {
    case "tablet":
    case "capsule": {
      const capsule = product.form === "capsule";
      return (
        <g>
          {/* carton */}
          <rect x="34" y="40" width="90" height="132" rx="6" fill={color} />
          <Sheen id={sheen} x="34" y="40" width="90" height="132" rx="6" />
          <rect x="34" y="58" width="90" height="4" fill="#fff" opacity=".5" />
          <Label x={42} y={72} w={74} text={label} color={color} size={label.length > 7 ? 11 : 13} />
          <rect x="42" y="106" width="44" height="5" rx="2.5" fill="#fff" opacity=".6" />
          <rect x="42" y="116" width="30" height="5" rx="2.5" fill="#fff" opacity=".4" />
          {/* blister strip */}
          <g transform="rotate(8 130 124)">
            <rect x="96" y="70" width="74" height="104" rx="8" fill="#e2e8f0" stroke="#cbd5e1" />
            <Sheen id={sheen} x="96" y="70" width="74" height="104" rx="8" />
            {[0, 1, 2, 3].map((r) =>
              [0, 1].map((c) =>
                capsule ? (
                  <g key={`${r}${c}`}>
                    <rect x={106 + c * 32} y={80 + r * 23} width="24" height="13" rx="6.5" fill="#fff" stroke="#cbd5e1" />
                    <rect x={106 + c * 32} y={80 + r * 23} width="12" height="13" rx="6.5" fill={color} opacity=".85" />
                  </g>
                ) : (
                  <circle key={`${r}${c}`} cx={118 + c * 30} cy={87 + r * 23} r="9" fill="#fff" stroke="#cbd5e1" />
                ),
              ),
            )}
          </g>
        </g>
      );
    }
    case "syrup":
      return (
        <g>
          <rect x="84" y="24" width="32" height="20" rx="3" fill={color} />
          <path d="M80 50 Q80 44 88 44 H112 Q120 44 120 50 V58 Q146 66 146 90 V164 Q146 174 136 174 H64 Q54 174 54 164 V90 Q54 66 80 58 Z" fill="#92400e" />
          <Sheen id={sheen} x="54" y="44" width="92" height="130" />
          <rect x="60" y="94" width="80" height="62" rx="4" fill="#fff" />
          <rect x="60" y="94" width="80" height="14" rx="4" fill={color} />
          <text x="100" y="130" textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily={font}>{label}</text>
          <rect x="72" y="140" width="56" height="4" rx="2" fill="#cbd5e1" />
        </g>
      );
    case "bottle":
      return (
        <g>
          <rect x="70" y="28" width="60" height="26" rx="5" fill={color} />
          <rect x="70" y="30" width="60" height="4" fill="#fff" opacity=".3" />
          <rect x="60" y="52" width="80" height="122" rx="14" fill="#f8fafc" stroke="#e2e8f0" />
          <Sheen id={sheen} x="60" y="52" width="80" height="122" rx="14" />
          <rect x="60" y="82" width="80" height="62" fill={color} />
          <Label x={66} y={100} w={68} text={label} color={color} size={label.length > 7 ? 11 : 13} />
        </g>
      );
    case "drops":
      return (
        <g>
          <path d="M94 26 H106 L110 62 H90 Z" fill="#334155" />
          <rect x="68" y="60" width="64" height="112" rx="12" fill={color} />
          <Sheen id={sheen} x="68" y="60" width="64" height="112" rx="12" />
          <Label x={73} y={100} w={54} text={label} color={color} size={10} />
        </g>
      );
    case "cream":
      return (
        <g transform="rotate(-12 100 104)">
          <path d="M62 36 H138 L128 150 Q100 158 72 150 Z" fill={color} />
          <path d="M62 36 H138 L128 150 Q100 158 72 150 Z" fill={`url(#${sheen})`} />
          <rect x="62" y="34" width="76" height="8" rx="2" fill="#fff" opacity=".35" />
          <rect x="85" y="150" width="30" height="24" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
          <Label x={72} y={82} w={56} text={label} color={color} size={11} />
        </g>
      );
    case "powder":
      return (
        <g>
          <rect x="50" y="36" width="100" height="22" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <rect x="46" y="54" width="108" height="120" rx="14" fill={color} />
          <Sheen id={sheen} x="46" y="54" width="108" height="120" rx="14" />
          <circle cx="100" cy="112" r="34" fill="#fff" />
          <text x="100" y="116" textAnchor="middle" fontSize={label.length > 7 ? 11 : 14} fontWeight="800" fill={color} fontFamily={font}>{label}</text>
        </g>
      );
    case "device":
      return <Device name={product.name} color={color} label={label} sheen={sheen} />;
    default:
      return (
        <g>
          <path d="M46 62 L100 40 L154 62 V158 L100 178 L46 158 Z" fill={color} />
          <path d="M100 84 L154 62 V158 L100 178 Z" fill="#000" opacity=".14" />
          <path d="M46 62 L100 40 L154 62 L100 84 Z" fill="#fff" opacity=".28" />
          <g transform="skewY(-22) translate(0 40)">
            <rect x="50" y="106" width="46" height="18" rx="3" fill="#fff" />
            <text x="73" y="118.5" textAnchor="middle" fontSize={label.length > 8 ? 6.5 : 8} fontWeight="800" fill={color} fontFamily={font}>{label}</text>
          </g>
        </g>
      );
  }
}

function Screen({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#0f172a" />
      <g fill="#5eead4" fontFamily="ui-monospace, monospace" fontWeight="700" textAnchor="middle">{children}</g>
    </g>
  );
}

function Device({ name, color, label, sheen }: { name: string; color: string; label: string; sheen: string }) {
  const n = name.toLowerCase();
  if (n.includes("thermometer")) {
    return (
      <g transform="rotate(-35 100 105)">
        <rect x="90" y="20" width="20" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="96" y="150" width="8" height="26" rx="4" fill="#94a3b8" />
        <Screen x={93} y={40} w={14} h={44}>
          <text x="100" y="66" fontSize="8" transform="rotate(90 100 62)">98.6°</text>
        </Screen>
        <circle cx="100" cy="104" r="6" fill={color} />
      </g>
    );
  }
  if (n.includes("oximeter")) {
    return (
      <g>
        <rect x="48" y="62" width="104" height="92" rx="34" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M58 90 Q100 66 142 90" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
        <Screen x={70} y={96} w={60} h={36}>
          <text x="86" y="120" fontSize="14">98</text>
          <text x="115" y="120" fontSize="11" fill="#fda4af">72</text>
        </Screen>
        <text x="100" y="146" textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={font}>{label}</text>
      </g>
    );
  }
  if (n.includes("glucometer") || n.includes("glucose")) {
    return (
      <g>
        <rect x="60" y="34" width="80" height="134" rx="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <Sheen id={sheen} x="60" y="34" width="80" height="134" rx="22" />
        <rect x="92" y="18" width="16" height="22" rx="2" fill={color} opacity=".8" />
        <Screen x={72} y={54} w={56} h={46}>
          <text x="100" y="80" fontSize="18">112</text>
          <text x="100" y="93" fontSize="7">mg/dL</text>
        </Screen>
        <circle cx="86" cy="128" r="9" fill={color} />
        <circle cx="114" cy="128" r="9" fill={color} opacity=".6" />
        <text x="100" y="158" textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={font}>{label}</text>
      </g>
    );
  }
  if (n.includes("nebulizer")) {
    return (
      <g>
        <rect x="36" y="86" width="100" height="80" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <Sheen id={sheen} x="36" y="86" width="100" height="80" rx="14" />
        <circle cx="66" cy="126" r="14" fill={color} />
        <rect x="90" y="112" width="34" height="6" rx="3" fill="#cbd5e1" />
        <rect x="90" y="124" width="24" height="6" rx="3" fill="#cbd5e1" />
        <path d="M136 110 C160 110 160 70 150 58" stroke="#94a3b8" strokeWidth="5" fill="none" />
        <path d="M136 36 h28 l-4 22 h-20 Z" fill={color} opacity=".75" />
      </g>
    );
  }
  // Blood-pressure monitor (default device)
  return (
    <g>
      <path d="M128 118 C160 118 168 80 150 70" stroke="#94a3b8" strokeWidth="4" fill="none" />
      <rect x="132" y="42" width="40" height="46" rx="10" fill="#334155" />
      <rect x="30" y="60" width="104" height="110" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <Sheen id={sheen} x="30" y="60" width="104" height="110" rx="18" />
      <Screen x={44} y={74} w={76} h={46}>
        <text x="82" y="96" fontSize="16">120</text>
        <text x="82" y="113" fontSize="12">80</text>
      </Screen>
      <circle cx="82" cy="142" r="12" fill={color} />
      <text x="82" y="146" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff" fontFamily={font}>START</text>
      <text x="82" y="165" textAnchor="middle" fontSize="8" fontWeight="800" fill={color} fontFamily={font}>{label}</text>
    </g>
  );
}
