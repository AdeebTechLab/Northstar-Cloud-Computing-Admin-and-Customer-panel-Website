"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, ArrowUpRight, ChevronDown, CreditCard, FileText, KeyRound, LayoutDashboard, LifeBuoy, Plus, Server, Settings, Shield, Ticket } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { RequireRole, useAuth } from "@/lib/auth/AuthProvider";
import { PanelShell, SidebarUser, type NavGroup, type Notice } from "@/components/panel/PanelShell";
import type { SearchItem } from "@/components/layout/CommandPalette";
import { Menu } from "@/components/ui/Menu";
import { money } from "@/lib/format";

function WorkspaceSwitcher() {
  return (
    <div className="mb-6">
      <Menu
        label="Workspace"
        align="left"
        block
        trigger={({ toggle, open }) => (
          <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.08]">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Workspace
              </span>
              <span className="mt-0.5 block truncate text-[13px] font-semibold text-white">Customer Console</span>
            </span>
            <ChevronDown className="size-4 text-slate-500" />
          </button>
        )}
        items={[
          { label: "Customer Console (current)", onSelect: () => undefined },
          { label: "Create a new workspace", disabled: true, hint: "Available after backend integration", onSelect: () => undefined },
        ]}
      />
    </div>
  );
}

function CustomerChrome({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const tickets = useApi(() => api.customer.tickets(), []);
  const servers = useApi(() => api.customer.servers(), []);
  const invoices = useApi(() => api.customer.invoices(), []);
  const keys = useApi(() => api.customer.sshKeys(), []);
  const openTickets = tickets.data?.filter((t) => t.status !== "resolved").length ?? 0;

  const groups: NavGroup[] = [
    {
      label: "Workspace",
      items: [
        { label: "Overview", href: "/dashboard", icon: <LayoutDashboard />, exact: true },
        { label: "My Services", href: "/dashboard/services", icon: <Server />, matchPrefixes: ["/dashboard/servers/srv-"] },
        { label: "Deploy New Server", href: "/dashboard/servers/new", icon: <Plus /> },
      ],
    },
    {
      label: "Manage",
      items: [
        { label: "SSH Keys", href: "/dashboard/ssh-keys", icon: <KeyRound /> },
        { label: "Firewall", href: "/dashboard/firewall", icon: <Shield /> },
        { label: "Billing & Payments", href: "/dashboard/billing", icon: <CreditCard /> },
        { label: "Activity Log", href: "/dashboard/activity", icon: <Activity /> },
        { label: "Support Tickets", href: "/dashboard/support", icon: <LifeBuoy />, badge: openTickets || undefined },
        { label: "Account Settings", href: "/dashboard/settings", icon: <Settings /> },
      ],
    },
  ];

  const pageItems: SearchItem[] = groups.flatMap((g) => g.items.map((it) => ({ id: `pg-${it.href}`, title: it.label, group: "Pages", href: it.href, icon: it.icon })));

  const searchItems = (): SearchItem[] => [
    ...pageItems,
    ...(servers.data ?? []).map((s) => ({ id: `s-${s.id}`, title: s.name, subtitle: `${s.ipAddresses[0]} · ${s.id} · ${s.status}`, group: "Servers", href: s.id.startsWith("srv-") ? `/dashboard/servers/${s.id}` : "/dashboard/services", keywords: s.ipAddresses.join(" "), icon: <Server /> })),
    ...(invoices.data ?? []).map((i) => ({ id: `i-${i.id}`, title: i.id, subtitle: `${i.period} · ${money(i.amount)} · ${i.status}`, group: "Invoices", href: "/dashboard/billing", icon: <FileText /> })),
    ...(tickets.data ?? []).map((t) => ({ id: `t-${t.id}`, title: `${t.id} ${t.subject}`, subtitle: `${t.category} · ${t.status.replace("_", " ")}`, group: "Support tickets", href: "/dashboard/support", icon: <Ticket /> })),
    ...(keys.data ?? []).map((k) => ({ id: `k-${k.id}`, title: k.name, subtitle: k.fingerprint, group: "SSH keys", href: "/dashboard/ssh-keys", icon: <KeyRound /> })),
  ];

  const notices: Notice[] = [
    { id: "n1", title: "Invoice INV-2026-010 is ready", body: "Your October invoice of $124.80 is pending payment.", time: "Today", href: "/dashboard/billing", unread: true },
    { id: "n2", title: "High CPU on api-server-02", body: "CPU usage has been above 75% for 30 minutes.", time: "2 hours ago", href: "/dashboard/servers/srv-001285", unread: true },
    { id: "n3", title: "Ticket #NS-1048 updated", body: "Support replied to “Server deployment issue”.", time: "Yesterday", href: "/dashboard/support", unread: false },
  ];

  return (
    <PanelShell
      groups={groups}
      homeHref="/dashboard"
      consoleLabel="Customer Console"
      sidebarTop={<WorkspaceSwitcher />}
      searchItems={searchItems}
      searchPlaceholder="Search servers, invoices…"
      notices={notices}
      sidebarBottom={({ requestSignOut }) => (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3.5">
            <p className="text-[13px] font-semibold text-white">Need a hand?</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Explore guides or get help from our cloud support team.</p>
            <Link href="/dashboard/support" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-brand-500">
              Visit support <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {user ? <SidebarUser name={user.name} title={user.title} initials={user.initials} onSignOut={requestSignOut} settingsHref="/dashboard/settings" /> : null}
        </div>
      )}
    >
      {children}
    </PanelShell>
  );
}

export function CustomerShell({ children }: { children: ReactNode }) {
  return (
    <RequireRole role="customer">
      <CustomerChrome>{children}</CustomerChrome>
    </RequireRole>
  );
}
