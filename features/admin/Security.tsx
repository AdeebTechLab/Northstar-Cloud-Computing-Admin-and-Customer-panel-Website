"use client";

import { useMemo, useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";
import type { SecurityEvent } from "@/types";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/cn";
import { number, relativeTime, time } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { ProgressBar } from "@/components/charts/Charts";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const dot = { blue: "bg-brand-500", green: "bg-emerald-500", amber: "bg-amber-500", purple: "bg-violet-500" };

export function AdminSecurity() {
  const toast = useToast();
  const events = useApi(() => api.admin.securityEvents(), []);
  const audit = useApi(() => api.admin.audit(), []);
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<SecurityEvent | null>(null);
  const [allAudit, setAllAudit] = useState(false);

  const list = events.data ?? [];
  const categories = Array.from(new Set(list.map((e) => e.category)));
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((e) => (!t || `${e.title} ${e.actor} ${e.ip}`.toLowerCase().includes(t)) && (severity === "all" || e.severity === severity) && (category === "all" || e.category === category) && (status === "all" || e.status === status));
  }, [list, q, severity, category, status]);
  const paged = usePaged(filtered, page, 6);

  return (
    <div>
      <PageHeader title="Security & Logs" subtitle="Monitor security events, audit activity, and system access." actions={
        <>
          <Button variant="secondary" icon={<RefreshCw className={events.refreshing ? "animate-spin" : undefined} />} onClick={() => { void events.reload(); void audit.reload(); toast({ tone: "info", title: "Logs refreshed" }); }}>Refresh</Button>
          <Button icon={<Download />} onClick={() => downloadCsv("security-events.csv", ["Event", "Category", "Actor", "IP", "Time (UTC)", "Severity", "Status"], filtered.map((e) => [e.title, e.category, e.actor, e.ip, time(e.at), e.severity, e.status]))}>Export Logs</Button>
        </>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {events.loading ? <StatSkeleton /> : (
          <>
            <StatCard label="Security Events · 24h" value={number(1284)} sub="↓ 8.2% vs. previous day" subTone="success" />
            <StatCard label="Failed Login Attempts" value={23} sub="↑ 12% from yesterday" subTone="danger" />
            <StatCard label="Active Sessions" value={86} sub="Across all admin and customer accounts" />
            <StatCard label="Critical Alerts" value={<span className="text-red-600">{list.filter((e) => e.severity === "critical").length}</span>} sub="Requires review" subTone="warning" />
          </>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Security Event Log" subtitle="Review recent sign-ins, access changes, and security events." action={<Badge tone="brand" dot pulse>Live monitoring · Demo</Badge>} />
        <div className="flex flex-col gap-3 px-5 pt-4 lg:flex-row">
          <div className="flex-1"><Input leading={<Search />} placeholder="Search event, user, or IP address" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search events" /></div>
          <div className="grid grid-cols-3 gap-3 lg:flex">
            <div className="lg:w-36"><Select value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(1); }} aria-label="Severity"><option value="all">All severities</option><option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Info</option></Select></div>
            <div className="lg:w-40"><Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Category"><option value="all">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</Select></div>
            <div className="lg:w-36"><Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status"><option value="all">All statuses</option><option value="review">Review</option><option value="investigate">Investigate</option><option value="verified">Verified</option><option value="success">Success</option><option value="logged">Logged</option></Select></div>
          </div>
        </div>
        <div className="mt-4">
          {events.loading ? <RowsSkeleton rows={6} cols={7} /> : filtered.length === 0 ? <EmptyState title="No events match" message="Change the filters to see more events." /> : (
            <>
              <Table label="Security events" minWidth={960}>
                <THead><Th>Event</Th><Th>User / actor</Th><Th>IP address</Th><Th>Time</Th><Th>Severity</Th><Th>Status</Th><Th className="text-right">Action</Th></THead>
                <tbody>
                  {paged.slice.map((e) => (
                    <Tr key={e.id}>
                      <Td><p className="font-semibold text-slate-900">{e.title}</p><p className="text-[11px] text-slate-400">{e.category}</p></Td>
                      <Td>{e.actor}</Td>
                      <Td className="font-mono text-xs">{e.ip}</Td>
                      <Td>Today, {time(e.at)}</Td>
                      <Td><StatusBadge status={e.severity} /></Td>
                      <Td><StatusBadge status={e.status} /></Td>
                      <Td className="text-right"><Button variant="secondary" size="xs" onClick={() => setViewing(e)}>View</Button></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination variant="text" page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${filtered.length} events`} />
            </>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Event Breakdown" subtitle="Security events by category · Last 24 hours" />
          <div className="space-y-4 p-5 text-[13px]">
            {[["Authentication", 624, "bg-brand-600"], ["API Activity", 312, "bg-brand-500"], ["Infrastructure", 198, "bg-brand-400"], ["Permissions", 150, "bg-brand-300"]].map(([k, v, c]) => (
              <div key={k as string} className="grid grid-cols-[110px_1fr_40px] items-center gap-3">
                <span className="text-slate-600">{k}</span>
                <ProgressBar value={((v as number) / 700) * 100} color={c as string} label={k as string} />
                <span className="text-right font-semibold text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent Audit Activity" subtitle="Latest actions performed across the platform." action={<Button variant="secondary" size="sm" onClick={() => setAllAudit((v) => !v)}>{allAudit ? "Show less" : "View All"}</Button>} />
          <ul className="space-y-1 px-5 pb-4 pt-3">
            {(allAudit ? [...(audit.data ?? []), ...(audit.data ?? []).map((a) => ({ ...a, id: `${a.id}-old`, at: new Date(new Date(a.at).getTime() - 86400000).toISOString() }))] : audit.data ?? []).map((a) => (
              <li key={a.id} className="flex gap-3 py-2">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", dot[a.color])} />
                <div className="text-[13px]"><p className="text-slate-700"><b className="text-slate-900">{a.actor}</b> {a.action}</p><p className="text-[11px] text-slate-400">{relativeTime(a.at) === "Yesterday" ? "Yesterday" : `Today, ${time(a.at)}`} · {a.area}</p></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-4 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs text-slate-600"><b className="text-slate-900">Security note:</b> This page uses sample data. Real security monitoring, IP tracking, event filtering, export, and incident actions require backend integration.</p>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title ?? ""} description={viewing?.category} size="sm" footer={<Button onClick={() => setViewing(null)}>Close</Button>}>
        {viewing ? (
          <dl className="divide-y divide-line text-[13px]">
            {[["Actor", viewing.actor], ["IP address", viewing.ip], ["Time", `Today, ${time(viewing.at)} UTC`], ["Event ID", viewing.id]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2.5"><dt className="text-slate-500">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
            ))}
            <div className="flex justify-between gap-3 py-2.5"><dt className="text-slate-500">Severity</dt><dd><StatusBadge status={viewing.severity} /></dd></div>
            <div className="flex justify-between gap-3 py-2.5"><dt className="text-slate-500">Status</dt><dd><StatusBadge status={viewing.status} /></dd></div>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}
