"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Plus, Search, Server } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { planSpec, useCatalog } from "@/hooks/useCatalog";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { CopyButton } from "@/components/ui/CopyButton";
import { PageHeader } from "@/components/panel/PageHeader";
import { pad2 } from "@/lib/format";

export function MyServices() {
  const servers = useApi(() => api.customer.servers(), []);
  const { catalog, region, plan } = useCatalog();
  const [q, setQ] = useState("");
  const [regionId, setRegionId] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (servers.data ?? []).filter(
      (s) =>
        (!t || s.name.toLowerCase().includes(t) || s.ipAddresses.some((ip) => ip.includes(t)) || s.id.includes(t)) &&
        (regionId === "all" || s.regionId === regionId) &&
        (status === "all" || (status === "running" ? s.status === "running" : status === "stopped" ? s.status === "stopped" : !["running", "stopped"].includes(s.status))),
    );
  }, [servers.data, q, regionId, status]);
  const paged = usePaged(filtered, page, 5);
  const all = servers.data ?? [];

  return (
    <div>
      <PageHeader title="My Services" subtitle="Manage and monitor all your cloud servers in one place." actions={<ButtonLink href="/dashboard/servers/new" icon={<Plus />}>Create Server</ButtonLink>} />

      <div className="grid gap-4 sm:grid-cols-3">
        {servers.loading ? (
          <StatSkeleton count={3} />
        ) : (
          <>
            <StatCard label="Total Servers" value={pad2(all.length)} />
            <StatCard label="Running" value={pad2(all.filter((s) => s.status === "running").length)} />
            <StatCard label="Stopped" value={pad2(all.filter((s) => s.status === "stopped").length)} />
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input leading={<Search />} placeholder="Search by server name or IP…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search servers" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="sm:w-44">
            <Select value={regionId} onChange={(e) => { setRegionId(e.target.value); setPage(1); }} aria-label="Filter by region">
              <option value="all">All Regions</option>
              {catalog?.regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </div>
          <div className="sm:w-40">
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
              <option value="all">All Statuses</option>
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
              <option value="pending">Pending actions</option>
            </Select>
          </div>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title="All Servers" action={<span className="text-xs text-slate-400">{filtered.length} servers total</span>} />
        <div className="mt-4">
          {servers.loading ? (
            <RowsSkeleton rows={5} cols={6} />
          ) : servers.error ? (
            <ErrorState onRetry={servers.reload} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Server />}
              title={all.length ? "No servers match your filters" : "You don't have any servers yet"}
              message={all.length ? "Try another name, IP address, region or status." : "Deploy your first server in about a minute."}
              action={all.length ? <Button variant="secondary" size="sm" onClick={() => { setQ(""); setRegionId("all"); setStatus("all"); }}>Clear filters</Button> : <ButtonLink href="/dashboard/servers/new" size="sm" icon={<Plus />}>Create Server</ButtonLink>}
            />
          ) : (
            <>
              <Table label="All servers" minWidth={860}>
                <THead>
                  <Th>Server</Th>
                  <Th>Region</Th>
                  <Th>IP address</Th>
                  <Th>Plan</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </THead>
                <tbody>
                  {paged.slice.map((s) => (
                    <Tr key={s.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Server className="size-4" /></span>
                          <div>
                            <Link href={`/dashboard/servers/${s.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{s.name}</Link>
                            <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              {s.id}
                              {s.source === "THIRD_PARTY_PROVIDER" ? <Badge tone="purple" className="px-1.5 py-0 text-[10px]">Partner</Badge> : null}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>{region(s.regionId)?.name}</Td>
                      <Td><span className="inline-flex items-center gap-1 font-mono text-xs">{s.ipAddresses[0]}<CopyButton value={s.ipAddresses[0] ?? ""} label="Copy IP address" /></span></Td>
                      <Td>{planSpec(plan(s.planId))}</Td>
                      <Td><StatusBadge status={s.status} /></Td>
                      <Td>
                        <Link href={`/dashboard/servers/${s.id}`} className="group inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 hover:text-brand-700">
                          View Details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.from}–${paged.to} of ${paged.total} servers`} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
