"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

const control =
  "block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-[0_1px_1px_rgba(15,23,42,0.02)] transition-colors duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
const okBorder = "border-line";
const errBorder = "border-red-300 hover:border-red-400 focus:border-red-500 focus:ring-red-500/15";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label?: ReactNode;
  htmlFor?: string;
  error?: string | null;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-slate-800">
          {label}
          {required ? <span className="ml-0.5 text-red-500" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 animate-fade-in" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; leading?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, invalid, leading, ...rest }, ref) {
  if (leading) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 [&_svg]:size-4">{leading}</span>
        <input ref={ref} aria-invalid={invalid || undefined} className={cn(control, "h-10 pl-9", invalid ? errBorder : okBorder, className)} {...rest} />
      </div>
    );
  }
  return <input ref={ref} aria-invalid={invalid || undefined} className={cn(control, "h-10", invalid ? errBorder : okBorder, className)} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(function Textarea(
  { className, invalid, rows = 4, ...rest },
  ref,
) {
  return <textarea ref={ref} rows={rows} aria-invalid={invalid || undefined} className={cn(control, "resize-y py-2.5 leading-relaxed", invalid ? errBorder : okBorder, className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(function Select(
  { className, invalid, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select ref={ref} aria-invalid={invalid || undefined} className={cn(control, "h-10 appearance-none pr-9", invalid ? errBorder : okBorder, className)} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    </div>
  );
});

/** Password field with a visibility toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(function PasswordInput({ className, invalid, ...rest }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(control, "h-10 pr-11", invalid ? errBorder : okBorder, className)}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-lg text-slate-400 transition-colors hover:text-slate-700"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});

export function Checkbox({ label, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  const id = useId();
  return (
    <label htmlFor={rest.id ?? id} className={cn("inline-flex cursor-pointer items-start gap-2.5 text-[13px] text-slate-600", className)}>
      <input
        id={rest.id ?? id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 accent-brand-600"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}

/** Accessible on/off switch. */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  const auto = useId();
  const tid = id ?? auto;
  const sw = (
    <button
      id={tid}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50",
        checked ? "bg-brand-600 hover:bg-brand-700" : "bg-slate-200 hover:bg-slate-300",
      )}
    >
      <span className="sr-only">{typeof label === "string" ? label : "Toggle"}</span>
      <span className={cn("inline-block size-[18px] rounded-full bg-white shadow transition-transform duration-200", checked ? "translate-x-[20px]" : "translate-x-[2px]")} />
    </button>
  );
  if (!label) return sw;
  return (
    <div className="flex items-center justify-between gap-6 py-3.5">
      <label htmlFor={tid} className="min-w-0 cursor-pointer">
        <span className="block text-[13px] font-semibold text-slate-800">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-slate-500">{description}</span> : null}
      </label>
      {sw}
    </div>
  );
}
