import clsx from "clsx";
import type { Product } from "@/data/types";

/**
 * Placeholder packshot: a branded supplement container drawn from the product's form.
 * Add photos to the product in the admin panel to show real photos instead.
 */

interface Tone {
  body: string;
  label: string;
  ink: string;
  sub: string;
  cap: string;
}

// Muted brand tones; each product gets a stable one based on its name.
const tones: Tone[] = [
  { body: "#2f5a3f", label: "#2f5a3f", ink: "#f1f4ef", sub: "#c7d4bd", cap: "#1b3526" },
  { body: "#dfe9dc", label: "#f7f9f5", ink: "#22452f", sub: "#6f8f4e", cap: "#22452f" },
  { body: "#95a27a", label: "#95a27a", ink: "#f7f9f2", sub: "#eef3df", cap: "#4d5c3a" },
  { body: "#f1eee6", label: "#f1eee6", ink: "#2f5a3f", sub: "#8b927f", cap: "#2f5a3f" },
  { body: "#1f3a29", label: "#1f3a29", ink: "#e4f5a1", sub: "#a6b89a", cap: "#0f2a1d" },
  { body: "#cfe0d2", label: "#cfe0d2", ink: "#1f3a29", sub: "#4d7a58", cap: "#2f5a3f" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Splits a product name into at most two short uppercase label lines. */
function labelLines(name: string, max = 14) {
  const words = name.toUpperCase().replace(/[^A-Z0-9+& ]/g, "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

const serif = { fontFamily: "var(--font-brand), system-ui, sans-serif", fontWeight: 700 };
const sans = { fontFamily: "var(--font-brand), system-ui, sans-serif" };

function Wordmark({ x, y, size, tone, lines }: { x: number; y: number; size: number; tone: Tone; lines: string[] }) {
  return (
    <>
      <text x={x} y={y} textAnchor="middle" fontSize={size} fill={tone.ink} style={serif}>
        Syncytium
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x} y={y + size * 0.62 + i * size * 0.34} textAnchor="middle" fontSize={size * 0.24} letterSpacing="1.2" fontWeight={600} fill={tone.sub} style={sans}>
          {l}
        </text>
      ))}
    </>
  );
}

/**
 * Shows `src` (default: the product's main photo), or the drawn placeholder when there are no photos.
 * `hoverSwap` fades to the second photo while a parent `.group` is hovered.
 * Photos fill the frame edge to edge (`fit="cover"`, the default), because product shots have their own
 * studio background; `fit="contain"` shows the whole photo with padding (e.g. for cut-out PNGs).
 */
export function ProductImage({
  product,
  className,
  src = product.images[0],
  alt = product.name,
  hoverSwap,
  priority,
  fit = "cover",
  aspect = "aspect-square",
}: {
  product: Product;
  className?: string;
  src?: string;
  alt?: string;
  hoverSwap?: boolean;
  priority?: boolean;
  fit?: "contain" | "cover";
  /** Tailwind aspect-ratio class for the frame. */
  aspect?: string;
}) {
  if (src) {
    const second = hoverSwap ? product.images[1] : undefined;
    const imgClass = fit === "cover" ? "size-full object-cover" : "size-full object-contain p-4";
    return (
      <div className={clsx("relative w-full overflow-hidden rounded-xl bg-tile", aspect, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- uploads and admin-provided URLs on any host */}
        <img src={src} alt={alt} className={clsx(imgClass, second && "transition-opacity duration-500 group-hover:opacity-0")} loading={priority ? "eager" : "lazy"} />
        {second && (
          // eslint-disable-next-line @next/next/no-img-element -- see above
          <img src={second} alt="" aria-hidden className={clsx("absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100", imgClass)} loading="lazy" />
        )}
      </div>
    );
  }
  const tone = tones[hash(product.name) % tones.length];
  const id = `sh-${product.id}`;
  return (
    <div className={clsx("relative w-full overflow-hidden rounded-xl bg-tile", aspect, className)}>
      <svg viewBox="0 0 200 200" className="size-full" role="img" aria-label={product.name}>
        <defs>
          <linearGradient id={id} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset=".4" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".14" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="172" rx="56" ry="6" fill="#1f2a22" opacity=".12" />
        <Container form={product.form} tone={tone} sheen={`url(#${id})`} lines={labelLines(product.name)} />
      </svg>
    </div>
  );
}

function Container({ form, tone, sheen, lines }: { form: Product["form"]; tone: Tone; sheen: string; lines: string[] }) {
  switch (form) {
    case "powder":
      // Canister / tub
      return (
        <g>
          <rect x="58" y="44" width="84" height="16" rx="3" fill={tone.cap} />
          <rect x="54" y="58" width="92" height="112" rx="6" fill={tone.body} />
          <rect x="54" y="58" width="92" height="112" rx="6" fill={sheen} />
          <rect x="54" y="80" width="92" height="60" fill={tone.label} />
          <Wordmark x={100} y={110} size={20} tone={tone} lines={lines} />
        </g>
      );
    case "drops":
    case "syrup":
      // Dropper bottle
      return (
        <g>
          <path d="M93 22 h14 a4 4 0 0 1 4 4 v22 h-22 v-22 a4 4 0 0 1 4 -4z" fill={tone.cap} />
          <rect x="86" y="46" width="28" height="14" rx="3" fill={tone.cap} />
          <rect x="68" y="58" width="64" height="112" rx="14" fill={tone.body} />
          <rect x="68" y="58" width="64" height="112" rx="14" fill={sheen} />
          <rect x="68" y="92" width="64" height="52" fill={tone.label} />
          <Wordmark x={100} y={116} size={15} tone={tone} lines={lines} />
        </g>
      );
    case "pack":
      // Stand-up pouch
      return (
        <g>
          <path d="M56 40 h88 l6 130 h-100z" fill={tone.body} />
          <path d="M56 40 h88 l6 130 h-100z" fill={sheen} />
          <rect x="56" y="40" width="88" height="10" fill={tone.cap} opacity=".5" />
          <Wordmark x={100} y={104} size={20} tone={tone} lines={lines} />
        </g>
      );
    case "cream":
      // Tube
      return (
        <g transform="rotate(-10 100 104)">
          <path d="M66 36 h68 l-8 116 q-26 8 -52 0z" fill={tone.body} />
          <path d="M66 36 h68 l-8 116 q-26 8 -52 0z" fill={sheen} />
          <rect x="86" y="150" width="28" height="20" rx="3" fill={tone.cap} />
          <Wordmark x={100} y={92} size={16} tone={tone} lines={lines} />
        </g>
      );
    default:
      // Supplement jar (capsules, tablets, gummies, anything else)
      return (
        <g>
          <rect x="66" y="40" width="68" height="22" rx="4" fill={tone.cap} />
          <rect x="66" y="44" width="68" height="3" fill="#fff" opacity=".15" />
          <rect x="58" y="60" width="84" height="110" rx="12" fill={tone.body} />
          <rect x="58" y="60" width="84" height="110" rx="12" fill={sheen} />
          <rect x="58" y="84" width="84" height="58" fill={tone.label} />
          <Wordmark x={100} y={112} size={18} tone={tone} lines={lines} />
        </g>
      );
  }
}
