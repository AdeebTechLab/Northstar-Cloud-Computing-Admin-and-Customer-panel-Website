"use client";

import type { ReactNode } from "react";
import { CreditCard, LayoutDashboard, LifeBuoy, LogOut, Server, Settings, ShieldCheck, Tag, Users, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { RequireRole } from "@/lib/auth/AuthProvider";
import { PanelShell, type NavGroup, type Notice } from "@/components/panel/PanelShell";
import type { SearchItem } from "@/components/layout/CommandPalette";
import { money } from "@/lib/format";

function AdminChrome({ children }: { children: ReactNode }) {
  const customers = useApi(() => api.admin.customers(), []);
  const servers = useApi(() => api.admin.servers(), []);
  const tx = useApi(() => api.admin.transactions(), []);
  const tickets = useApi(() => api.admin.tickets(), []);
  const open = tickets.data?.filter((t) => t.status === "open").length ?? 0;

  const groups: NavGroup[] = [
    {
      label: "Admin Console",
      items: [
        { label: "Overview", href: "/admin", icon: <LayoutDashboard />, exact: true },
        { label: "Customers", href: "/admin/customers", icon: <Users /> },
        { label: "Servers & Infrastructure", href: "/admin/servers", icon: <Server /> },
        { label: "Plans & Pricing", href: "/admin/plans", icon: <Tag /> },
        { label: "Billing", href: "/admin/billing", icon: <CreditCard /> },
        { label: "Support Tickets", href: "/admin/support", icon: <LifeBuoy />, badge: open || undefined },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Security & Logs", href: "/admin/security-logs", icon: <ShieldCheck /> },
        { label: "Settings", href: "/admin/settings", icon: <Settings /> },
      ],
    },
  ];

  const searchItems = (): SearchItem[] => [
    ...groups.flatMap((g) => g.items.map((it) => ({ id: `pg-${it.href}`, title: it.label, group: "Pages", href: it.href, icon: it.icon }))),
    ...(customers.data ?? []).map((c) => ({ id: `c-${c.id}`, title: c.name, subtitle: `${c.email} · ${c.status}`, group: "Customers", href: `/admin/customers?q=${encodeURIComponent(c.email)}`, icon: <Users /> })),
    ...(servers.data ?? []).map((s) => ({ id: `s-${s.id}`, title: s.name, subtitle: `${s.id} · ${s.ip} · ${s.customer}`, group: "Servers", href: `/admin/servers?q=${encodeURIComponent(s.name)}`, keywords: s.ip, icon: <Server /> })),
    ...(tx.data ?? []).map((t) => ({ id: `t-${t.id}`, title: t.id, subtitle: `${t.customer} · ${money(t.amount)} · ${t.status}`, group: "Transactions", href: `/admin/billing?q=${encodeURIComponent(t.id)}`, icon: <FileText /> })),
    ...(tickets.data ?? []).map((t) => ({ id: `k-${t.id}`, title: `${t.id} ${t.subject}`, subtitle: `${t.customerName} · ${t.status.replace("_", " ")}`, group: "Support tickets", href: "/admin/support", icon: <LifeBuoy /> })),
  ];

  const notices: Notice[] = [
    { id: "a1", title: "Critical security event", body: "Multiple failed login attempts from 192.168.1.84.", time: "10:42", href: "/admin/security-logs", unread: true },
    { id: "a2", title: "High CPU on database-primary", body: "NS-2050 is using 91% CPU in Frankfurt.", time: "09:58", href: "/admin/servers", unread: true },
    { id: "a3", title: "Failed payment", body: "INV-2026-1045 for Noah Williams failed.", time: "Yesterday", href: "/admin/billing", unread: true },
  ];

  return (
    <PanelShell
      groups={groups}
      homeHref="/admin"
      consoleLabel="Admin Console"
      searchItems={searchItems}
      searchPlaceholder="Search customers, servers…"
      notices={notices}
      sidebarBottom={({ requestSignOut }) => (
        <div className="flex items-end justify-between gap-2 px-2 py-1">
          <div>
            <p className="text-[13px] font-semibold text-white">Northstar Cloud</p>
            <p className="text-[11px] text-slate-500">Admin access · v1.0</p>
          </div>
          <button type="button" onClick={requestSignOut} className="grid size-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-white" aria-label="Sign out">
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    >
      {children}
    </PanelShell>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <RequireRole role="admin">
      <AdminChrome>{children}</AdminChrome>
    </RequireRole>
  );
}
