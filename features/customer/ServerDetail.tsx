"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Camera, ChevronDown, Copy, Info, Play, RotateCw, Scaling, Square, Terminal, Trash2, Server as ServerIcon } from "lucide-react";
import type { Server } from "@/types";
import { api, ApiError, type ServerAction } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useCatalog } from "@/hooks/useCatalog";
import { longDate, money, relativeTime, shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Menu } from "@/components/ui/Menu";
import { Field, Input, Select } from "@/components/ui/Field";
import { BlockSkeleton, StatSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CopyButton } from "@/components/ui/CopyButton";
import { ProgressBar, TrendChart } from "@/components/charts/Charts";
import { PageHeader } from "@/components/panel/PageHeader";

const transitional: Server["status"][] = ["provisioning", "restarting", "stopping", "starting", "deleting"];

function UsageCard({ label, value, sub, pct, color }: { label: string; value: string; sub: string; pct: number; color: string }) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-pop">
      <p className="text-[13px] font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
      <ProgressBar value={pct} color={color} className="mt-3" label={label} />
    </Card>
  );
}

export function ServerDetail({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const { region, plan, catalog } = useCatalog();
  const server = useApi(() => api.customer.server(id), [id]);
  const cpu = useApi(() => api.customer.serverCpu(id), [id, server.data?.status]);
  const activity = useApi(() => api.customer.activity(), []);
  const [pending, setPending] = useState<ServerAction | null>(null);
  const [confirm, setConfirm] = useState<ServerAction | null>(null);
  const [deleteText, setDeleteText] = useState("");
  const [resizeOpen, setResizeOpen] = useState(false);
  const [resizeTo, setResizeTo] = useState("");
  const [resizeState, setResizeState] = useState<"idle" | "sending" | "sent">("idle");
  const prevStatus = useRef<Server["status"] | undefined>(undefined);

  const s = server.data;

  // Announce when the provider confirms a pending operation.
  useEffect(() => {
    const prev = prevStatus.current;
    if (s && prev && transitional.includes(prev) && !transitional.includes(s.status)) {
      toast({ tone: "success", title: "Confirmed by the infrastructure", message: `${s.name} is now ${s.status}.` });
      setPending(null);
    }
    prevStatus.current = s?.status;
  }, [s, toast]);

  // Deleted servers disappear from the API — go back to the list once confirmed.
  useEffect(() => {
    if (!server.loading && s === null && pending === "delete") {
      toast({ tone: "success", title: "Server deleted", message: "The server was removed after provider confirmation." });
      router.push("/dashboard/services");
    }
  }, [s, server.loading, pending, router, toast]);

  const run = async (action: ServerAction) => {
    try {
      setPending(action);
      const res = await api.customer.serverAction(id, action);
      setConfirm(null);
      setDeleteText("");
      toast({ tone: "pending", title: "Request sent", message: res.message });
    } catch (err) {
      setPending(null);
      setConfirm(null);
      toast({ tone: "error", title: "Action failed", message: err instanceof ApiError ? err.message : "Please try again." });
    }
  };

  if (server.loading) {
    return (
      <div>
        <Skeleton className="mb-3 h-3 w-48" />
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatSkeleton /></div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2"><BlockSkeleton /><BlockSkeleton /></div>
      </div>
    );
  }

  if (!s) {
    return (
      <Card>
        <EmptyState icon={<ServerIcon />} title="Server not found" message="This server may have been deleted or the link is wrong." action={<ButtonLink href="/dashboard/services" size="sm">Back to My Services</ButtonLink>} />
      </Card>
    );
  }

  const p = plan(s.planId);
  const r = region(s.regionId);
  const busy = transitional.includes(s.status);
  const caps = s.capabilities;
  const notSupported = "Not supported by this provider";
  const events = activity.data?.filter((a) => a.target === s.name).slice(0, 4) ?? [];

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "My Services", href: "/dashboard/services" }, { label: "Servers", href: "/dashboard/services" }, { label: s.name }]}
        title={s.name}
        badge={<StatusBadge status={s.status} dot />}
        subtitle={
          <div className="space-y-1.5">
            <p>Server ID: {s.id} · Created {longDate(s.createdAt)}</p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-400" />{r?.name}</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-400" />{s.osVersion}</span>
              <span className="flex items-center gap-1">IP: <span className="font-mono">{s.ipAddresses[0]}</span><CopyButton value={s.ipAddresses[0] ?? ""} label="Copy IP address" /></span>
              {s.source === "THIRD_PARTY_PROVIDER" ? <Badge tone="purple">Partner provider · {s.externalResourceId}</Badge> : <Badge tone="brand">Own infrastructure</Badge>}
            </p>
          </div>
        }
        actions={
          <>
            {caps.restart ? (
              <Button variant="secondary" icon={<RotateCw className={pending === "restart" && busy ? "animate-spin" : undefined} />} disabled={s.status !== "running" || busy} onClick={() => setConfirm("restart")}>
                Restart
              </Button>
            ) : null}
            {s.status === "stopped" || s.status === "starting" ? (
              <Button variant="secondary" icon={<Play />} disabled={!caps.start || busy} onClick={() => setConfirm("start")}>
                Start
              </Button>
            ) : (
              <Button variant="secondary" icon={<Square />} disabled={!caps.stop || s.status !== "running" || busy} onClick={() => setConfirm("stop")}>
                Stop
              </Button>
            )}
            <Menu
              label="More actions"
              trigger={({ toggle, open }) => (
                <Button onClick={toggle} aria-expanded={open} iconRight={<ChevronDown />} disabled={busy}>
                  More Actions
                </Button>
              )}
              items={[
                { label: "Resize server", icon: <Scaling />, disabled: !caps.resize, hint: caps.resize ? undefined : notSupported, onSelect: () => { setResizeTo(""); setResizeState("idle"); setResizeOpen(true); } },
                { label: "Create snapshot", icon: <Camera />, disabled: !caps.snapshot, hint: caps.snapshot ? undefined : notSupported, onSelect: () => toast({ tone: "pending", title: "Snapshot requested", message: "The snapshot appears once the infrastructure confirms it (demo)." }) },
                { label: "Copy server ID", icon: <Copy />, onSelect: () => { void navigator.clipboard?.writeText(s.id); toast({ tone: "success", title: "Copied", message: s.id }); } },
                { label: "Open web console", icon: <Terminal />, disabled: true, hint: "Requires backend integration", onSelect: () => undefined },
                { label: "Delete server", icon: <Trash2 />, danger: true, disabled: !caps.delete, onSelect: () => setConfirm("delete") },
              ]}
            />
          </>
        }
      />

      {busy ? (
        <FormAlert tone="pending" title={`${s.status[0]!.toUpperCase()}${s.status.slice(1)} — waiting for confirmation`} className="mb-4">
          We&apos;ve sent the request. The status updates automatically when the infrastructure confirms it. Nothing is reported as done before that.
        </FormAlert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UsageCard label="CPU Usage" value={`${s.usage.cpu}%`} sub={`${p?.vcpu ?? "—"} vCPU allocated`} pct={s.usage.cpu} color="bg-brand-600" />
        <UsageCard label="Memory Usage" value={`${s.usage.memory}%`} sub={`${((s.usage.memory / 100) * (p?.memoryGb ?? 0)).toFixed(1)} GB of ${p?.memoryGb ?? "—"} GB`} pct={s.usage.memory} color="bg-emerald-500" />
        <UsageCard label="Storage Used" value={`${s.usage.storage}%`} sub={`${Math.round((s.usage.storage / 100) * (p?.storageGb ?? 0))} GB of ${p?.storageGb ?? "—"} GB`} pct={s.usage.storage} color="bg-amber-500" />
        <UsageCard label="Network Traffic" value={`${s.usage.trafficTb} TB`} sub="Illustrative monthly usage" pct={(s.usage.trafficTb / (p?.bandwidthTb ?? 1)) * 100} color="bg-brand-600" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Resource Monitoring" subtitle="CPU utilization · Last 24 hours" />
          <div className="px-5 pb-5 pt-5">
            {cpu.loading || !cpu.data ? (
              <Skeleton className="h-44" />
            ) : (
              <TrendChart xLabels={["24h ago", "18h", "12h", "6h", "Now"]} hoverLabels={cpu.data.map((_, i) => `${Math.round(24 - (i * 24) / (cpu.data!.length - 1))}h ago`)} series={[{ name: "CPU Usage", values: cpu.data, color: "#2563eb" }]} height={190} />
            )}
            <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand-600" /> CPU Usage</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" /> Normal range</span>
            </div>
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-brand-50/70 px-3 py-2.5 text-xs text-slate-600">
              <Info className="size-3.5 shrink-0 text-brand-600" /> Chart values are illustrative UI data, not live server telemetry.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Server Configuration" />
          <dl className="mt-3 divide-y divide-line px-5 pb-3 text-[13px]">
            {[
              ["Operating System", s.osVersion],
              ["Compute Plan", p?.name ?? "—"],
              ["CPU", `${p?.vcpu ?? "—"} vCPU`],
              ["Memory", `${p?.memoryGb ?? "—"} GB RAM`],
              ["Storage", `${p?.storageGb ?? "—"} GB SSD`],
              ["Public IP", s.ipAddresses[0] ?? "—"],
              ["Backups", s.backups ? "Enabled" : "Not enabled"],
              ["Monthly Price", p ? `${money(p.priceMonthly)} / mo` : "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 py-3">
                <dt className="text-slate-500">{k}</dt>
                <dd className="flex items-center gap-1 text-right font-semibold text-slate-900">
                  {v}
                  {k === "Public IP" ? <CopyButton value={v} label="Copy IP address" /> : null}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Recent Server Activity" />
        <ul className="mt-3 divide-y divide-line px-5 pb-3">
          {busy ? (
            <li className="flex items-start gap-3 py-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500 animate-pulse" />
              <div><p className="text-[13px] font-semibold text-slate-900">{s.status[0]!.toUpperCase() + s.status.slice(1)} in progress</p><p className="text-xs text-slate-500">Waiting for provider confirmation</p></div>
            </li>
          ) : (
            <li className="flex items-start gap-3 py-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
              <div><p className="text-[13px] font-semibold text-slate-900">Server is {s.status}</p><p className="text-xs text-slate-500">Latest reported state · {server.updatedAt ? relativeTime(server.updatedAt) : "now"}</p></div>
            </li>
          )}
          {events.map((e) => (
            <li key={e.id} className="flex items-start gap-3 py-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" />
              <div><p className="text-[13px] font-semibold text-slate-900">{e.title}</p><p className="text-xs text-slate-500">{shortDate(e.at)}</p></div>
            </li>
          ))}
          <li className="flex items-start gap-3 py-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500" />
            <div><p className="text-[13px] font-semibold text-slate-900">Server created</p><p className="text-xs text-slate-500">{longDate(s.createdAt)}</p></div>
          </li>
        </ul>
      </Card>

      <ConfirmModal
        open={confirm === "restart" || confirm === "stop" || confirm === "start"}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && void run(confirm)}
        loading={pending !== null && !busy}
        tone={confirm === "stop" ? "danger" : "primary"}
        title={confirm === "restart" ? `Restart ${s.name}?` : confirm === "stop" ? `Stop ${s.name}?` : `Start ${s.name}?`}
        confirmLabel={confirm === "restart" ? "Restart server" : confirm === "stop" ? "Stop server" : "Start server"}
        message={confirm === "stop" ? "Applications on this server will be unavailable until you start it again. Billing continues while the server is stopped." : confirm === "restart" ? "The server will be unavailable for a short time while it reboots." : "The server will boot and start accepting traffic again."}
      />

      <ConfirmModal
        open={confirm === "delete"}
        onClose={() => { setConfirm(null); setDeleteText(""); }}
        onConfirm={() => deleteText === s.name && void run("delete")}
        loading={pending === "delete" && !busy}
        title={`Delete ${s.name}?`}
        confirmLabel="Delete permanently"
        message={<p>This permanently deletes the server and its data. Type <b className="font-mono text-slate-900">{s.name}</b> to confirm.</p>}
      >
        <Input className="mt-3" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder={s.name} aria-label="Type the server name to confirm" invalid={deleteText.length > 0 && deleteText !== s.name} />
      </ConfirmModal>

      <Modal
        open={resizeOpen}
        onClose={() => setResizeOpen(false)}
        title="Resize server"
        description={`Current plan: ${p?.name} (${p?.vcpu} vCPU · ${p?.memoryGb} GB RAM)`}
        footer={
          resizeState === "sent" ? (
            <Button onClick={() => setResizeOpen(false)}>Done</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setResizeOpen(false)}>Cancel</Button>
              <Button
                loading={resizeState === "sending"}
                loadingText="Submitting…"
                disabled={!resizeTo}
                onClick={() => {
                  setResizeState("sending");
                  window.setTimeout(() => setResizeState("sent"), 900);
                }}
              >
                Request resize
              </Button>
            </>
          )
        }
      >
        {resizeState === "sent" ? (
          <FormAlert tone="pending" title="Resize requested">The new plan applies after the infrastructure confirms it. The server will restart once during the change (demo).</FormAlert>
        ) : (
          <Field label="New plan" htmlFor="resize-plan">
            <Select id="resize-plan" value={resizeTo} onChange={(e) => setResizeTo(e.target.value)}>
              <option value="">Choose a plan</option>
              {catalog?.plans.filter((x) => x.status === "active" && x.id !== s.planId).map((x) => <option key={x.id} value={x.id}>{x.name} — {x.vcpu} vCPU · {x.memoryGb} GB · {money(x.priceMonthly)}/mo</option>)}
            </Select>
          </Field>
        )}
      </Modal>

      <p className="mt-6 text-center text-xs text-slate-400">
        Need help with this server? <Link href="/dashboard/support" className="font-semibold text-brand-600 hover:underline">Open a support ticket</Link>
      </p>
    </div>
  );
}
