"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Info, X, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "error" | "info" | "pending";
interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

const ToastContext = createContext<{ push: (t: Omit<ToastItem, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs.slice(-3), { ...t, id }]);
      window.setTimeout(() => dismiss(id), t.tone === "error" ? 7000 : 4500);
    },
    [dismiss],
  );
  const value = useMemo(() => ({ push }), [push]);

  const icon = { success: CheckCircle2, error: XCircle, info: Info, pending: Clock };
  const color = { success: "text-emerald-500", error: "text-red-500", info: "text-brand-500", pending: "text-amber-500" };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div data-toaster aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex flex-col items-center gap-2 px-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:items-end">
        {items.map((t) => {
          const Icon = icon[t.tone];
          return (
            <div key={t.id} role={t.tone === "error" ? "alert" : "status"} className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-pop animate-slide-up">
              <Icon className={cn("mt-0.5 size-5 shrink-0", color[t.tone])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                {t.message ? <p className="mt-0.5 text-[13px] leading-snug text-slate-500">{t.message}</p> : null}
              </div>
              <button type="button" onClick={() => dismiss(t.id)} className="-m-1 grid size-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss notification">
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.push;
}
