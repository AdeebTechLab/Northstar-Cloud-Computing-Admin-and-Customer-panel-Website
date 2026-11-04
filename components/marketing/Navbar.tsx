"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CircleHelp, Home, LayoutDashboard, LogIn, Menu, Search, Tag, UserPlus, X, Mail, Server } from "lucide-react";
import { cn } from "@/lib/cn";
import { marketingNav } from "@/lib/site";
import { docs, faqs } from "@/lib/content";
import { useAuth, homeFor } from "@/lib/auth/AuthProvider";
import { SiteLogo } from "@/components/layout/Logos";
import { ButtonLink } from "@/components/ui/Button";
import { CommandPalette, useSearchShortcut, type SearchItem } from "@/components/layout/CommandPalette";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openSearch = useCallback((v: boolean) => setSearchOpen(v), []);
  useSearchShortcut(openSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const searchItems = useMemo<SearchItem[]>(
    () => [
      { id: "p-home", title: "Home", subtitle: "Cloud infrastructure. Without compromise.", group: "Pages", href: "/", icon: <Home /> },
      { id: "p-features", title: "Cloud computing features", subtitle: "Compute, data centers, scaling, security, networking", group: "Pages", href: "/#features", keywords: "workload performance", icon: <Server /> },
      { id: "p-pricing", title: "Pricing", subtitle: "Simple, transparent cloud pricing", group: "Pages", href: "/#pricing", keywords: "plans cost price starter professional business", icon: <Tag /> },
      { id: "p-faq", title: "Frequently asked questions", group: "Pages", href: "/#faq", keywords: "help faq", icon: <CircleHelp /> },
      { id: "p-docs", title: "Documentation", subtitle: "Guides, CLI and API reference", group: "Pages", href: "/docs", icon: <BookOpen /> },
      { id: "p-contact", title: "Contact support", subtitle: "Send a message to our team", group: "Pages", href: "/contact", keywords: "help email support", icon: <Mail /> },
      { id: "p-login", title: "Log in", group: "Account", href: "/login", keywords: "sign in", icon: <LogIn /> },
      { id: "p-signup", title: "Create an account", group: "Account", href: "/register", keywords: "sign up register free", icon: <UserPlus /> },
      ...docs.map((d) => ({ id: `d-${d.id}`, title: d.title, subtitle: d.summary, group: "Documentation", href: `/docs#${d.id}`, keywords: d.category, icon: <BookOpen /> })),
      ...faqs.map((f, i) => ({ id: `f-${i}`, title: f.q, subtitle: f.a.slice(0, 80) + "…", group: "FAQ", href: "/#faq", keywords: f.a, icon: <CircleHelp /> })),
    ],
    [],
  );

  return (
    <>
      <header
        data-sticky
        className={cn(
          "sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[box-shadow,border-color] duration-200",
          scrolled ? "border-line shadow-[0_4px_20px_-12px_rgba(15,23,42,0.18)]" : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <SiteLogo />
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {marketingNav.map((l) => (
              <Link key={l.label} href={l.href} className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-lg border border-line px-3 text-[13px] text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 md:flex"
              aria-label="Search the site"
            >
              <Search className="size-4" />
              <span>Search</span>
              <kbd className="rounded border border-line bg-slate-50 px-1 text-[10px] font-semibold">Ctrl K</kbd>
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Search the site">
              <Search className="size-[18px]" />
            </button>
            {user ? (
              <ButtonLink href={homeFor(user.role)} size="sm" className="hidden sm:inline-flex" icon={<LayoutDashboard />}>
                {user.role === "admin" ? "Admin console" : "Dashboard"}
              </ButtonLink>
            ) : (
              <>
                <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 sm:block">
                  Login
                </Link>
                <ButtonLink href="/register" size="sm" className="hidden px-5 sm:inline-flex">
                  Sign Up
                </ButtonLink>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <div className={cn("absolute inset-0 bg-slate-900/40 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div
          id="mobile-menu"
          className={cn(
            "absolute inset-x-0 top-16 origin-top border-b border-line bg-white px-4 pb-6 pt-3 shadow-pop transition-all duration-200 sm:px-6",
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {marketingNav.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-slate-800 hover:bg-slate-50">
                {l.label}
                <ArrowRight className="size-4 text-slate-400" />
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
            {user ? (
              <ButtonLink href={homeFor(user.role)} className="col-span-2" tabIndex={open ? 0 : -1}>
                Open {user.role === "admin" ? "admin console" : "dashboard"}
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="secondary" tabIndex={open ? 0 : -1}>
                  Login
                </ButtonLink>
                <ButtonLink href="/register" tabIndex={open ? 0 : -1}>
                  Sign Up
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} placeholder="Search pages, docs and FAQs…" />
    </>
  );
}
