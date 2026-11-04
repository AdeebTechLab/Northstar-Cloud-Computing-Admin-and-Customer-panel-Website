import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { SparkleLogo } from "@/components/layout/Logos";

function WorkspaceCard() {
  const bars = [32, 40, 36, 52, 46, 62, 58, 72, 64, 70, 56, 66];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-300">Workspace overview</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> All systems normal
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { v: "99.9%", l: "Uptime target*" },
          { v: "12ms", l: "Avg. response*" },
          { v: "3", l: "Active servers" },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5">
            <p className="text-lg font-bold text-white">{s.v}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-9 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-indigo-400/70 to-indigo-300/90" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

/** Split layout used by sign-up, login and password reset (from the "login" frame). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#eef1f6] px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-white hover:text-slate-900">
          <ArrowLeft className="size-4" /> Back to website
        </Link>
      </div>
      <main id="main-content" tabIndex={-1} className="mx-auto grid max-w-5xl overflow-hidden rounded-[22px] border border-white bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] outline-none animate-scale-in lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#16326b] via-[#0d1d45] to-[#1d4ed8] p-10 text-white lg:flex lg:flex-col">
          <div className="pointer-events-none absolute -right-40 top-6 size-[520px] rounded-full border border-white/[0.06]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 top-24 size-[380px] rounded-full border border-white/[0.07]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-8 top-40 size-[240px] rounded-full border border-white/[0.08] bg-white/[0.02]" aria-hidden="true" />
          <SparkleLogo />
          <div className="relative mt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-500" /> Your cloud, your way
            </span>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-tight">
              Build something <span className="block text-indigo-300">brilliant.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">Deploy in minutes, scale with confidence, and keep your projects moving with infrastructure that works as hard as you do.</p>
          </div>
          <div className="relative mt-8">
            <WorkspaceCard />
          </div>
          <ul className="relative mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-10 text-[11px] text-slate-300">
            {["Simple setup", "Flexible scaling", "Developer-first tools"].map((t) => (
              <li key={t} className="flex items-center gap-1">
                <Check className="size-3" /> {t}
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex flex-col justify-center px-5 py-10 sm:px-12 lg:px-14">
          {children}
          <p className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="size-3" /> Your data is encrypted and protected
          </p>
        </div>
      </main>
    </div>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-white text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50">
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
    <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
