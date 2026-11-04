"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const W = 600;
const H = 200;

function smoothPath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M ${points[0]![0]} ${points[0]![1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const toPoints = (values: number[], max = 100, top = 8, bottom = 8): [number, number][] =>
  values.map((v, i) => [(i / Math.max(1, values.length - 1)) * W, top + (1 - v / max) * (H - top - bottom)]);

interface Series {
  name: string;
  values: number[];
  color: string;
  fill?: boolean;
}

/** Multi-series smooth line/area chart in percent (0–100) with hover tooltip. */
export function TrendChart({
  series,
  xLabels,
  height = 180,
  yTicks = [100, 75, 50, 25],
  unit = "%",
  hoverLabels,
}: {
  series: Series[];
  xLabels: string[];
  height?: number;
  yTicks?: number[];
  unit?: string;
  hoverLabels?: string[];
}) {
  const gid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const n = series[0]?.values.length ?? 0;

  return (
    <div className="flex gap-3">
      <div className="flex shrink-0 flex-col justify-between pb-6 text-[10px] font-medium text-slate-400 tabular-nums" style={{ height }}>
        {yTicks.map((t) => (
          <span key={t}>{t}{unit}</span>
        ))}
        <span className="opacity-0">0</span>
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="relative"
          style={{ height: height - 24 }}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const idx = Math.round(((e.clientX - r.left) / r.width) * (n - 1));
            setHover(Math.max(0, Math.min(n - 1, idx)));
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" role="img" aria-label={`${series.map((s) => s.name).join(" and ")} chart`}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={i} id={`${gid}-g${i}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2={W} y1={8 + (i * (H - 16)) / 4} y2={8 + (i * (H - 16)) / 4} stroke="#e8edf4" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
            ))}
            <line x1="0" x2={W} y1={H - 8} y2={H - 8} stroke="#e2e8f0" vectorEffect="non-scaling-stroke" />
            {series.map((s, i) => {
              const pts = toPoints(s.values);
              const d = smoothPath(pts);
              return (
                <g key={s.name}>
                  {s.fill ? <path d={`${d} L ${W} ${H - 8} L 0 ${H - 8} Z`} fill={`url(#${gid}-g${i})`} /> : null}
                  <path d={d} fill="none" stroke={s.color} strokeWidth={i === 0 ? 2.5 : 2} strokeLinecap="round" vectorEffect="non-scaling-stroke" className="[stroke-dasharray:2000] [stroke-dashoffset:2000] animate-[draw_1.4s_ease-out_forwards]" />
                </g>
              );
            })}
            {hover !== null ? <line x1={(hover / (n - 1)) * W} x2={(hover / (n - 1)) * W} y1="0" y2={H - 8} stroke="#94a3b8" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" /> : null}
          </svg>
          {hover !== null
            ? series.map((s) => {
                const [x, y] = toPoints(s.values)[hover]!;
                return <span key={s.name} className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, background: s.color }} />;
              })
            : null}
          {hover !== null ? (
            <div
              className="pointer-events-none absolute top-0 z-10 rounded-lg border border-line bg-white px-2.5 py-2 text-[11px] shadow-pop"
              style={{ left: `${(hover / (n - 1)) * 100}%`, transform: `translateX(${hover > n / 2 ? "calc(-100% - 10px)" : "10px"})` }}
            >
              {hoverLabels?.[hover] ? <p className="mb-1 font-semibold text-slate-700">{hoverLabels[hover]}</p> : null}
              {series.map((s) => (
                <p key={s.name} className="flex items-center gap-1.5 whitespace-nowrap text-slate-600">
                  <span className="size-2 rounded-full" style={{ background: s.color }} />
                  {s.name}: <b className="text-slate-900">{s.values[hover]}{unit}</b>
                </p>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}

/** Vertical bar chart (admin revenue). Last bar highlighted like the design. */
export function BarChart({ data, height = 150, format = (v: number) => String(v) }: { data: { label: string; value: number }[]; height?: number; format?: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value)) * 1.08;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <div className="flex items-end justify-around gap-3 border-b border-slate-200 px-2 sm:gap-6" style={{ height }}>
        {data.map((d, i) => {
          const last = i === data.length - 1;
          return (
            <div key={d.label} className="relative flex h-full w-full max-w-11 flex-col justify-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {hover === i ? (
                <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow animate-fade-in">
                  {format(d.value)}
                </span>
              ) : null}
              <div
                className={cn("w-full origin-bottom rounded-t-[5px] transition-all duration-200 animate-[grow_0.9s_cubic-bezier(0.22,1,0.36,1)_both]", last ? "bg-brand-600" : "bg-brand-300/80", hover === i && (last ? "bg-brand-700" : "bg-brand-400"))}
                style={{ height: `${(d.value / max) * 100}%`, animationDelay: `${i * 60}ms` }}
                role="img"
                aria-label={`${d.label}: ${format(d.value)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-around gap-3 px-2 text-[10px] font-medium text-slate-400 sm:gap-6">
        {data.map((d) => (
          <span key={d.label} className="w-full max-w-11 text-center">
            {d.label}
          </span>
        ))}
      </div>
      <style>{`@keyframes grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
}

export function Donut({ value, size = 92, stroke = 11, color = "#2563eb", children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${value}% used`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eef8" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} className="transition-[stroke-dasharray] duration-1000" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

/** Horizontal progress bar. */
export function ProgressBar({ value, color = "bg-brand-600", className, label }: { value: number; color?: string; className?: string; label?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
