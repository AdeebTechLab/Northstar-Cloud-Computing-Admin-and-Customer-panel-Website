"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
  hint?: string;
}

/** Small dropdown menu (row actions, "More Actions"). */
export function Menu({ trigger, items, align = "right", label, placement = "down", block }: { trigger: (p: { open: boolean; toggle: () => void }) => ReactNode; items: MenuItem[]; align?: "left" | "right"; label: string; placement?: "down" | "up"; block?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", block ? "block" : "inline-block")}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open ? (
        <div role="menu" aria-label={label} className={cn("absolute z-40 min-w-48 overflow-hidden rounded-xl border border-line bg-white p-1 shadow-pop animate-scale-in", align === "right" ? "right-0" : "left-0", placement === "up" ? "bottom-full mb-1.5" : "mt-1.5")}>
          {items.map((it) => (
            <button
              key={it.label}
              role="menuitem"
              type="button"
              disabled={it.disabled}
              title={it.hint}
              onClick={() => {
                setOpen(false);
                it.onSelect();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:size-4",
                it.danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-100",
              )}
            >
              {it.icon}
              <span className="flex-1">{it.label}</span>
              {it.hint && it.disabled ? <span className="text-[10px] font-normal text-slate-400">N/A</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Generic click-to-open popover with custom content. */
export function Popover({ trigger, children, align = "right", className, label }: { trigger: (p: { open: boolean; toggle: () => void }) => ReactNode; children: (close: () => void) => ReactNode; align?: "left" | "right"; className?: string; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative inline-block">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open ? (
        <div role="dialog" aria-label={label} className={cn("absolute z-40 mt-1.5 overflow-hidden rounded-xl border border-line bg-white shadow-pop animate-scale-in", align === "right" ? "right-0" : "left-0", className)}>
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
