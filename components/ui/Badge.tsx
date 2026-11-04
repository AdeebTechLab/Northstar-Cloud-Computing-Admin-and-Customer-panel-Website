import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "purple" | "brand";

const tones: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/15",
  info: "bg-sky-50 text-sky-700 ring-sky-600/15",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/15",
  purple: "bg-violet-50 text-violet-700 ring-violet-600/15",
  brand: "bg-brand-50 text-brand-700 ring-brand-600/15",
};
const dots: Record<Tone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  purple: "bg-violet-500",
  brand: "bg-brand-500",
};

export function Badge({ tone = "neutral", dot, pulse, children, className }: { tone?: Tone; dot?: boolean; pulse?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", tones[tone], className)}>
      {dot ? <span className={cn("size-1.5 rounded-full", dots[tone], pulse && "animate-pulse")} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const statusMap: Record<string, { tone: Tone; label: string; pulse?: boolean }> = {
  running: { tone: "success", label: "Running" },
  stopped: { tone: "neutral", label: "Stopped" },
  provisioning: { tone: "info", label: "Provisioning…", pulse: true },
  restarting: { tone: "warning", label: "Restarting…", pulse: true },
  stopping: { tone: "warning", label: "Stopping…", pulse: true },
  starting: { tone: "info", label: "Starting…", pulse: true },
  deleting: { tone: "danger", label: "Deleting…", pulse: true },
  failed: { tone: "danger", label: "Failed" },
  warning: { tone: "warning", label: "Warning" },
  paid: { tone: "success", label: "Paid" },
  pending: { tone: "warning", label: "Pending" },
  refunded: { tone: "purple", label: "Refunded" },
  open: { tone: "warning", label: "Open" },
  in_progress: { tone: "brand", label: "In Progress" },
  resolved: { tone: "success", label: "Resolved" },
  active: { tone: "success", label: "Active" },
  suspended: { tone: "danger", label: "Suspended" },
  draft: { tone: "warning", label: "Draft" },
  success: { tone: "success", label: "Success" },
  review: { tone: "warning", label: "Review" },
  verified: { tone: "success", label: "Verified" },
  logged: { tone: "neutral", label: "Logged" },
  investigate: { tone: "danger", label: "Investigate" },
  critical: { tone: "danger", label: "Critical" },
  info: { tone: "info", label: "Info" },
  in_use: { tone: "success", label: "In Use" },
  unused: { tone: "neutral", label: "Unused" },
  inactive: { tone: "neutral", label: "Inactive" },
};

export function StatusBadge({ status, dot = false, className }: { status: string; dot?: boolean; className?: string }) {
  const s = statusMap[status] ?? { tone: "neutral" as Tone, label: status };
  return (
    <Badge tone={s.tone} dot={dot || s.pulse} pulse={s.pulse} className={className}>
      {s.label}
    </Badge>
  );
}
