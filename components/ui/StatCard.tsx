import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

type SubTone = "success" | "warning" | "danger" | "muted" | "brand";
const subTones: Record<SubTone, string> = {
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
  muted: "text-slate-500",
  brand: "text-brand-600",
};

export function StatCard({
  label,
  value,
  sub,
  subTone = "muted",
  icon,
  className,
  children,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  subTone?: SubTone;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Card className={cn("group p-5 transition-shadow duration-200 hover:shadow-pop", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        {icon ? (
          <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-transform duration-200 group-hover:scale-105 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {sub ? <p className={cn("mt-1.5 text-xs font-medium", subTones[subTone])}>{sub}</p> : null}
      {children}
    </Card>
  );
}
