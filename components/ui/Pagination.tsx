"use client";

import { ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export function usePaged<T>(items: T[], page: number, perPage: number) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const safe = Math.min(page, pages);
  const start = (safe - 1) * perPage;
  return { pages, page: safe, slice: items.slice(start, start + perPage), from: items.length ? start + 1 : 0, to: Math.min(start + perPage, items.length), total: items.length };
}

export function Pagination({
  page,
  pages,
  onChange,
  summary,
  variant = "boxes",
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
  summary?: string;
  variant?: "boxes" | "text";
}) {
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => pages <= 5 || n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-xs text-slate-500">
      <span>{summary}</span>
      {pages > 1 ? (
        variant === "text" ? (
          <nav aria-label="Pagination" className="flex items-center gap-1 font-medium text-brand-600">
            <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded px-1.5 py-1 hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent">
              ← Previous
            </button>
            {nums.map((n) => (
              <button key={n} type="button" onClick={() => onChange(n)} aria-current={n === page ? "page" : undefined} className={cn("min-w-6 rounded px-1.5 py-1 hover:bg-brand-50", n === page && "bg-brand-50 text-brand-700")}>
                {n}
              </button>
            ))}
            <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} className="rounded px-1.5 py-1 hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent">
              Next →
            </button>
          </nav>
        ) : (
          <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="grid size-8 place-items-center rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40" aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </button>
            {nums.map((n, i) => (
              <span key={n} className="flex items-center gap-1.5">
                {i > 0 && n - nums[i - 1]! > 1 ? <span className="px-1 text-slate-400">…</span> : null}
                <button
                  type="button"
                  onClick={() => onChange(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={cn("grid size-8 place-items-center rounded-lg border text-xs font-semibold transition-colors", n === page ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-slate-600 hover:bg-slate-50")}
                >
                  {n}
                </button>
              </span>
            ))}
            <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} className="grid size-8 place-items-center rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40" aria-label="Next page">
              <ArrowRight className="size-4" />
            </button>
          </nav>
        )
      ) : null}
    </div>
  );
}
