import { cn } from "@/lib/cn";

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center", className)}>
      <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label ?? "Loading"}</span>
    </span>
  );
}

/** Full-page loading animation (route changes, auth checks). */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 animate-fade-in" role="status" aria-live="polite">
      <div className="relative grid size-14 place-items-center">
        <span className="absolute inset-0 rounded-2xl bg-brand-500/15 animate-ping" />
        <span className="relative grid size-12 place-items-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-600/30">N</span>
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
