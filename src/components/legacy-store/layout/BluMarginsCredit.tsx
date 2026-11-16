import Image from "next/image";

/**
 * "Developed by BluMargins Technologies" — the developer credit at the bottom of
 * the portfolio home page and the store footer, with the company's address and
 * email. The name links out to blumargins.com.
 * `tone="dark"` renders the mark white for dark/gradient backgrounds.
 */
export function BluMarginsCredit({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={`flex flex-col items-center gap-1.5 text-center text-xs ${dark ? "text-white/85" : "text-slate-500"} ${className}`}>
      <a
        href="https://www.blumargins.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <Image
          src="/brand/blumargins-mark.png"
          alt="BluMargins"
          width={33}
          height={14}
          className={`h-3.5 w-auto ${dark ? "brightness-0 invert" : ""}`}
        />
        <span>
          Developed by <span className={`font-semibold ${dark ? "text-white" : "text-slate-700"}`}>BluMargins Technologies</span>
        </span>
      </a>
      <address className="not-italic leading-relaxed">
        Red Cross Road, Srinagar, Kashmir - 190001, India
        <br />
        <a
          href="mailto:info@blumargins.com"
          className={`underline-offset-2 hover:underline ${dark ? "text-white" : "text-slate-700"}`}
        >
          info@blumargins.com
        </a>
      </address>
    </div>
  );
}
