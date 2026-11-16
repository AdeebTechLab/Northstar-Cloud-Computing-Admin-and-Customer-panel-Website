"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers that block the async clipboard API.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/**
 * Copy-to-clipboard button.
 *  default → subtle icon button for tables and cards
 *  code    → pill in the code-block header (DigitalOcean CodeCopyButton)
 *  dark    → kept for older call sites; same as default on the dark theme
 */
export function CopyButton({
  value,
  label = "Copy",
  className,
  dark,
  showText,
  variant = dark ? "dark" : "default",
}: {
  value: string;
  label?: string;
  className?: string;
  dark?: boolean;
  showText?: boolean;
  variant?: "default" | "dark" | "code";
}) {
  const [copied, setCopied] = useState(false);
  const styles = {
    default: "rounded-md px-1.5 py-1 text-xs text-muted hover:bg-hover hover:text-ink",
    dark: "rounded-md px-1.5 py-1 text-xs text-deep-800 hover:bg-white/10 hover:text-ink",
    code: "h-7 shrink-0 rounded-full bg-foam-700 px-3 text-xs text-ink hover:bg-foam-800",
  };
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(value)) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }
      }}
      className={cn("no-print inline-flex items-center justify-center gap-1 font-medium transition-[background-color,color] duration-150", styles[variant], copied && "text-algae-300", className)}
      aria-label={copied ? "Copied" : `${label}: ${value}`}
      title={copied ? "Copied!" : label}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {showText ? <span>{copied ? "Copied" : label}</span> : null}
      <span className="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </button>
  );
}
