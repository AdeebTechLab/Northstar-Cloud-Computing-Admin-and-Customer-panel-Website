import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

/**
 * Pill buttons cloned from the DigitalOcean Button component.
 *  primary          → cyan fill, black text (Button.colorPrimary)
 *  secondary        → outlined pill that fills cyan on hover (Button.colorGhost)
 *  tertiary         → deep-400 fill (Button.colorSecondary)
 *  ghost            → text only with the header-link hover
 *  hero / hero-ghost → glowing white pills used on hero backgrounds
 *  white            → white fill (Button.colorWhite)
 */
type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-outline" | "white" | "hero" | "hero-ghost" | "outline-light" | "link";
type Size = "xs" | "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-foam-200 text-deep-50 hover:bg-foam-400 focus-visible:bg-foam-400 disabled:bg-foam-200/50 disabled:text-deep-50/70",
  secondary: "border-deep-1000 bg-transparent text-deep-1000 hover:border-transparent hover:bg-foam-200 hover:text-deep-50 disabled:opacity-50",
  tertiary: "border-transparent bg-deep-400 text-deep-1000 hover:bg-deep-500 disabled:opacity-50",
  ghost: "border-transparent bg-transparent text-deep-950 hover:bg-hover hover:text-deep-1000 disabled:opacity-50",
  danger: "border-transparent bg-coral-400 text-deep-1000 hover:bg-coral-300 disabled:opacity-60",
  "danger-outline": "border-coral-300 bg-transparent text-coral-200 hover:bg-coral-900 disabled:opacity-60",
  white: "border-transparent bg-deep-1000 text-deep-50 hover:bg-foam-200 disabled:opacity-60",
  hero: "border-transparent bg-deep-1000 text-deep-50 shadow-glow hover:bg-deep-950 hover:shadow-glow-lg",
  "hero-ghost": "border-deep-1000 bg-transparent text-deep-1000 shadow-glow hover:border-transparent hover:bg-deep-950 hover:text-deep-50 hover:shadow-glow-lg",
  "outline-light": "border-deep-1000 bg-transparent text-deep-1000 shadow-glow hover:border-transparent hover:bg-deep-950 hover:text-deep-50 hover:shadow-glow-lg",
  link: "h-auto! rounded-none border-transparent bg-transparent px-0! text-foam-200 hover:text-foam-300 hover:underline underline-offset-4",
};

const sizes: Record<Size, string> = {
  xs: "h-7 gap-1 px-3 text-xs",
  sm: "h-8 gap-1.5 px-4 text-sm",
  md: "h-10 gap-2 px-6 text-[15px]",
  lg: "h-12 gap-2 px-7 text-base",
};

const base =
  "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full border font-medium transition-[background-color,border-color,color,box-shadow] duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foam-200 [&_svg]:size-4 [&_svg]:shrink-0";

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
