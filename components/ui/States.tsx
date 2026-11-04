import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Clock, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function EmptyState({ title, message, action, icon }: { title: string; message?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
      <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400 [&_svg]:size-5">{icon ?? <Inbox />}</span>
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      {message ? <p className="mt-1 max-w-sm text-[13px] text-slate-500">{message}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center" role="alert">
      <span className="grid size-12 place-items-center rounded-full bg-red-50 text-red-500">
        <AlertCircle className="size-5" />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-800">We couldn&apos;t load this section</p>
      <p className="mt-1 max-w-sm text-[13px] text-slate-500">{message ?? "Please check your connection and try again."}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" icon={<RefreshCw />} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/** Inline banner for form results: success / error / pending / info. */
export function FormAlert({ tone, title, children, className }: { tone: "success" | "error" | "pending" | "info"; title: string; children?: ReactNode; className?: string }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    info: "border-brand-200 bg-brand-50 text-brand-800",
  };
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : tone === "pending" ? Clock : AlertCircle;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] animate-fade-in", styles[tone], className)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-0.5 opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}
