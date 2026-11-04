"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Bell, ChevronDown, ExternalLink, Globe, LayoutGrid, LogOut, Menu, MoreHorizontal, Search, Settings, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PanelLogo } from "@/components/layout/Logos";
import { BackToTop, ScrollProgress } from "@/components/layout/SiteChrome";
import { CommandPalette, useSearchShortcut, type SearchItem } from "@/components/layout/CommandPalette";
import { ConfirmModal } from "@/components/ui/Modal";
import { Menu as DropMenu, Popover } from "@/components/ui/Menu";
import { useToast } from "@/components/ui/Toast";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  exact?: boolean;
  /** Extra path prefixes that should highlight this item (e.g. server detail pages). */
  matchPrefixes?: string[];
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}
export interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
  href?: string;
  unread?: boolean;
}

function isActive(pathname: string, item: NavItem) {
  if (item.matchPrefixes?.some((p) => pathname.startsWith(p))) return true;
  if (item.exact) return pathname === item.href || pathname === `${item.href}/`;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function Sidebar({
  groups,
  pathname,
  onNavigate,
  top,
  bottom,
  homeHref,
}: {
  groups: NavGroup[];
  pathname: string;
  onNavigate?: () => void;
  top?: ReactNode;
  bottom?: ReactNode;
  homeHref: string;
}) {
  return (
    <div className="flex h-full flex-col bg-navy-900 text-slate-300">
      <div className="flex h-16 shrink-0 items-center border-b border-white/[0.06] px-5">
        <PanelLogo href={homeHref} />
      </div>
      <div className="scroll-thin-dark flex-1 overflow-y-auto px-3 py-4">
        {top}
        <nav aria-label="Panel navigation" className="space-y-6">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{g.label}</p>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const active = isActive(pathname, it);
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 [&_svg]:size-4 [&_svg]:shrink-0",
                          active ? "bg-brand-600 text-white shadow-sm shadow-brand-900/50" : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
                        )}
                      >
                        <span className={cn("transition-transform duration-150", !active && "group-hover:translate-x-0.5")}>{it.icon}</span>
                        <span className="flex-1">{it.label}</span>
                        {it.badge ? <span className={cn("grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold", active ? "bg-white text-brand-700" : "bg-red-500 text-white")}>{it.badge}</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      {bottom ? <div className="shrink-0 border-t border-white/[0.06] p-3">{bottom}</div> : null}
    </div>
  );
}

export function PanelShell({
  groups,
  homeHref,
  consoleLabel,
  sidebarTop,
  sidebarBottom,
  searchItems,
  searchPlaceholder,
  notices,
  children,
}: {
  groups: NavGroup[];
  homeHref: string;
  consoleLabel: string;
  sidebarTop?: ReactNode;
  sidebarBottom?: (p: { requestSignOut: () => void }) => ReactNode;
  searchItems: () => SearchItem[];
  searchPlaceholder: string;
  notices: Notice[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, logout } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const openSearch = useCallback((v: boolean) => setSearch(v), []);
  useSearchShortcut(openSearch);

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const current = groups.flatMap((g) => g.items).find((it) => isActive(pathname, it));
  const unread = notices.filter((n) => n.unread && !readIds.includes(n.id)).length;
  const requestSignOut = () => setConfirmOut(true);

  return (
    <div className="min-h-dvh bg-canvas">
      <ScrollProgress />
      {/* Desktop sidebar */}
      <aside data-sidebar className="fixed inset-y-0 left-0 z-30 hidden w-[248px] lg:block">
        <Sidebar groups={groups} pathname={pathname} top={sidebarTop} bottom={sidebarBottom?.({ requestSignOut })} homeHref={homeHref} />
      </aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-[75] lg:hidden", drawer ? "" : "pointer-events-none")} aria-hidden={!drawer}>
        <div className={cn("absolute inset-0 bg-slate-950/50 transition-opacity duration-200", drawer ? "opacity-100" : "opacity-0")} onClick={() => setDrawer(false)} />
        <aside
          data-sidebar
          className={cn("absolute inset-y-0 left-0 w-[272px] max-w-[85vw] shadow-2xl transition-transform duration-250 ease-out", drawer ? "translate-x-0" : "-translate-x-full")}
          aria-label="Menu"
        >
          <button type="button" onClick={() => setDrawer(false)} className="absolute right-3 top-4 z-10 grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close menu">
            <X className="size-5" />
          </button>
          <Sidebar groups={groups} pathname={pathname} onNavigate={() => setDrawer(false)} top={sidebarTop} bottom={sidebarBottom?.({ requestSignOut })} homeHref={homeHref} />
        </aside>
      </div>

      <div data-panel-main className="lg:pl-[248px]">
        {/* Sticky top bar */}
        <header data-sticky className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button type="button" onClick={() => setDrawer(true)} className="grid size-9 place-items-center rounded-lg border border-line text-slate-600 hover:bg-slate-50 lg:hidden" aria-label="Open menu" aria-expanded={drawer}>
              <Menu className="size-[18px]" />
            </button>
            <div className="hidden min-w-0 items-center gap-2.5 md:flex">
              <span className="grid size-8 place-items-center rounded-lg border border-line text-slate-500">
                <LayoutGrid className="size-4" />
              </span>
              <p className="truncate text-[13px] text-slate-400">
                {consoleLabel} <span className="px-1">/</span> <span className="font-semibold text-slate-800">{current?.label ?? "Overview"}</span>
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSearch(true)}
                className="flex h-9 w-9 items-center gap-2 rounded-lg border border-line bg-slate-50/70 px-2.5 text-[13px] text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600 sm:w-64 sm:px-3"
                aria-label="Search"
              >
                <Search className="size-4 shrink-0" />
                <span className="hidden flex-1 truncate text-left sm:block">{searchPlaceholder}</span>
                <kbd className="hidden rounded border border-line bg-white px-1 text-[10px] font-semibold text-slate-400 sm:block">⌘K</kbd>
              </button>
              <Popover
                label="Notifications"
                className="w-[min(22rem,calc(100vw-2rem))]"
                trigger={({ toggle, open }) => (
                  <button type="button" onClick={toggle} aria-expanded={open} className="relative grid size-9 place-items-center rounded-lg border border-line text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800" aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}>
                    <Bell className="size-4" />
                    {unread ? <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" /> : null}
                  </button>
                )}
              >
                {(close) => (
                  <div>
                    <div className="flex items-center justify-between border-b border-line px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">Notifications</p>
                      <button type="button" onClick={() => setReadIds(notices.map((n) => n.id))} className="text-xs font-semibold text-brand-600 hover:underline">
                        Mark all as read
                      </button>
                    </div>
                    <ul className="max-h-80 divide-y divide-line overflow-y-auto">
                      {notices.map((n) => {
                        const isUnread = n.unread && !readIds.includes(n.id);
                        return (
                          <li key={n.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setReadIds((r) => [...r, n.id]);
                                close();
                                if (n.href) router.push(n.href);
                              }}
                              className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                            >
                              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", isUnread ? "bg-brand-600" : "bg-slate-200")} />
                              <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-slate-900">{n.title}</span>
                                <span className="mt-0.5 block text-xs text-slate-500">{n.body}</span>
                                <span className="mt-1 block text-[11px] text-slate-400">{n.time}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Popover>
              <DropMenu
                label="Account"
                trigger={({ toggle, open }) => (
                  <button type="button" onClick={toggle} aria-expanded={open} className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-1.5 transition-colors hover:bg-slate-50">
                    <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{user?.initials}</span>
                    <span className="hidden text-left leading-tight sm:block">
                      <span className="block text-[13px] font-semibold text-slate-900">{user?.name}</span>
                      <span className="block text-[11px] text-slate-500">{user?.title}</span>
                    </span>
                    <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
                  </button>
                )}
                items={[
                  { label: "Settings", icon: <Settings />, onSelect: () => router.push(`${homeHref}/settings`) },
                  { label: "Back to website", icon: <Globe />, onSelect: () => router.push("/") },
                  { label: "Sign out", icon: <LogOut />, danger: true, onSelect: requestSignOut },
                ]}
              />
            </div>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1320px] px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <BackToTop />
      <CommandPalette open={search} onClose={() => setSearch(false)} items={search ? searchItems() : []} placeholder={searchPlaceholder} />
      <ConfirmModal
        open={confirmOut}
        onClose={() => setConfirmOut(false)}
        onConfirm={() => {
          setConfirmOut(false);
          logout();
          toast({ tone: "success", title: "Signed out", message: "You have been signed out safely." });
          router.push("/login");
        }}
        title="Sign out of Northstar Cloud?"
        message="You will need to log in again to manage your servers."
        confirmLabel="Sign out"
        tone="primary"
      />
    </div>
  );
}

/** Small user row used at the bottom of the sidebar. */
export function SidebarUser({ name, title, initials, onSignOut, settingsHref }: { name: string; title: string; initials: string; onSignOut: () => void; settingsHref: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-200">{initials}</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[13px] font-semibold text-white">{name}</span>
        <span className="block truncate text-[11px] text-slate-500">{title}</span>
      </span>
      <DropMenu
        label="User menu"
        align="right"
        placement="up"
        trigger={({ toggle }) => (
          <button type="button" onClick={toggle} className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-white/10 hover:text-white" aria-label="User menu">
            <MoreHorizontal className="size-4" />
          </button>
        )}
        items={[
          { label: "Settings", icon: <Settings />, onSelect: () => router.push(settingsHref) },
          { label: "Website", icon: <ExternalLink />, onSelect: () => router.push("/") },
          { label: "Sign out", icon: <LogOut />, danger: true, onSelect: onSignOut },
        ]}
      />
    </div>
  );
}
