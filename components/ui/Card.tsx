import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-line bg-white shadow-card", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  id,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 px-5 pt-5", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-[15px] font-semibold text-slate-900">
          {title}
        </h2>
        {subtitle ? <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 pb-5 pt-4", className)}>{children}</div>;
}
