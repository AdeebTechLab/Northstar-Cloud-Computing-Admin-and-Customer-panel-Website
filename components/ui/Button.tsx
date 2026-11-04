import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "danger-outline" | "white" | "outline-light" | "link";
type Size = "xs" | "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-600/60",
  secondary: "border border-line bg-white text-slate-700 shadow-[0_1px_1px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 disabled:bg-red-600/60",
  "danger-outline": "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-60",
  white: "bg-white text-slate-900 shadow-sm hover:bg-slate-100 disabled:opacity-60",
  "outline-light": "border border-white/30 bg-white/0 text-white hover:border-white/60 hover:bg-white/10 disabled:opacity-60",
  link: "px-0! text-brand-600 hover:text-brand-700 hover:underline underline-offset-4",
};

const sizes: Record<Size, string> = {
  xs: "h-7 gap-1 rounded-md px-2.5 text-xs",
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-9 gap-2 rounded-lg px-4 text-sm",
  lg: "h-11 gap-2 rounded-lg px-5 text-[15px]",
};

const base =
  "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 [&_svg]:size-4 [&_svg]:shrink-0";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, loadingText, icon, iconRight, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {loading && loadingText ? loadingText : children}
      {!loading && iconRight}
    </button>
  );
});

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; icon?: ReactNode; iconRight?: ReactNode };

export function ButtonLink({ variant = "primary", size = "md", icon, iconRight, className, children, ...rest }: LinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
