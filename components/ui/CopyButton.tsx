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

export function CopyButton({ value, label = "Copy", className, dark, showText }: { value: string; label?: string; className?: string; dark?: boolean; showText?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(value)) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }
      }}
      className={cn(
        "no-print inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium transition-colors",
        dark ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
        copied && (dark ? "text-emerald-400" : "text-emerald-600"),
        className,
      )}
      aria-label={copied ? "Copied" : `${label}: ${value}`}
      title={copied ? "Copied!" : label}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {showText ? <span>{copied ? "Copied" : label}</span> : null}
      <span className="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </button>
  );
}
