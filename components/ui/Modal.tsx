"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  dismissible = true,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  dismissible?: boolean;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>("[data-autofocus], input, select, textarea, button:not([data-close])");
      (el ?? panelRef.current)?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onCloseRef.current();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, dismissible]);

  if (!open || typeof document === "undefined") return null;

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

  return createPortal(
    <div data-modal-root className="fixed inset-0 z-[80]">
      <div data-modal-overlay className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] animate-fade-in" onClick={dismissible ? onClose : undefined} />
      <div className="absolute inset-0 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6" onClick={dismissible ? onClose : undefined}>
        <div
          ref={panelRef}
          data-modal-panel
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-white shadow-pop outline-none animate-scale-in sm:rounded-2xl",
            widths[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id={titleId} className="text-base font-semibold text-slate-900">
                {title}
              </h2>
              {description ? <p className="mt-1 text-[13px] text-slate-500">{description}</p> : null}
            </div>
            {dismissible ? (
              <button data-close type="button" onClick={onClose} className="no-print -mr-1.5 grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Close dialog">
                <X className="size-4" />
              </button>
            ) : null}
          </div>
          {children ? <div className="scroll-thin overflow-y-auto px-5 py-5 sm:px-6">{children}</div> : null}
          {footer ? <div className="no-print flex flex-col-reverse gap-2 border-t border-line bg-slate-50/60 px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6 rounded-b-2xl">{footer}</div> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Confirmation dialog for destructive or important actions. */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  tone = "danger",
  loading,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  message: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading} loadingText="Working…" data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3.5">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", tone === "danger" ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600")}>
          <AlertTriangle className="size-5" />
        </span>
        <div className="min-w-0 text-sm leading-relaxed text-slate-600">
          {message}
          {children}
        </div>
      </div>
    </Modal>
  );
}
