"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, DollarSign, Download, Flag, KeyRound, Printer, RotateCw, Search, Server, User } from "lucide-react";
import type { ActivityEvent } from "@/types";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { number, shortDate, time } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/panel/PageHeader";

const icons: Record<ActivityEvent["icon"], { el: React.ReactNode; cls: string }> = {
  server: { el: <Server />, cls: "bg-brand-50 text-brand-600" },
  key: { el: <KeyRound />, cls: "bg-violet-50 text-violet-600" },
  dollar: { el: <DollarSign />, cls: "bg-emerald-50 text-emerald-600" },
  restart: { el: <RotateCw />, cls: "bg-orange-50 text-orange-600" },
  flag: { el: <Flag />, cls: "bg-brand-50 text-brand-700" },
  login: { el: <ArrowUpRight />, cls: "bg-violet-50 text-violet-600" },
  user: { el: <User />, cls: "bg-slate-100 text-slate-600" },
};

/** Demo totals include older events that are not loaded in the table. */
const HISTORIC_EVENTS = 234;

function exportCsv(rows: ActivityEvent[]) {
  const head = ["Activity", "Target", "Category", "Date", "Time (UTC)", "IP address", "Status"];
  const body = rows.map((r) => [r.title, r.target, r.category, shortDate(r.at), time(r.at), r.ip, r.status]);
  const csv = [head, ...body].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "northstar-activity.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function ActivityLog() {
  const activity = useApi(() => api.customer.activity(), []);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [days, setDays] = useState("30");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<ActivityEvent | null>(null);

  const all = activity.data ?? [];
  // Demo data is anchored at the end of October 2026; real data would use "now".
  const anchor = Math.max(Date.UTC(2026, 9, 30), ...all.map((a) => new Date(a.at).getTime()));

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return all.filter(
      (a) =>
        (!t || `${a.title} ${a.target} ${a.ip}`.toLowerCase().includes(t)) &&
        (category === "all" || a.category === category) &&
        (status === "all" || a.status === status) &&
        (days === "all" || anchor - new Date(a.at).getTime() <= Number(days) * 86400000),
    );
  }, [all, q, category, status, days, anchor]);
  const paged = usePaged(filtered, page, 6);

  const total = all.length + HISTORIC_EVENTS;
  const success = all.filter((a) => a.status === "success").length + 219;
  const security = all.filter((a) => a.category === "Security" && Date.UTC(2026, 9, 1) <= new Date(a.at).getTime()).length;

  const byDay = useMemo(() => {
    const groups: { day: string; items: ActivityEvent[] }[] = [];
    filtered.slice(0, 6).forEach((a) => {
      const d = shortDate(a.at);
      const g = groups.find((x) => x.day === d);
      if (g) g.items.push(a);
      else groups.push({ day: d, items: [a] });
    });
    return groups;
  }, [filtered]);

  const reset = () => {
    setQ("");
    setCategory("all");
    setStatus("all");
    setDays("30");
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Workspace" }, { label: "Account" }, { label: "Activity Log" }]}
        title="Activity Log"
        subtitle="Track account changes, server events, and security activity."
        actions={
          <>
            <Button variant="secondary" icon={<Printer />} onClick={() => window.print()}>Print</Button>
            <Button variant="secondary" icon={<Download />} onClick={() => exportCsv(filtered)}>Export Activity</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {activity.loading ? <StatSkeleton count={3} /> : (
          <>
            <StatCard label="Total Events" value={number(total)} sub="Recorded account activities" />
            <StatCard label="Successful Actions" value={number(success)} sub={<span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500" /> {((success / total) * 100).toFixed(1)}% completed successfully</span>} subTone="success" />
            <StatCard label="Security Events" value={String(security).padStart(2, "0")} sub="Security-related events this month" />
          </>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader
          title="All Activity"
          subtitle="A record of recent actions on your account."
          action={
            <div className="w-36">
              <Select value={days} onChange={(e) => { setDays(e.target.value); setPage(1); }} aria-label="Date range" className="h-8 text-xs">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="all">All time</option>
              </Select>
            </div>
          }
        />
        <div className="no-print flex flex-col gap-3 px-5 pt-4 md:flex-row">
          <div className="flex-1"><Input leading={<Search />} placeholder="Search activity…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search activity" /></div>
          <div className="grid grid-cols-2 gap-3 md:flex">
            <div className="md:w-40">
              <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Category">
                <option value="all">All categories</option>
                <option>Server</option><option>Security</option><option>Billing</option><option>Account</option>
              </Select>
            </div>
            <div className="md:w-36">
              <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status">
                <option value="all">All statuses</option>
                <option value="success">Success</option><option value="review">Review</option><option value="failed">Failed</option>
              </Select>
            </div>
          </div>
          <Button variant="secondary" onClick={reset}>Reset Filters</Button>
        </div>
        <div className="mt-4">
          {activity.loading ? <RowsSkeleton rows={6} cols={6} /> : filtered.length === 0 ? (
            <EmptyState title="No activity matches these filters" message="Try a longer date range or reset the filters." action={<Button size="sm" variant="secondary" onClick={reset}>Reset Filters</Button>} />
          ) : (
            <>
              <Table label="Account activity" minWidth={860}>
                <THead>
                  <Th>Activity</Th><Th>Category</Th><Th>Date &amp; time</Th><Th>IP address</Th><Th>Status</Th><Th>Details</Th>
                </THead>
                <tbody>
                  {paged.slice.map((a) => (
                    <Tr key={a.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4", icons[a.icon].cls)}>{icons[a.icon].el}</span>
                          <div><p className="font-semibold text-slate-900">{a.title}</p><p className="text-[11px] text-slate-400">{a.target}</p></div>
                        </div>
                      </Td>
                      <Td>{a.category}</Td>
                      <Td><p className="text-slate-800">{shortDate(a.at)}</p><p className="text-[11px] text-slate-400">{time(a.at)} UTC</p></Td>
                      <Td className="font-mono text-xs">{a.ip}</Td>
                      <Td><StatusBadge status={a.status} /></Td>
                      <Td><button type="button" onClick={() => setDetail(a)} className="text-[13px] font-semibold text-brand-600 hover:underline">View →</button></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination variant="text" page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${paged.total} events`} />
            </>
          )}
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Recent Timeline" subtitle="A quick chronological overview of your recent actions." />
        <div className="px-5 pb-5 pt-2">
          {byDay.map((g) => (
            <div key={g.day} className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.day}</p>
              <ul className="mt-2 space-y-3 border-l border-line pl-4">
                {g.items.map((a) => (
                  <li key={a.id} className="relative flex items-start justify-between gap-3">
                    <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-white bg-brand-500" />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.target}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{time(a.at)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title ?? ""} description="Activity details" size="sm" footer={<Button onClick={() => setDetail(null)}>Close</Button>}>
        {detail ? (
          <dl className="divide-y divide-line text-[13px]">
            {[["Target", detail.target], ["Category", detail.category], ["Date", `${shortDate(detail.at)} · ${time(detail.at)} UTC`], ["IP address", detail.ip], ["Event ID", detail.id]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2.5"><dt className="text-slate-500">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
            ))}
            <div className="flex justify-between gap-3 py-2.5"><dt className="text-slate-500">Status</dt><dd><StatusBadge status={detail.status} /></dd></div>
            {detail.status === "review" ? <p className="flex gap-2 pt-3 text-xs text-amber-700"><CheckCircle2 className="size-4 shrink-0" />If this wasn&apos;t you, change your password in Account Settings.</p> : null}
          </dl>
        ) : null}
      </Modal>
      <p className="mt-6 text-center text-xs text-slate-400">Northstar Cloud · Account Activity</p>
    </div>
  );
}
