"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { longDate } from "@/lib/format";
import { SITE_LAST_UPDATED } from "@/lib/site";

/** "Skip to content" link for keyboard and screen-reader users. */
export function SkipLink({ target = "main-content" }: { target?: string }) {
  return (
    <a
      href={`#${target}`}
      className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-pop transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}

/** Thin bar at the top that fills as the page scrolls. */
export function ScrollProgress({ className }: { className?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setP(max > 0 ? (el.scrollTop / max) * 100 : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div data-scroll-progress className={cn("pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]", className)} aria-hidden="true">
      <div className="h-full origin-left bg-gradient-to-r from-brand-500 via-brand-400 to-sky-400 shadow-[0_0_8px_rgba(59,116,245,0.6)]" style={{ transform: `scaleX(${p / 100})` }} />
    </div>
  );
}

/** Appears after scrolling down; smooth-scrolls to the top. */
export function BackToTop({ className }: { className?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      data-floating
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }}
      aria-label="Back to top"
      className={cn(
        "fixed right-4 z-[60] grid size-11 place-items-center rounded-full border border-line bg-white text-slate-700 shadow-pop transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-600 sm:right-6",
        show ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        className ?? "bottom-5 sm:bottom-6",
      )}
    >
      <ArrowUp className="size-[18px]" />
    </button>
  );
}

/** Fades content in when it scrolls into view. */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={cn("reveal", visible && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function LastUpdated({ className, date = SITE_LAST_UPDATED, prefix = "Last updated" }: { className?: string; date?: string; prefix?: string }) {
  return (
    <p className={cn("text-xs text-slate-500", className)}>
      {prefix}: <time dateTime={date}>{longDate(date)}</time>
    </p>
  );
}
