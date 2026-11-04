"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, ArrowUpRight, Download, Play, Plus, RefreshCw, RotateCw, Search, Square } from "lucide-react";
import type { AdminServer } from "@/types";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useCatalog } from "@/hooks/useCatalog";
import { useQueryParam } from "@/hooks/useQueryParam";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/cn";
import { number } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select } from "@/components/ui/Field";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Menu } from "@/components/ui/Menu";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { ProgressBar } from "@/components/charts/Charts";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

function Usage({ v }: { v: number }) {
  return <span className={cn("font-semibold tabular-nums", v >= 85 ? "text-red-600" : v >= 70 ? "text-amber-600" : "text-slate-700")}>{v}%</span>;
}

export function AdminServers() {
  const toast = useToast();
  const servers = useApi(() => api.admin.servers(), []);
  const customers = useApi(() => api.admin.customers(), [], { live: false });
  const { catalog, plan } = useCatalog();
  const initialQ = useQueryParam("q");
  const provisionParam = useQueryParam("provision");
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<{ s: AdminServer; a: "start" | "stop" | "restart" } | null>(null);
  const [acting, setActing] = useState(false);
  const [provOpen, setProvOpen] = useState(false);
  const [prov, setProv] = useState({ name: "", customer: "", region: "nyc", planId: "professional", source: "OWN_INFRASTRUCTURE" });
  const [provErr, setProvErr] = useState<{ name?: string; customer?: string }>({});
  const [provState, setProvState] = useState<"idle" | "sending" | "pending">("idle");

  useEffect(() => { if (initialQ) setQ(initialQ); }, [initialQ]);
  useEffect(() => { if (provisionParam) setProvOpen(true); }, [provisionParam]);

  const list = servers.data ?? [];
  const regions = Array.from(new Set(list.map((s) => s.regionName)));
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((s) => (!t || `${s.name} ${s.id} ${s.ip} ${s.customer}`.toLowerCase().includes(t)) && (region === "all" || s.regionName === region) && (status === "all" || s.status === status));
  }, [list, q, region, status]);
  const paged = usePaged(filtered, page, 5);

  const runAction = async () => {
    if (!action) return;
    setActing(true);
    const res = await api.admin.serverAction(action.s.id, action.a);
    setActing(false);
    setAction(null);
    toast({ tone: "pending", title: "Request sent", message: res.message });
  };

  const provision = async () => {
    const e: typeof provErr = {};
    if (!/^[a-z0-9][a-z0-9-]{2,40}$/.test(prov.name)) e.name = "Use lowercase letters, numbers and dashes.";
    if (!prov.customer) e.customer = "Choose the customer who owns this server.";
    setProvErr(e);
    if (Object.keys(e).length) return;
    setProvState("sending");
    await new Promise((r) => setTimeout(r, 900));
    setProvState("pending");
  };

  return (
    <div>
      <PageHeader title="Servers & Infrastructure" subtitle="Monitor server health, resource usage, and global infrastructure." actions={<Button icon={<Plus />} onClick={() => { setProv({ name: "", customer: "", region: "nyc", planId: "professional", source: "OWN_INFRASTRUCTURE" }); setProvErr({}); setProvState("idle"); setProvOpen(true); }}>Provision Server</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {servers.loading ? <StatSkeleton /> : (
          <>
            <StatCard label="Total Servers" value={number(8520)} sub="Across all regions" subTone="success" />
            <StatCard label="Running" value={number(8492)} sub="99.7% operational" subTone="success" />
            <StatCard label="Stopped" value={18} sub="Manually stopped" />
            <StatCard label="Needs Attention" value={10} sub="Review required" subTone="warning" />
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-72"><Input leading={<Search />} placeholder="Search server name or ID" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search servers" /></div>
        <div className="grid grid-cols-2 gap-3 md:flex">
          <div className="md:w-40"><Select value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }} aria-label="Region"><option value="all">All regions</option>{regions.map((r) => <option key={r}>{r}</option>)}</Select></div>
          <div className="md:w-40"><Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status"><option value="all">All statuses</option><option value="running">Running</option><option value="warning">Warning</option><option value="stopped">Stopped</option></Select></div>
        </div>
        <Button variant="secondary" className="md:ml-auto" icon={<Download />} onClick={() => downloadCsv("servers.csv", ["ID", "Server", "IP", "Customer", "Region", "Plan", "CPU %", "RAM %", "Status", "Source"], filtered.map((s) => [s.id, s.name, s.ip, s.customer, s.regionName, plan(s.planId)?.name ?? s.planId, s.cpu, s.ram, s.status, s.source]))}>Export</Button>
      </div>

      <Card className="mt-4">
        <CardHeader title="All Servers" subtitle="Manage server instances across your cloud infrastructure." action={<Button variant="secondary" size="sm" icon={<RefreshCw className={servers.refreshing ? "animate-spin" : undefined} />} onClick={() => { void servers.reload(); toast({ tone: "info", title: "Status refreshed" }); }}>Refresh Status</Button>} />
        <div className="mt-4">
          {servers.loading ? <RowsSkeleton rows={5} cols={8} /> : filtered.length === 0 ? <EmptyState title="No servers match" message="Try another name, region or status." /> : (
            <>
              <Table label="All servers" minWidth={1000}>
                <THead><Th>Server</Th><Th>Customer</Th><Th>Region</Th><Th>Plan</Th><Th>Source</Th><Th>CPU</Th><Th>RAM</Th><Th>Status</Th><Th className="text-right">Action</Th></THead>
                <tbody>
                  {paged.slice.map((s) => (
                    <Tr key={s.id}>
                      <Td><p className="font-semibold text-slate-900">{s.name}</p><p className="font-mono text-[11px] text-slate-400">{s.id} · {s.ip}</p></Td>
                      <Td>{s.customer}</Td>
                      <Td><span className="inline-flex items-center gap-2"><span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">{s.regionCode}</span>{s.regionName}</span></Td>
                      <Td>{plan(s.planId)?.name}</Td>
                      <Td>{s.source === "OWN_INFRASTRUCTURE" ? <Badge tone="brand">Own</Badge> : <Badge tone="purple">Third-party</Badge>}</Td>
                      <Td><Usage v={s.cpu} /></Td>
                      <Td><Usage v={s.ram} /></Td>
                      <Td><StatusBadge status={s.status} dot /></Td>
                      <Td className="text-right">
                        <Menu label={`Manage ${s.name}`} trigger={({ toggle, open }) => <Button variant="secondary" size="xs" iconRight={<ArrowUpRight />} onClick={toggle} aria-expanded={open} disabled={s.status === "restarting"}>Manage</Button>} items={[
                          { label: "Restart", icon: <RotateCw />, disabled: s.status === "stopped", onSelect: () => setAction({ s, a: "restart" }) },
                          s.status === "stopped" ? { label: "Start", icon: <Play />, onSelect: () => setAction({ s, a: "start" }) } : { label: "Stop", icon: <Square />, danger: true, onSelect: () => setAction({ s, a: "stop" }) },
                        ]} />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${filtered.length} servers in this demo`} />
            </>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Regional Infrastructure" subtitle="Server distribution and resource utilization." />
          <div className="space-y-5 p-5 text-[13px]">
            {[
              { r: "North America", n: 3920, util: 72, up: "99.98%", color: "bg-brand-600" },
              { r: "Europe", n: 2760, util: 61, up: "99.95%", color: "bg-emerald-500" },
              { r: "Asia Pacific", n: 1840, util: 82, up: "99.91%", color: "bg-amber-500" },
            ].map((x) => (
              <div key={x.r}>
                <div className="mb-1.5 flex justify-between"><span className="font-semibold text-slate-800">{x.r}</span><span className="text-slate-600">{number(x.n)} servers</span></div>
                <ProgressBar value={x.util} color={x.color} label={`${x.r} utilization`} />
                <p className="mt-1 text-[11px] text-slate-500">{x.util}% resource utilization · {x.up} uptime</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand-600" /> Standard usage</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500" /> High utilization</span>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Infrastructure Alerts" subtitle="Issues requiring attention and review." />
          <div className="space-y-3 p-5">
            {[["High CPU utilization", "database-primary is using 91% CPU. Review resource allocation and server performance."], ["Regional capacity", "Asia Pacific has reached 82% resource utilization. Consider reviewing available capacity."]].map(([t, b]) => (
              <div key={t} className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800"><p className="flex items-center gap-1.5 font-semibold"><AlertTriangle className="size-3.5" /> {t}</p><p className="mt-1">{b}</p></div>
            ))}
            <button type="button" onClick={() => { setStatus("warning"); setPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">View all infrastructure alerts <ArrowRight className="size-3.5" /></button>
          </div>
        </Card>
      </div>

      <ConfirmModal open={!!action} onClose={() => setAction(null)} loading={acting} tone={action?.a === "stop" ? "danger" : "primary"}
        title={`${action ? action.a[0]!.toUpperCase() + action.a.slice(1) : ""} ${action?.s.name}?`}
        confirmLabel={action?.a === "stop" ? "Stop server" : action?.a === "start" ? "Start server" : "Restart server"}
        message={<>This affects <b className="text-slate-900">{action?.s.customer}</b>&apos;s workload. The status shows as pending until the infrastructure confirms the change.</>}
        onConfirm={runAction} />

      <Modal open={provOpen} onClose={() => setProvOpen(false)} title="Provision a server" description="Create a server for a customer on own infrastructure or a provider." footer={provState === "pending" ? <Button onClick={() => setProvOpen(false)}>Done</Button> : <><Button variant="secondary" onClick={() => setProvOpen(false)}>Cancel</Button><Button onClick={provision} loading={provState === "sending"} loadingText="Submitting…">Provision</Button></>}>
        {provState === "pending" ? <FormAlert tone="pending" title="Provisioning requested">{prov.name} was queued. It appears in the list after the {prov.source === "OWN_INFRASTRUCTURE" ? "cluster" : "provider"} confirms the virtual machine (backend required).</FormAlert> : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Server name" htmlFor="pv-name" error={provErr.name}><Input id="pv-name" value={prov.name} invalid={!!provErr.name} onChange={(e) => setProv({ ...prov, name: e.target.value.toLowerCase() })} placeholder="e.g. client-web-01" /></Field>
            <Field label="Customer" htmlFor="pv-cust" error={provErr.customer}><Select id="pv-cust" value={prov.customer} invalid={!!provErr.customer} onChange={(e) => setProv({ ...prov, customer: e.target.value })}><option value="">Choose a customer</option>{customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
            <Field label="Region" htmlFor="pv-region"><Select id="pv-region" value={prov.region} onChange={(e) => setProv({ ...prov, region: e.target.value })}>{catalog?.regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
            <Field label="Plan" htmlFor="pv-plan"><Select id="pv-plan" value={prov.planId} onChange={(e) => setProv({ ...prov, planId: e.target.value })}>{catalog?.plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
            <Field label="Service source" htmlFor="pv-src" className="sm:col-span-2"><Select id="pv-src" value={prov.source} onChange={(e) => setProv({ ...prov, source: e.target.value })}><option value="OWN_INFRASTRUCTURE">Own infrastructure (Proxmox / OpenStack cluster)</option><option value="THIRD_PARTY_PROVIDER">Third-party provider (via provider API)</option></Select></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
