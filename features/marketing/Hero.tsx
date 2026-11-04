import { ArrowRight, BarChart3, Check, Globe, MessageSquare, Server } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

function OrbitIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      {/* rings */}
      <div className="absolute inset-[8%] rounded-full border border-brand-400/15" />
      <div className="absolute inset-[20%] rounded-full border border-brand-400/20" />
      <div className="absolute inset-[32%] rounded-full border border-brand-400/25 bg-brand-500/5" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full animate-orbit">
        <ellipse cx="200" cy="200" rx="185" ry="88" fill="none" stroke="rgba(96,147,249,0.22)" transform="rotate(-24 200 200)" />
        <ellipse cx="200" cy="200" rx="170" ry="70" fill="none" stroke="rgba(96,147,249,0.18)" transform="rotate(32 200 200)" />
        <circle cx="356" cy="128" r="3" fill="#93b6fd" />
        <circle cx="58" cy="262" r="2.5" fill="#6293f9" />
      </svg>

      {/* center tile */}
      <div className="absolute left-1/2 top-1/2 grid size-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22%] border border-white/15 bg-gradient-to-b from-navy-700/90 to-navy-900/90 shadow-[0_0_60px_rgba(37,99,235,0.45)] backdrop-blur">
        <div className="grid size-[46%] place-items-center rounded-xl border border-white/25">
          <div className="w-1/2 space-y-[18%]">
            <span className="block h-[3px] rounded bg-white/85" />
            <span className="block h-[3px] rounded bg-white/85" />
            <span className="flex items-center gap-1">
              <span className="block h-[3px] flex-1 rounded bg-white/85" />
              <span className="block size-[5px] rounded-full bg-emerald-400" />
            </span>
          </div>
        </div>
      </div>

      {/* compute status card */}
      <div className="absolute left-[6%] top-[13%] w-[44%] max-w-[190px] rounded-xl bg-white p-3 shadow-2xl shadow-black/30 animate-float">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900">
          <span className="size-1.5 rounded-full bg-brand-600" /> Compute status
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> All systems operational
        </p>
        <div className="mt-2.5 flex h-8 items-end gap-[7px] pl-0.5">
          {[38, 52, 46, 64, 58, 82, 74].map((h, i) => (
            <span key={i} className="w-[7px] rounded-[2px] bg-brand-500/90" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* edge network card */}
      <div className="absolute bottom-[22%] right-[2%] w-[40%] max-w-[176px] rounded-xl bg-white p-3 shadow-2xl shadow-black/30 animate-float-slow">
        <p className="text-[11px] font-semibold text-slate-900">Global edge network</p>
        <p className="mt-0.5 text-[10px] text-slate-500">Connected across regions</p>
        <div className="mt-2 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={i < 4 ? "size-1.5 rounded-full bg-brand-600" : "size-1.5 rounded-full bg-brand-200"} />
          ))}
        </div>
      </div>

      {/* small icon tiles */}
      {[
        { Icon: Globe, cls: "left-[10%] top-[46%]" },
        { Icon: BarChart3, cls: "left-[20%] bottom-[14%]" },
        { Icon: MessageSquare, cls: "right-[12%] top-[16%]" },
        { Icon: Server, cls: "right-[14%] bottom-[38%] opacity-60" },
      ].map(({ Icon, cls }, i) => (
        <span key={i} className={`absolute grid size-11 place-items-center rounded-xl border border-white/15 bg-navy-800/80 text-brand-200 shadow-lg backdrop-blur ${cls}`}>
          <Icon className="size-[18px]" />
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden text-white">
      <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 md:pb-20 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8 lg:pb-24">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-200">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-dot" /> Cloud infrastructure, reimagined
          </p>
          <h1 className="mt-5 text-[42px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[68px]">
            Cloud infrastructure.
            <span className="block text-brand-300">Without compromise.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Deploy high-performance compute in minutes. Predictable pricing, modern infrastructure, and developer-first tools — engineered to move your work forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register" size="lg" iconRight={<ArrowRight className="transition-transform group-hover:translate-x-0.5" />} className="group px-6">
              Deploy now
            </ButtonLink>
            <ButtonLink href="/#features" size="lg" variant="outline-light" className="px-6">
              Explore cloud compute
            </ButtonLink>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-400">
            {["No long-term contracts", "Pay for what you use", "Deploy in minutes"].map((t, i) => (
              <li key={t} className="flex items-center gap-1.5">
                {i === 0 ? <Check className="size-3.5 text-emerald-400" /> : <span className="size-1 rounded-full bg-slate-500" />}
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-fade-up [animation-delay:150ms]">
          <OrbitIllustration />
        </div>
      </div>
    </section>
  );
}

export function StatsStrip() {
  const stats = [
    { v: "99.99%", l: "Target infrastructure uptime" },
    { v: "30+ regions", l: "Global deployment options" },
    { v: "60 sec", l: "Typical instance deployment" },
    { v: "24 / 7", l: "Technical support available" },
  ];
  return (
    <section id="stats" aria-label="Platform highlights" className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <div key={s.v} className={`px-2 py-7 sm:px-6 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
            <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">{s.v}</p>
            <p className="mt-1 text-[13px] text-slate-500">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
