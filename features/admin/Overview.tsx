"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowRight, DollarSign, Plus, Server, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useCatalog } from "@/hooks/useCatalog";
import { money0, number, shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { BlockSkeleton, RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { BarChart, ProgressBar } from "@/components/charts/Charts";
import { PageHeader, UpdatedAt } from "@/components/panel/PageHeader";

export function AdminOverview() {
  const overview = useApi(() => api.admin.overview(), []);
  const customers = useApi(() => api.admin.customers(), []);
  const { plan } = useCatalog();
  const [months, setMonths] = useState("7");
  const o = overview.data;
  const revenue = o ? o.revenue.slice(-Number(months)) : [];

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        subtitle={<span className="flex flex-wrap items-center gap-x-3">Monitor your platform, customers, and infrastructure.<UpdatedAt at={overview.updatedAt} onRefresh={overview.reload} refreshing={overview.refreshing} /></span>}
        actions={<ButtonLink href="/admin/servers?provision=1" icon={<Plus />}>Add New Server</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!o ? <StatSkeleton /> : (
          <>
            <StatCard label="Total Customers" value={number(o.kpis.customers)} sub={`↑ ${o.kpis.customersChange}% vs. last month`} subTone="success" />
            <StatCard label="Active Servers" value={number(o.kpis.activeServers)} sub={`↑ ${o.kpis.serversChange}% vs. last month`} subTone="success" />
            <StatCard label="Monthly Revenue" value={money0(o.kpis.monthlyRevenue)} sub={`↑ ${o.kpis.revenueChange}% vs. last month`} subTone="success" />
            <StatCard label="Open Tickets" value={o.kpis.openTickets} sub={`${o.kpis.ticketsNeedingAttention} require attention`} subTone="warning" />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {!o ? <BlockSkeleton /> : (
          <Card>
            <CardHeader title="Revenue Overview" subtitle="Monthly platform revenue" action={
              <div className="w-36"><Select value={months} onChange={(e) => setMonths(e.target.value)} className="h-8 text-xs" aria-label="Revenue range"><option value="7">Last 7 months</option><option value="5">Last 5 months</option><option value="3">Last 3 months</option></Select></div>
            } />
            <div className="px-5 pb-5 pt-6">
              <BarChart key={months} data={revenue} format={(v) => money0(v)} height={170} />
              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500"><span className="size-2 rounded-sm bg-brand-600" /> Total revenue (USD)</p>
            </div>
          </Card>
        )}
        {!o ? <BlockSkeleton /> : (
          <Card>
            <CardHeader title="Infrastructure Status" subtitle="Live overview across all regions" />
            <div className="space-y-5 px-5 pb-5 pt-5 text-[13px]">
              {o.infrastructure.map((r) => (
                <div key={r.region}>
                  <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><span className="size-2 rounded-full bg-emerald-500 animate-pulse-dot" />{r.region}</span><span className="font-semibold text-slate-900">{r.uptime}%</span></div>
                  <ProgressBar value={r.uptime} label={`${r.region} uptime`} />
                </div>
              ))}
              <div className="flex justify-between border-t border-line pt-4"><span className="text-slate-500">Operational servers</span><span className="font-semibold text-slate-900">{number(o.operational.running)} / {number(o.operational.total)}</span></div>
            </div>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Recent Customer Signups" subtitle="Latest accounts registered on the platform" action={<Link href="/admin/customers" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">View all customers <ArrowRight className="size-3.5" /></Link>} />
        <div className="mt-4">
          {customers.loading ? <RowsSkeleton rows={4} /> : (
            <Table label="Recent signups" minWidth={720}>
              <THead><Th>Customer</Th><Th>Email</Th><Th>Plan</Th><Th>Joined</Th><Th>Status</Th></THead>
              <tbody>
                {customers.data?.filter((c) => c.id !== "c7").slice(0, 4).map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-semibold text-slate-900">{c.name}</Td>
                    <Td>{c.email}</Td>
                    <Td>{plan(c.planId)?.name}</Td>
                    <Td>{shortDate(c.joinedAt)}</Td>
                    <Td><StatusBadge status={c.status} /></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent System Activity" subtitle="Latest changes across the platform" />
          <ul className="divide-y divide-line px-5 pb-3 pt-2">
            {[
              { icon: <UserPlus />, title: "New customer registered", body: "Olivia Martin created a new account.", time: "3 minutes ago" },
              { icon: <Server />, title: "Server provisioned", body: "Server NS-2048 is now running.", time: "18 minutes ago" },
              { icon: <DollarSign />, title: "Payment received", body: "$248.00 payment processed successfully.", time: "32 minutes ago" },
            ].map((a) => (
              <li key={a.title} className="flex gap-3 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 [&_svg]:size-4">{a.icon}</span>
                <div><p className="text-[13px] font-semibold text-slate-900">{a.title}</p><p className="text-xs text-slate-600">{a.body}</p><p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="System Alerts" subtitle="Items that may need your attention." />
          <div className="space-y-3 p-5">
            {o?.alerts.map((a) => (
              <div key={a.title} className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
                <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle className="size-3.5" /> {a.title}</p>
                <p className="mt-1">{a.body}</p>
              </div>
            ))}
            <Link href="/admin/security-logs" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">Review all alerts <ArrowRight className="size-3.5" /></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
