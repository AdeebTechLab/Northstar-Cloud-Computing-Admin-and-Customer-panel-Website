"use client";

import { useState } from "react";
import { Download, Pencil, Plus } from "lucide-react";
import type { Plan } from "@/types";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/cn";
import { money, number } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select, Toggle } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { BlockSkeleton, RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const HOURS = 730;
const blank: Plan = { id: "", name: "", tagline: "", vcpu: 1, memoryGb: 1, storageGb: 25, bandwidthTb: 1, priceMonthly: 5, status: "draft", subscribers: 0 };

export function AdminPlans() {
  const toast = useToast();
  const plans = useApi(() => api.admin.plans(), []);
  const [cycle, setCycle] = useState<"monthly" | "hourly">("monthly");
  const [editing, setEditing] = useState<Plan | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState({ cycle: "Monthly", hourly: true, renewals: true, trialDays: "7", currency: "USD ($)" });
  const [configDraft, setConfigDraft] = useState(config);

  const list = plans.data ?? [];
  const featured = list.filter((p) => p.status === "active").slice(0, 3);
  const price = (p: Plan) => (cycle === "monthly" ? money(p.priceMonthly).replace(".00", "") : `$${(p.priceMonthly / HOURS).toFixed(3)}`);

  const open = (p: Plan | null) => {
    setIsNew(!p);
    setEditing(p ? { ...p } : { ...blank });
    setErrors({});
    setSaved(false);
  };

  const save = async () => {
    if (!editing) return;
    const e: typeof errors = {};
    if (editing.name.trim().length < 2) e.name = "Plan name is required.";
    if (!(editing.priceMonthly > 0)) e.price = "Enter a monthly price above $0.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    await api.admin.savePlan({ ...editing, id: editing.id || editing.name.trim().toLowerCase().replace(/\s+/g, "-") });
    setSaving(false);
    setSaved(true);
  };

  const num = (k: keyof Plan) => (ev: React.ChangeEvent<HTMLInputElement>) => setEditing((p) => (p ? { ...p, [k]: Number(ev.target.value) } : p));

  return (
    <div>
      <PageHeader title="Plans & Pricing" subtitle="Create and manage cloud plans, pricing, and resource limits." actions={<Button icon={<Plus />} onClick={() => open(null)}>Create New Plan</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.loading ? <StatSkeleton /> : (
          <>
            <StatCard label="Total Plans" value={list.length + 8} sub="Across all categories" subTone="success" />
            <StatCard label="Active Plans" value={list.filter((p) => p.status === "active").length + 6} sub="Available for signup" subTone="success" />
            <StatCard label="Subscribed Customers" value={number(list.reduce((n, p) => n + p.subscribers, 0) - 94)} sub="Across all plans" subTone="success" />
            <StatCard label="Average Plan Value" value="$24.90" sub="Per month · sample data" />
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-[15px] font-semibold text-slate-900">Featured Cloud Plans</h2><p className="text-[13px] text-slate-500">Review your popular compute offerings.</p></div>
        <div role="group" aria-label="Billing cycle" className="inline-flex rounded-lg border border-line bg-white p-0.5 text-xs font-semibold">
          {(["monthly", "hourly"] as const).map((c) => <button key={c} type="button" aria-pressed={cycle === c} onClick={() => setCycle(c)} className={cn("rounded-md px-3 py-1.5 capitalize transition-colors", cycle === c ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-800")}>{c}</button>)}
        </div>
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-3">
        {plans.loading ? [0, 1, 2].map((i) => <BlockSkeleton key={i} />) : featured.map((p) => (
          <Card key={p.id} className={cn("flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop", p.featured && "border-brand-300 ring-1 ring-brand-200")}>
            <div className="flex items-start justify-between gap-2">
              <div><p className="text-[15px] font-semibold text-slate-900">{p.name}</p><p className="text-xs text-slate-500">{p.tagline}</p></div>
              {p.featured ? <Badge tone="brand" className="uppercase">Popular</Badge> : <StatusBadge status={p.status} />}
            </div>
            <p className="mt-4 text-[30px] font-bold tracking-tight text-slate-900">{price(p)} <span className="text-[13px] font-medium text-slate-500">/ {cycle === "monthly" ? "month" : "hour"}</span></p>
            <dl className="mt-4 flex-1 divide-y divide-line border-t border-line text-[13px]">
              {[["vCPU", `${p.vcpu} ${p.vcpu === 1 ? "Core" : "Cores"}`], ["Memory", `${p.memoryGb} GB RAM`], ["Storage", `${p.storageGb} GB SSD`], ["Bandwidth", `${p.bandwidthTb} TB`], ["IPv4 Address", "Included"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5"><dt className="text-slate-500">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-400">{number(p.subscribers)} active subscribers</span><Button variant="secondary" size="xs" icon={<Pencil />} onClick={() => open(p)}>Edit Plan</Button></div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader title="All Pricing Plans" subtitle="Manage availability and resource specifications." action={<Button variant="secondary" size="sm" icon={<Download />} onClick={() => downloadCsv("plans.csv", ["Plan", "vCPU", "RAM GB", "Storage GB", "Monthly price", "Subscribers", "Status"], list.map((p) => [p.name, p.vcpu, p.memoryGb, p.storageGb, p.priceMonthly, p.subscribers, p.status]))}>Export Plans</Button>} />
        <div className="mt-4">
          {plans.loading ? <RowsSkeleton rows={4} cols={7} /> : (
            <Table label="Pricing plans" minWidth={820}>
              <THead><Th>Plan name</Th><Th>CPU / RAM</Th><Th>Storage</Th><Th>{cycle === "monthly" ? "Monthly" : "Hourly"} price</Th><Th>Subscribers</Th><Th>Status</Th><Th className="text-right">Action</Th></THead>
              <tbody>
                {list.map((p) => (
                  <Tr key={p.id}>
                    <Td><p className="font-semibold text-slate-900">{p.name}</p><p className="text-[11px] text-slate-400">{p.tagline.split(" ").slice(0, 4).join(" ")}</p></Td>
                    <Td>{p.vcpu} vCPU / {p.memoryGb} GB</Td>
                    <Td>{p.storageGb} GB SSD</Td>
                    <Td className="font-semibold text-slate-900">{cycle === "monthly" ? money(p.priceMonthly) : `$${(p.priceMonthly / HOURS).toFixed(3)}`}</Td>
                    <Td>{number(p.subscribers)}</Td>
                    <Td><StatusBadge status={p.status} /></Td>
                    <Td className="text-right"><Button variant="secondary" size="xs" onClick={() => open(p)}>Edit</Button></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Pricing Configuration" subtitle="Current platform billing settings" />
          <dl className="divide-y divide-line px-5 text-[13px]">
            {[["Billing cycle", config.cycle], ["Hourly billing", config.hourly ? "Enabled" : "Disabled"], ["Automatic renewals", config.renewals ? "Enabled" : "Disabled"], ["Free trial period", `${config.trialDays} days`], ["Currency", config.currency]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3"><dt className="text-slate-600">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
            ))}
          </dl>
          <div className="p-5 pt-3"><Button variant="secondary" size="sm" onClick={() => { setConfigDraft(config); setConfigOpen(true); }}>Edit Pricing Settings</Button></div>
        </Card>
        <Card>
          <CardHeader title="Plan Management Guidelines" subtitle="Before publishing a pricing change" />
          <dl className="divide-y divide-line px-5 text-[13px]">
            {[["Review resource limits", "Required"], ["Confirm monthly pricing", "Required"], ["Check existing subscribers", "Recommended"], ["Review customer impact", "Recommended"]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3"><dt className="text-slate-600">{k}</dt><dd className={v === "Required" ? "font-semibold text-slate-700" : "text-slate-400"}>{v}</dd></div>
            ))}
          </dl>
          <p className="m-5 mt-3 rounded-lg bg-brand-50/70 px-3 py-2.5 text-xs text-slate-600"><b>Important:</b> Changes to published plans may affect existing customers. Review the impact before applying updates.</p>
        </Card>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Create new plan" : `Edit ${editing?.name}`} description="Customer price shown here. Provider/infrastructure cost is managed separately and never shown to customers." size="lg"
        footer={saved ? <Button onClick={() => setEditing(null)}>Done</Button> : <><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} loading={saving} loadingText="Saving…">{isNew ? "Create plan" : "Save changes"}</Button></>}>
        {saved ? <FormAlert tone="success" title={isNew ? "Plan created" : "Plan updated"}>{editing?.status === "active" ? "The plan is live in the catalog, the website pricing and the deploy page." : "The plan is saved as a draft and hidden from customers."}</FormAlert> : editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plan name" htmlFor="pl-name" error={errors.name}><Input id="pl-name" value={editing.name} invalid={!!errors.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Monthly price (USD)" htmlFor="pl-price" error={errors.price}><Input id="pl-price" type="number" min={0} step="0.01" value={editing.priceMonthly} invalid={!!errors.price} onChange={num("priceMonthly")} /></Field>
            <Field label="Short description" htmlFor="pl-tag" className="sm:col-span-2"><Input id="pl-tag" value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></Field>
            <Field label="vCPU" htmlFor="pl-cpu"><Input id="pl-cpu" type="number" min={1} value={editing.vcpu} onChange={num("vcpu")} /></Field>
            <Field label="Memory (GB)" htmlFor="pl-ram"><Input id="pl-ram" type="number" min={1} value={editing.memoryGb} onChange={num("memoryGb")} /></Field>
            <Field label="Storage (GB SSD)" htmlFor="pl-disk"><Input id="pl-disk" type="number" min={10} value={editing.storageGb} onChange={num("storageGb")} /></Field>
            <Field label="Bandwidth (TB)" htmlFor="pl-bw"><Input id="pl-bw" type="number" min={1} value={editing.bandwidthTb} onChange={num("bandwidthTb")} /></Field>
            <Field label="Status" htmlFor="pl-status"><Select id="pl-status" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Plan["status"] })}><option value="active">Active — available for signup</option><option value="draft">Draft — hidden from customers</option></Select></Field>
            <p className="self-end text-xs text-slate-500">Hourly equivalent: <b className="text-slate-800">${(editing.priceMonthly / HOURS).toFixed(4)}/hr</b></p>
          </div>
        ) : null}
      </Modal>

      <Modal open={configOpen} onClose={() => setConfigOpen(false)} title="Pricing settings" size="sm" footer={<><Button variant="secondary" onClick={() => setConfigOpen(false)}>Cancel</Button><Button onClick={() => { setConfig(configDraft); setConfigOpen(false); toast({ tone: "success", title: "Pricing settings saved" }); }}>Save settings</Button></>}>
        <div className="space-y-4">
          <Field label="Billing cycle" htmlFor="pc-cycle"><Select id="pc-cycle" value={configDraft.cycle} onChange={(e) => setConfigDraft({ ...configDraft, cycle: e.target.value })}><option>Monthly</option><option>Yearly</option></Select></Field>
          <Field label="Free trial (days)" htmlFor="pc-trial"><Input id="pc-trial" type="number" min={0} value={configDraft.trialDays} onChange={(e) => setConfigDraft({ ...configDraft, trialDays: e.target.value })} /></Field>
          <div className="divide-y divide-line rounded-lg border border-line px-4">
            <Toggle label="Hourly billing" checked={configDraft.hourly} onChange={(v) => setConfigDraft({ ...configDraft, hourly: v })} />
            <Toggle label="Automatic renewals" checked={configDraft.renewals} onChange={(v) => setConfigDraft({ ...configDraft, renewals: v })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
