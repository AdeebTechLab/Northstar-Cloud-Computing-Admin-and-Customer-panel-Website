import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Horizontal scroll on small screens; columns always line up. */
export function Table({ children, className, minWidth = 760, label }: { children: ReactNode; className?: string; minWidth?: number; label?: string }) {
  return (
    <div className={cn("scroll-thin w-full overflow-x-auto", className)} role="region" aria-label={label} tabIndex={label ? 0 : undefined}>
      <table className="w-full border-collapse text-left text-[13px]" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50/80">
      <tr className="border-y border-line">{children}</tr>
    </thead>
  );
}

export function Th({ className, children, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th scope="col" className={cn("whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500", className)} {...rest}>
      {children}
    </th>
  );
}

export function Tr({ className, children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("border-b border-line transition-colors last:border-b-0 hover:bg-slate-50/70", className)} {...rest}>
      {children}
    </tr>
  );
}

export function Td({ className, children, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-5 py-3.5 align-middle text-slate-600", className)} {...rest}>
      {children}
    </td>
  );
}
