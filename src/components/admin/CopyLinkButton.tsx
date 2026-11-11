"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function CopyLinkButton({
  path,
  label = "Copy link",
  variant = "outline",
  size = "sm",
  className,
}: {
  path: string;
  label?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const toast = useToast((s) => s.show);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast(`Copied: ${url}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(url);
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={copy} className={className} title={`Copy ${path}`}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span>{copied ? "Copied" : label}</span>
    </Button>
  );
}

