import Link from "next/link";
import { cn } from "@/lib/cn";

/** Northstar mark in the DigitalOcean lockup style: a cyan ring with a four-point star. */
export function NorthstarMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={cn("shrink-0", className)} aria-hidden="true">
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <path d="M16 7.5l2.3 6.2 6.2 2.3-6.2 2.3L16 24.5l-2.3-6.2-6.2-2.3 6.2-2.3z" fill="currentColor" />
    </svg>
  );
}

function Wordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <span className={cn("font-display font-extrabold tracking-[-0.02em] text-ink", size === "sm" ? "text-[17px]" : "text-[21px]", className)}>
      northstar<span className="font-semibold text-deep-800">cloud</span>
    </span>
  );
}

/** Website header logo (mark + wordmark, 32px tall like the DigitalOcean header logo). */
export function SiteLogo({ className }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded-lg leading-none", className)} aria-label="Northstar Cloud home">
      <NorthstarMark className="text-foam-400 transition-colors duration-300 group-hover:text-foam-200" />
      <Wordmark />
    </Link>
  );
}

/** Footer / auth logo. */
export function SparkleLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md"; solid?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="Northstar Cloud home">
      <NorthstarMark className="text-foam-400" size={size === "sm" ? 26 : 32} />
      <Wordmark size={size} />
    </Link>
  );
}

/** Customer / admin panel logo. */
export function PanelLogo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 rounded-lg" aria-label="Northstar Cloud dashboard">
      <NorthstarMark className="text-foam-400 transition-colors duration-300 group-hover:text-foam-200" size={28} />
      <Wordmark size="sm" />
    </Link>
  );
}
