"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, CircleHelp, Home, LayoutDashboard, LogIn, Mail, Menu, Search, Server, Tag, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { marketingNav, topBarLinks, type NavEntry } from "@/lib/site";
import { docs, faqs } from "@/lib/content";
import { useAuth, homeFor } from "@/lib/auth/AuthProvider";
import { SiteLogo } from "@/components/layout/Logos";
import { CommandPalette, useSearchShortcut, type SearchItem } from "@/components/layout/CommandPalette";

/** Header pill (nav items, Log in). Mirrors the DigitalOcean header link: 16/24, weight 500, 8px 16px, 999px radius. */
const pill = "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-base font-medium leading-6 transition-[background-color,color,box-shadow] duration-300 ease-in-out";

/** Full-width dropdown: category column on the left, links for the hovered category on the right. */
function MegaMenu({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  const [active, setActive] = useState(0);
  const cat = entry.categories?.[active];
  return (
    <div className="mx-auto flex h-[464px] max-w-[1440px] gap-6 px-12 py-8">
      <div className="flex h-full w-full max-w-[320px] shrink-0 flex-col rounded-2xl border border-line-soft bg-surface p-4">
        <div className="scroll-none flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {entry.categories?.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn("group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-300", i === active ? "bg-hover" : "hover:bg-hover")}
            >
              <span className="min-w-0">
                <span className="block text-base font-medium leading-6 text-ink">{c.title}</span>
                {c.description ? <span className="mt-0.5 hidden text-sm font-medium leading-5 text-ink-2 xl:block">{c.description}</span> : null}
              </span>
              <ChevronRight className={cn("size-5 shrink-0 text-foam-200 transition-all duration-300", i === active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} aria-hidden="true" />
            </button>
          ))}
        </div>
        {entry.cta ? (
          <Link
            href={entry.cta.href}
            onClick={onNavigate}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-deep-1000 px-6 py-2 text-base font-medium leading-6 text-deep-1000 transition-colors duration-300 hover:border-transparent hover:bg-foam-200 hover:text-deep-50"
          >
            {entry.cta.label} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <div className="scroll-none flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1 px-2 pt-4">
          <h3 className="font-sans text-lg font-bold leading-[26px] text-ink">{cat?.title}</h3>
          {cat?.description ? <p className="text-sm text-muted">{cat.description}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
          {cat?.links.map((l) => (
            <Link key={l.label} href={l.href} onClick={onNavigate} className="group rounded-lg px-3 py-3 transition-colors duration-300 hover:bg-hover">
              <span className="flex items-center gap-2 text-base font-medium text-ink">
                {l.label}
                <ChevronRight className="size-4 -translate-x-1 text-foam-200 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </span>
              {l.description ? <span className="mt-1 block text-sm text-ink-2">{l.description}</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false); // mobile menu
  const [menu, setMenu] = useState<string | null>(null); // desktop mega menu
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const openSearch = useCallback((v: boolean) => setSearchOpen(v), []);
  useSearchShortcut(openSearch);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openMenu = (label: string) => {
    cancelClose();
    setMenu(label);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setMenu(null), 140);
  };

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const current = marketingNav.find((e) => e.label === menu);

  const searchItems = useMemo<SearchItem[]>(
    () => [
      { id: "p-home", title: "Home", subtitle: "Cloud infrastructure. Without compromise.", group: "Pages", href: "/", icon: <Home /> },
      { id: "p-platform", title: "Products and platform", subtitle: "Compute, storage, networking, security, management", group: "Pages", href: "/#platform", keywords: "workload performance features", icon: <Server /> },
      { id: "p-pricing", title: "Pricing", subtitle: "Simple, transparent cloud pricing", group: "Pages", href: "/pricing", keywords: "plans cost price starter professional business", icon: <Tag /> },
      { id: "p-faq", title: "Frequently asked questions", group: "Pages", href: "/#faq", keywords: "help faq", icon: <CircleHelp /> },
      { id: "p-docs", title: "Documentation", subtitle: "Guides, CLI and API reference", group: "Pages", href: "/docs", icon: <BookOpen /> },
      { id: "p-contact", title: "Contact support", subtitle: "Send a message to our team", group: "Pages", href: "/contact", keywords: "help email support sales", icon: <Mail /> },
      { id: "p-login", title: "Log in", group: "Account", href: "/login", keywords: "sign in", icon: <LogIn /> },
      { id: "p-signup", title: "Create an account", group: "Account", href: "/register", keywords: "sign up register free", icon: <UserPlus /> },
      ...marketingNav.flatMap((e) => (e.categories ?? []).flatMap((c) => c.links.map((l) => ({ id: `n-${e.label}-${c.title}-${l.label}`, title: l.label, subtitle: l.description, group: e.label, href: l.href, keywords: c.title, icon: <ChevronRight /> })))),
      ...docs.map((d) => ({ id: `d-${d.id}`, title: d.title, subtitle: d.summary, group: "Documentation", href: `/docs#${d.id}`, keywords: d.category, icon: <BookOpen /> })),
      ...faqs.map((f, i) => ({ id: `f-${i}`, title: f.q, subtitle: f.a.slice(0, 80) + "…", group: "FAQ", href: "/#faq", keywords: f.a, icon: <CircleHelp /> })),
    ],
    [],
  );

  return (
    <>
      <div data-site-header className="sticky top-0 z-[100] isolate">
        {/* Top bar (DigitalOcean "tophat") */}
        <div aria-label="Top bar" className="hidden bg-foam-700 py-2 lg:block">
          <nav className="mx-auto flex max-w-[1360px] items-center justify-end px-6">
            <ul className="flex items-center gap-4">
              {topBarLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="block text-center text-sm font-medium leading-5 text-deep-1000 transition-colors duration-300 hover:underline hover:underline-offset-2">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Blurred backdrop behind the page while a menu is open */}
        <div aria-hidden="true" className={cn("pointer-events-none fixed inset-x-0 top-0 -z-10 h-screen bg-white/10 backdrop-blur-[6px] transition-opacity duration-300", menu ? "opacity-100" : "opacity-0")} />

        <header data-sticky className="relative bg-canvas after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-line-soft after:content-['']" onMouseLeave={scheduleClose}>
          <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-4 lg:gap-6 lg:px-16">
            <div className="mr-auto leading-none">
              <SiteLogo />
            </div>

            <nav aria-label="Main" className="hidden min-w-0 flex-1 lg:block">
              <ul className="flex items-center">
                {marketingNav.map((entry, i) => {
                  const hasMenu = !!entry.categories;
                  const isOpen = menu === entry.label;
                  return (
                    <li
                      key={entry.label}
                      className={cn(i === 0 && "ml-auto", i === marketingNav.length - 1 && "mr-auto")}
                      onMouseEnter={() => (hasMenu ? openMenu(entry.label) : setMenu(null))}
                      onFocus={() => (hasMenu ? openMenu(entry.label) : setMenu(null))}
                    >
                      {hasMenu ? (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                          onClick={() => setMenu(isOpen ? null : entry.label)}
                          className={cn(pill, "gap-0.5 text-deep-950 hover:bg-hover hover:text-ink", isOpen && "bg-hover text-ink")}
                        >
                          {entry.label}
                          <ChevronDown className={cn("size-5 shrink-0 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden="true" />
                        </button>
                      ) : (
                        <Link href={entry.href} className={cn(pill, "text-deep-950 hover:bg-hover hover:text-ink")}>
                          {entry.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden items-center gap-4 lg:flex" onMouseEnter={() => setMenu(null)}>
              <button type="button" onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-full text-deep-950 transition-colors duration-300 hover:bg-hover hover:text-ink" aria-label="Search the site (Ctrl K)">
                <Search className="size-5" />
              </button>
              {user ? (
                <Link href={homeFor(user.role)} className={cn(pill, "gap-2 bg-foam-200 text-deep-50 hover:bg-foam-400")}>
                  <LayoutDashboard className="size-4" /> {user.role === "admin" ? "Admin console" : "Dashboard"}
                </Link>
              ) : (
                <ul className="flex items-center gap-4">
                  <li>
                    <Link href="/login" className={cn(pill, "text-deep-950 shadow-[0_0_0_1px_#e5eceb] hover:bg-hover hover:text-ink")}>
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className={cn(pill, "bg-foam-200 text-deep-50 hover:bg-foam-400")}>
                      Sign up
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <button type="button" onClick={() => setSearchOpen(true)} className="grid size-8 place-items-center rounded-full text-deep-950 hover:bg-hover lg:hidden" aria-label="Search the site">
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-8 place-items-center text-deep-950 lg:hidden"
              aria-label={open ? "Close menu" : "Menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>
          </div>

          {/* Desktop mega menu panel */}
          <div
            className={cn(
              "absolute inset-x-0 top-full hidden overflow-hidden rounded-b-3xl bg-canvas shadow-[8px_8px_12px_0_rgba(247,248,251,0.1)] transition-opacity duration-300 lg:block",
              menu && current ? "opacity-100" : "pointer-events-none h-0 opacity-0",
            )}
            onMouseEnter={cancelClose}
          >
            {menu && current ? <MegaMenu key={menu} entry={current} onNavigate={() => setMenu(null)} /> : null}
          </div>
        </header>
      </div>

      {/* Mobile menu: slides in from the right under the header */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-[95] flex flex-col overflow-y-auto bg-canvas transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex flex-1 flex-col justify-between gap-10 p-6 pb-10">
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-2">
              {marketingNav.map((entry) => {
                const hasMenu = !!entry.categories;
                const isOpen = mobileSection === entry.label;
                return (
                  <li key={entry.label} className="border-b border-line-soft">
                    {hasMenu ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setMobileSection(isOpen ? null : entry.label)}
                          tabIndex={open ? 0 : -1}
                          className="flex w-full items-center justify-between gap-2 py-3 text-base font-medium leading-6 text-ink"
                        >
                          {entry.label}
                          <ChevronDown className={cn("size-5 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden="true" />
                        </button>
                        <div className="do-accordion-content" data-open={isOpen}>
                          <div>
                            <div className="flex flex-col gap-4 pb-4">
                              {entry.categories?.map((c) => (
                                <div key={c.title}>
                                  <p className="text-sm font-bold text-ink">{c.title}</p>
                                  <ul className="mt-1 flex flex-col">
                                    {c.links.map((l) => (
                                      <li key={l.label}>
                                        <Link href={l.href} onClick={() => setOpen(false)} tabIndex={open && isOpen ? 0 : -1} className="block rounded-lg py-1.5 text-sm text-ink-2 hover:text-ink">
                                          {l.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              {entry.cta ? (
                                <Link href={entry.cta.href} onClick={() => setOpen(false)} tabIndex={open && isOpen ? 0 : -1} className="inline-flex items-center gap-2 text-sm font-medium text-foam-200">
                                  {entry.cta.label} <ArrowRight className="size-4" aria-hidden="true" />
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link href={entry.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="block py-3 text-base font-medium leading-6 text-ink">
                        {entry.label}
                      </Link>
                    )}
                  </li>
                );
              })}
              {topBarLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="block py-1.5 text-sm font-medium text-ink-2 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex gap-4">
            {user ? (
              <li className="flex-1">
                <Link href={homeFor(user.role)} tabIndex={open ? 0 : -1} className={cn(pill, "w-full bg-foam-200 text-deep-50 hover:bg-foam-400")}>
                  Open {user.role === "admin" ? "admin console" : "dashboard"}
                </Link>
              </li>
            ) : (
              <>
                <li className="flex-1">
                  <Link href="/login" tabIndex={open ? 0 : -1} className={cn(pill, "w-full text-deep-950 shadow-[0_0_0_1px_#e5eceb] hover:bg-hover")}>
                    Log in
                  </Link>
                </li>
                <li className="flex-1">
                  <Link href="/register" tabIndex={open ? 0 : -1} className={cn(pill, "w-full bg-foam-200 text-deep-50 hover:bg-foam-400")}>
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} placeholder="Search pages, products, docs and FAQs…" />
    </>
  );
}
