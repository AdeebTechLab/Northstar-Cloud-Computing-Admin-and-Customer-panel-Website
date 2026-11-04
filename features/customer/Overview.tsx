"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeftRight, ArrowUpRight, CheckCircle2, DollarSign, KeyRound, Plus, RotateCw, Server, Wallet, Rocket } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { planSpec, useCatalog } from "@/hooks/useCatalog";
import { useAuth } from "@/lib/auth/AuthProvider";
import { dateTimeShort, greeting, money, shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { BlockSkeleton, RowsSkeleton, Skeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { Select } from "@/components/ui/Field";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Donut, ProgressBar, TrendChart } from "@/components/charts/Charts";
import { PageHeader, UpdatedAt } from "@/components/panel/PageHeader";
import { CopyButton } from "@/components/ui/CopyButton";

const activityIcon = { server: <Rocket />, key: <KeyRound />, dollar: <DollarSign />, restart: <RotateCw />, flag: <AlertTriangle />, login: <ArrowUpRight />, user: <CheckCircle2 /> };

export function CustomerOverview() {
  const { user } = useAuth();
  const { region, plan } = useCatalog();
  const dash = useApi(() => api.customer.dashboard(), []);
  const servers = useApi(() => api.customer.servers(), []);
  const billing = useApi(() => api.customer.billingSummary(), []);
  const activity = useApi(() => api.customer.activity(), []);
  const invoices = useApi(() => api.customer.invoices(), []);
  const [range, setRange] = useState("30");

  const running = servers.data?.filter((s) => s.status === "running") ?? [];
  const newRecently = servers.data?.filter((s) => Date.now() - new Date(s.createdAt).getTime() < 30 * 86400000).length ?? 0;
  const warning = running.filter((s) => s.health === "warning").length;
  const provisioning = servers.data?.filter((s) => s.status === "provisioning").length ?? 0;

  const chart = useMemo(() => {
    const u = dash.data?.utilization;
    if (!u) return null;
    if (range === "7") return { cpu: u.cpu.slice(-8), memory: u.memory.slice(-8), labels: ["Oct 20", "Oct 22", "Oct 24", "Oct 26", "Oct 28", "Oct 30"] };
    if (range === "90") return { cpu: [28, 30, 27, 33, 31, 36, ...u.cpu.filter((_, i) => i % 2 === 0)], memory: [18, 19, 21, 20, 24, 23, ...u.memory.filter((_, i) => i % 2 === 0)], labels: ["Aug 01", "Aug 19", "Sep 06", "Sep 24", "Oct 12", "Oct 30"] };
    return { cpu: u.cpu, memory: u.memory, labels: u.labels };
  }, [dash.data, range]);

  const hoverLabels = useMemo(() => {
    if (!chart) return undefined;
    const start = range === "7" ? Date.UTC(2026, 9, 23) : range === "90" ? Date.UTC(2026, 7, 1) : Date.UTC(2026, 9, 1);
    const step = range === "7" ? 1 : range === "90" ? 7 : 2;
    return chart.cpu.map((_, i) => new Date(start + i * step * 86400000).toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" }));
  }, [chart, range]);

  return (
    <div>
      <PageHeader
        eyebrow="Northstar Cloud / Workspace"
        title={
          <>
            {greeting()}, {user?.name.split(" ")[0]} <span aria-hidden="true">👋</span>
          </>
        }
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3">
            Here&apos;s what&apos;s happening across your cloud infrastructure today.
            <UpdatedAt at={servers.updatedAt} onRefresh={() => void Promise.all([servers.reload(), dash.reload(), billing.reload()])} refreshing={servers.refreshing} />
          </span>
        }
        actions={
          <>
            <ButtonLink href="/dashboard/services" variant="secondary" iconRight={<ArrowUpRight />}>
              View servers
            </ButtonLink>
            <ButtonLink href="/dashboard/servers/new" icon={<Plus />}>
              Deploy new server
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {servers.loading || billing.loading || dash.loading ? (
          <StatSkeleton />
        ) : (
          <>
            <StatCard label="Active servers" value={running.length} icon={<Server />} sub={<><span className="text-emerald-600">+{newRecently}</span> <span className="font-normal text-slate-500">in the last 30 days</span></>} subTone="success" />
            <StatCard label="Monthly spending" value={money(billing.data?.currentMonthSpend ?? 0)} icon={<DollarSign />} sub={<><span>{billing.data?.spendChangePct}%</span> <span className="font-normal text-slate-500">vs last month</span></>} subTone="success" />
            <StatCard label="Bandwidth used" value={`${dash.data?.bandwidthTb} TB`} icon={<ArrowLeftRight />} sub={<><span>{dash.data?.bandwidthPct}%</span> <span className="font-normal text-slate-500">of included traffic</span></>} subTone="success" />
            <StatCard label="Account balance" value={money(billing.data?.balance ?? 0)} icon={<Wallet />} sub="Available credit" subTone="success" />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.75fr_1fr]">
        {dash.loading || !chart ? (
          <BlockSkeleton />
        ) : dash.error ? (
          <Card>
            <ErrorState onRetry={dash.reload} />
          </Card>
        ) : (
          <Card>
            <CardHeader
              title="Resource utilization"
              subtitle="CPU and memory usage across active instances"
              action={
                <div className="w-36">
                  <Select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Time range" className="h-8 text-xs">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </Select>
                </div>
              }
            />
            <div className="px-5 pb-4 pt-5">
              <TrendChart
                key={range}
                xLabels={chart.labels}
                hoverLabels={hoverLabels}
                series={[
                  { name: "CPU utilization", values: chart.cpu, color: "#2563eb", fill: true },
                  { name: "Memory utilization", values: chart.memory, color: "#93b6fd", fill: true },
                ]}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand-600" /> CPU utilization</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand-300" /> Memory utilization</span>
                </div>
                <span>Illustrative sample data</span>
              </div>
            </div>
          </Card>
        )}

        {dash.loading || !dash.data ? (
          <BlockSkeleton />
        ) : (
          <Card>
            <CardHeader title="Storage capacity" subtitle="Total allocated storage" />
            <div className="px-5 pb-5 pt-5">
              <div className="flex items-center gap-5">
                <Donut value={Math.round((dash.data.storage.usedTb / dash.data.storage.allocatedTb) * 100)}>
                  <span>
                    <span className="block text-lg font-bold text-slate-900">{Math.round((dash.data.storage.usedTb / dash.data.storage.allocatedTb) * 100)}%</span>
                    <span className="block text-[10px] text-slate-500">used</span>
                  </span>
                </Donut>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{dash.data.storage.usedTb} TB</p>
                  <p className="text-[13px] text-slate-500">of {dash.data.storage.allocatedTb.toFixed(1)} TB allocated</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" /> Within capacity</p>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-[13px]">
                <div>
                  <div className="mb-1.5 flex justify-between"><span className="text-slate-600">Block storage</span><span className="font-semibold text-slate-900">{dash.data.storage.blockGb} GB / 1 TB</span></div>
                  <ProgressBar value={(dash.data.storage.blockGb / 1000) * 100} label="Block storage used" />
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between"><span className="text-slate-600">Instance storage</span><span className="font-semibold text-slate-900">{dash.data.storage.instanceGb} GB / 1 TB</span></div>
                  <ProgressBar value={(dash.data.storage.instanceGb / 1000) * 100} color="bg-emerald-500" label="Instance storage used" />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Recent activity" subtitle="Latest changes in your workspace" action={<Link href="/dashboard/activity" className="text-xs font-semibold text-brand-600 hover:underline">View all</Link>} />
          <div className="px-5 pb-3 pt-3">
            {activity.loading ? (
              <div className="space-y-4 py-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-9" />)}</div>
            ) : (
              <ul className="divide-y divide-line">
                {activity.data?.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 [&_svg]:size-4">{activityIcon[a.icon]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-900">{a.title}</p>
                      <p className="truncate text-xs text-slate-500">{a.target}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{dateTimeShort(a.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent payments" subtitle="Your latest transactions" action={<Link href="/dashboard/billing" className="text-xs font-semibold text-brand-600 hover:underline">All payments</Link>} />
          <div className="px-5 pb-3 pt-3">
            {invoices.loading ? (
              <div className="space-y-4 py-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-9" />)}</div>
            ) : (
              <ul className="divide-y divide-line">
                {invoices.data?.filter((i) => i.status === "paid").slice(0, 3).map((i) => (
                  <li key={i.id} className="flex items-center gap-3 py-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><DollarSign className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-slate-900">{i.id}</p>
                      <p className="text-xs text-slate-500">{shortDate(i.issuedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-slate-900">{money(i.amount)}</p>
                      <StatusBadge status={i.status} dot className="mt-1" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Server health" subtitle="Live service overview" action={<Link href="/dashboard/services" className="text-xs font-semibold text-brand-600 hover:underline">Details</Link>} />
          <div className="px-5 pb-5 pt-3">
            {servers.loading ? (
              <div className="space-y-4 py-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-6" />)}</div>
            ) : (
              <>
                <dl className="divide-y divide-line text-[13px]">
                  <div className="flex justify-between py-3"><dt className="text-slate-600">Healthy servers</dt><dd className="font-semibold text-emerald-600">{running.length - warning} / {running.length}</dd></div>
                  <div className="flex justify-between py-3"><dt className="text-slate-600">Needs attention</dt><dd className="font-semibold text-amber-600">{warning} warning</dd></div>
                  <div className="flex justify-between py-3"><dt className="text-slate-600">Provisioning</dt><dd className="font-semibold text-slate-900">{provisioning} pending</dd></div>
                </dl>
                {provisioning > 0 ? (
                  <div className="mt-3 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <div><p className="font-semibold">Capacity notice</p><p className="mt-0.5">{provisioning === 1 ? "One instance is" : `${provisioning} instances are`} waiting for available capacity.</p></div>
                  </div>
                ) : warning > 0 ? (
                  <div className="mt-3 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <div><p className="font-semibold">Performance notice</p><p className="mt-0.5">{warning} running {warning === 1 ? "server has" : "servers have"} high CPU usage. Consider resizing.</p></div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Your Servers" subtitle="Most recent servers in this workspace" action={<Link href="/dashboard/services" className="text-xs font-semibold text-brand-600 hover:underline">View all servers</Link>} />
        <div className="mt-4">
          {servers.loading ? (
            <RowsSkeleton rows={3} />
          ) : (
            <Table label="Your servers" minWidth={680}>
              <THead>
                <Th>Server name</Th>
                <Th>Region</Th>
                <Th>IP address</Th>
                <Th>Plan</Th>
                <Th>Status</Th>
              </THead>
              <tbody>
                {servers.data?.slice(0, 5).map((s) => (
                  <Tr key={s.id}>
                    <Td>
                      <Link href={`/dashboard/servers/${s.id}`} className="font-semibold text-slate-900 hover:text-brand-600">
                        {s.name}
                      </Link>
                    </Td>
                    <Td>{region(s.regionId)?.name}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1 font-mono text-xs">
                        {s.ipAddresses[0]} <CopyButton value={s.ipAddresses[0] ?? ""} label="Copy IP address" />
                      </span>
                    </Td>
                    <Td>{planSpec(plan(s.planId))}</Td>
                    <Td><StatusBadge status={s.status} /></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
