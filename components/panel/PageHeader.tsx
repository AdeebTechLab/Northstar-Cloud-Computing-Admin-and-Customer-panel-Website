"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  subtitle,
  actions,
  crumbs,
  eyebrow,
  badge,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  eyebrow?: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in", className)}>
      <div className="min-w-0">
        {crumbs ? (
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-xs text-slate-400">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {c.href ? (
                  <Link href={c.href} className="hover:text-brand-600 hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span className={i === crumbs.length - 1 ? "font-medium text-slate-600" : undefined} aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">{eyebrow}</p> : null}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {badge}
        </div>
        {subtitle ? <div className="mt-1 text-[13px] text-slate-500">{subtitle}</div> : null}
      </div>
      {actions ? <div className="no-print flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** "Last updated 10:42 · refresh" helper for data pages. */
export function UpdatedAt({ at, onRefresh, refreshing }: { at: Date | null; onRefresh: () => void; refreshing?: boolean }) {
  if (!at) return null;
  return (
    <span className="no-print inline-flex items-center gap-1.5 text-xs text-slate-400">
      Last updated {at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
      <button type="button" onClick={onRefresh} className="grid size-6 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Refresh data">
        <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
      </button>
    </span>
  );
}
