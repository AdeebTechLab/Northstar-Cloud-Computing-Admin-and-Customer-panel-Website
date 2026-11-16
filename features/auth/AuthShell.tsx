import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { SparkleLogo } from "@/components/layout/Logos";
import { Cityscape } from "@/features/marketing/Illustrations";

function WorkspaceCard() {
  const bars = [32, 40, 36, 52, 46, 62, 58, 72, 64, 70, 56, 66];
  return (
    <div className="do-card do-card-border-soft p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-2">Workspace overview</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-algae-900 px-2 py-0.5 text-[11px] font-medium text-algae-300">
          <span className="size-1.5 rounded-full bg-algae-500 animate-pulse-dot" /> All systems normal
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { v: "99.9%", l: "Uptime target*" },
          { v: "12ms", l: "Avg. response*" },
          { v: "3", l: "Active servers" },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-line bg-canvas px-3 py-2.5">
            <p className="font-display text-lg font-bold text-ink">{s.v}</p>
            <p className="mt-0.5 text-[11px] text-muted">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-9 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} className={i === bars.length - 1 ? "flex-1 rounded-sm bg-foam-200" : "flex-1 rounded-sm bg-foam-700"} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

/** Split layout used by sign-up, login and password reset. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="do-glow-soft min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors duration-300 hover:bg-hover hover:text-ink">
          <ArrowLeft className="size-4" /> Back to website
        </Link>
      </div>
      <main id="main-content" tabIndex={-1} className="do-card do-card-border-soft mx-auto grid max-w-5xl outline-none animate-scale-in lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden border-r border-line-soft bg-canvas p-10 text-ink lg:flex lg:flex-col">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-70 [mask-image:linear-gradient(180deg,transparent,black_60%)]">
            <Cityscape />
          </div>
          <SparkleLogo />
          <div className="relative mt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-foam-200 px-3 py-1 text-xs font-medium text-deep-50">
              <span className="size-1.5 rounded-full bg-deep-50" /> Your cloud, your way
            </span>
            <h2 className="t-xl4 t-display mt-4">
              Build something <span className="block text-foam-200">brilliant.</span>
            </h2>
            <p className="mt-4 max-w-sm text-base text-ink-2">Deploy in minutes, scale with confidence, and keep your projects moving with infrastructure that works as hard as you do.</p>
          </div>
          <div className="relative mt-8">
            <WorkspaceCard />
          </div>
          <ul className="relative mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-10 text-sm text-ink-2">
            {["Simple setup", "Flexible scaling", "Developer-first tools"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-foam-200" /> {t}
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex flex-col justify-center px-5 py-10 sm:px-12 lg:px-14">
          {children}
          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="size-3" /> Your data is encrypted and protected
          </p>
        </div>
      </main>
    </div>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-deep-1000 bg-transparent text-base font-medium text-deep-1000 transition-colors duration-300 hover:border-transparent hover:bg-foam-200 hover:text-deep-50"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11Z" />
        <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
