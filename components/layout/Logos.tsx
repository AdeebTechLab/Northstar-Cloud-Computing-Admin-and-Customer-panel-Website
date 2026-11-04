import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

/** Website navbar logo (blue tile + "northstar cloud"). */
export function SiteLogo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)} aria-label="Northstar Cloud home">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-600 shadow-sm shadow-brand-600/30 transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
          <path d="M12 4 20 18H4L12 4Z" fill="white" />
          <path d="M12 10.5 15.8 17H8.2L12 10.5Z" fill="#2563eb" />
        </svg>
      </span>
      <span className={cn("text-[17px] font-bold tracking-tight", dark ? "text-white" : "text-slate-900")}>
        northstar <span className={cn("font-medium", dark ? "text-slate-400" : "text-slate-500")}>cloud</span>
      </span>
    </Link>
  );
}

/** Footer / auth logo (sparkle mark). */
export function SparkleLogo({ className, size = "md", solid }: { className?: string; size?: "sm" | "md"; solid?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="Northstar Cloud home">
      <span className={cn("grid place-items-center rounded-lg text-white", solid ? "bg-brand-600 shadow-lg shadow-brand-600/30" : "border border-white/15 bg-white/10 backdrop-blur", size === "sm" ? "size-7" : "size-9")}>
        <Sparkles className={size === "sm" ? "size-3.5" : "size-4"} />
      </span>
      <span className={cn("font-semibold tracking-tight text-white", size === "sm" ? "text-sm" : "text-[17px]")}>northstar cloud</span>
    </Link>
  );
}

/** Customer / admin panel logo ("N" tile + Northstar Cloud). */
export function PanelLogo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 rounded-lg" aria-label="Northstar Cloud dashboard">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-[15px] font-bold text-white shadow-sm shadow-brand-900/40 transition-transform duration-200 group-hover:scale-105">N</span>
      <span className="text-[15px] font-bold tracking-tight text-white">
        Northstar <span className="text-brand-400">Cloud</span>
      </span>
    </Link>
  );
}
