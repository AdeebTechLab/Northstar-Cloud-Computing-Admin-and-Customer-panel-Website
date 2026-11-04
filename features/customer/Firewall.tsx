"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Info, Plus, Trash2 } from "lucide-react";
import type { FirewallGroup, FirewallRule } from "@/types";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select } from "@/components/ui/Field";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { RowsSkeleton, Skeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const cidrRe = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
const portRe = /^(\d{1,5})(-(\d{1,5}))?$/;
const emptyRule = { direction: "inbound" as FirewallRule["direction"], protocol: "TCP" as FirewallRule["protocol"], port: "", source: "", action: "allow" as FirewallRule["action"], description: "" };

export function Firewall() {
  const toast = useToast();
  const groups = useApi(() => api.customer.firewallGroups(), []);
  const rules = useApi(() => api.customer.firewallRules(), []);
  const [groupId, setGroupId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rule, setRule] = useState(emptyRule);
  const [errors, setErrors] = useState<{ port?: string; source?: string; description?: string }>({});
  const [ruleState, setRuleState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [ruleMsg, setRuleMsg] = useState("");
  const [groupModal, setGroupModal] = useState<{ mode: "create" | "rename"; group?: FirewallGroup } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupErr, setGroupErr] = useState("");
  const [groupSaving, setGroupSaving] = useState(false);
  const [removeRule, setRemoveRule] = useState<FirewallRule | null>(null);
  const [removing, setRemoving] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupId && groups.data?.[0]) setGroupId(groups.data[0].id);
  }, [groups.data, groupId]);

  const all = groups.data ?? [];
  const allRules = rules.data ?? [];
  const current = all.find((g) => g.id === groupId);
  const groupRules = allRules.filter((r) => r.groupId === groupId);
  const paged = usePaged(groupRules, page, 4);
  const protectedServers = all.reduce((n, g) => n + g.serversAssigned, 0);

  const saveRule = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (rule.protocol !== "ICMP") {
      const m = rule.port.trim().match(portRe);
      if (!m || Number(m[1]) < 1 || Number(m[1]) > 65535 || (m[3] && Number(m[3]) <= Number(m[1]))) errs.port = "Enter a port (1–65535) or a range like 8080-8090.";
    }
    if (!cidrRe.test(rule.source.trim()) || rule.source.split("/")[0]!.split(".").some((o) => Number(o) > 255)) errs.source = "Enter an IP or CIDR like 192.168.1.0/24 (0.0.0.0/0 = anywhere).";
    if (rule.description.trim().length < 3) errs.description = "Describe this rule so your team understands it.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setRuleState("error");
      setRuleMsg("Please fix the highlighted fields.");
      return;
    }
    setRuleState("saving");
    try {
      await api.customer.addFirewallRule({ ...rule, groupId, port: rule.protocol === "ICMP" ? "—" : rule.port.trim(), source: rule.source.trim(), description: rule.description.trim() });
      setRuleState("saved");
      setRuleMsg(`Rule added to ${current?.name}. It applies to ${current?.serversAssigned ?? 0} assigned server(s).`);
      setRule(emptyRule);
      setPage(Math.ceil((groupRules.length + 1) / 4));
    } catch (err) {
      setRuleState("error");
      setRuleMsg(err instanceof ApiError ? err.message : "The rule could not be saved.");
    }
  };

  const saveGroup = async () => {
    if (groupName.trim().length < 3) {
      setGroupErr("Use at least 3 characters.");
      return;
    }
    setGroupSaving(true);
    try {
      if (groupModal?.mode === "create") {
        const g = await api.customer.createFirewallGroup(groupName);
        setGroupId(g.id);
        toast({ tone: "success", title: "Firewall group created", message: `${g.name} is ready for rules.` });
      } else if (groupModal?.group) {
        await api.customer.renameFirewallGroup(groupModal.group.id, groupName);
        toast({ tone: "success", title: "Group updated" });
      }
      setGroupModal(null);
    } catch (err) {
      setGroupErr(err instanceof ApiError ? err.message : "Could not save the group.");
    } finally {
      setGroupSaving(false);
    }
  };

  const openGroupModal = (mode: "create" | "rename", group?: FirewallGroup) => {
    setGroupModal({ mode, group });
    setGroupName(group?.name ?? "");
    setGroupErr("");
  };

  return (
    <div>
      <PageHeader crumbs={[{ label: "Workspace" }, { label: "Security" }, { label: "Firewall" }]} title="Firewall" subtitle="Manage firewall groups and control network access to your servers." actions={<Button icon={<Plus />} onClick={() => openGroupModal("create")}>Create Firewall Group</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        {groups.loading || rules.loading ? <StatSkeleton count={3} /> : (
          <>
            <StatCard label="Firewall Groups" value={pad2(all.length)} sub="Across your account" />
            <StatCard label="Active Rules" value={allRules.length} sub={<span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500" /> Rules currently configured</span>} />
            <StatCard label="Protected Servers" value={pad2(protectedServers)} sub="Servers assigned to firewall groups" />
          </>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Firewall Groups" subtitle="Organize rules and assign them to your servers." action={<Button variant="secondary" size="sm" iconRight={<ArrowRight />} onClick={() => document.getElementById("fw-rules")?.scrollIntoView({ behavior: "smooth" })}>View rules</Button>} />
        <div className="grid gap-3 p-5 md:grid-cols-2">
          {groups.loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />) : (
            <>
              {all.map((g) => {
                const count = allRules.filter((r) => r.groupId === g.id).length;
                const selected = g.id === groupId;
                return (
                  <div key={g.id} className={cn("rounded-xl border p-4 transition-all", selected ? "border-brand-300 bg-brand-50/40 ring-2 ring-brand-500/10" : "border-line hover:border-slate-300 hover:shadow-card")}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] font-semibold text-slate-900">{g.name}</p>
                      <StatusBadge status={g.status} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{g.serversAssigned} {g.serversAssigned === 1 ? "server" : "servers"} assigned</p>
                    <p className="text-xs text-slate-500">{count} rules configured</p>
                    <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs font-semibold">
                      <button type="button" onClick={() => { setGroupId(g.id); setPage(1); document.getElementById("fw-rules")?.scrollIntoView({ behavior: "smooth" }); }} className="text-brand-600 hover:underline">
                        View rules →
                      </button>
                      <button type="button" onClick={() => openGroupModal("rename", g)} className="text-brand-600 hover:underline">Edit group</button>
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={() => openGroupModal("create")} className="flex min-h-28 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 p-4 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40">
                <Plus className="size-5 text-brand-600" />
                <span className="text-[13px] font-semibold text-brand-600">Create a firewall group</span>
                <span className="text-[11px] text-slate-500">Set up a new rule group</span>
              </button>
            </>
          )}
        </div>
      </Card>

      <Card className="mt-4 scroll-mt-24" id="fw-rules">
        <CardHeader
          title="Firewall Rules"
          subtitle={
            <span className="flex items-center gap-2">
              Rules for
              <select value={groupId} onChange={(e) => { setGroupId(e.target.value); setPage(1); }} className="rounded-md border border-line bg-white px-1.5 py-0.5 text-[13px] font-semibold text-slate-700" aria-label="Choose firewall group">
                {all.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </span>
          }
          action={<Button size="sm" icon={<Plus />} onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>Add Rule</Button>}
        />
        <div className="mt-4">
          {rules.loading ? <RowsSkeleton rows={4} cols={6} /> : groupRules.length === 0 ? (
            <EmptyState title="No rules in this group" message="Traffic is blocked by default. Add a rule below to allow what your servers need." />
          ) : (
            <>
              <Table label="Firewall rules" minWidth={820}>
                <THead>
                  <Th>Direction</Th>
                  <Th>Protocol</Th>
                  <Th>Port</Th>
                  <Th>Source / Destination</Th>
                  <Th>Description</Th>
                  <Th>Action</Th>
                  <Th><span className="sr-only">Remove</span></Th>
                </THead>
                <tbody>
                  {paged.slice.map((r) => (
                    <Tr key={r.id} className="group">
                      <Td><Badge tone={r.direction === "inbound" ? "brand" : "purple"} className="uppercase tracking-wide">{r.direction}</Badge></Td>
                      <Td className="font-semibold text-slate-800">{r.protocol}</Td>
                      <Td className="font-mono text-xs">{r.port}</Td>
                      <Td className="font-mono text-xs">{r.source}</Td>
                      <Td>{r.description}</Td>
                      <Td className={r.action === "allow" ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>{r.action === "allow" ? "Allow" : "Deny"}</Td>
                      <Td className="text-right">
                        <button type="button" onClick={() => setRemoveRule(r)} className="grid size-8 place-items-center rounded-lg text-slate-400 opacity-60 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" aria-label={`Remove rule ${r.description}`}>
                          <Trash2 className="size-4" />
                        </button>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination variant="text" page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${paged.total} rules`} />
            </>
          )}
        </div>
      </Card>

      <div ref={formRef} className="scroll-mt-24">
        <Card className="mt-4">
          <CardHeader title="Add Firewall Rule" subtitle={`Configure a network access rule for ${current?.name ?? "your selected group"}.`} />
          <form onSubmit={saveRule} noValidate className="space-y-4 p-5">
            {ruleState === "saved" ? <FormAlert tone="success" title="Rule saved">{ruleMsg}</FormAlert> : null}
            {ruleState === "error" ? <FormAlert tone="error" title="Rule not saved">{ruleMsg}</FormAlert> : null}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Direction" htmlFor="r-dir">
                <Select id="r-dir" value={rule.direction} onChange={(e) => setRule({ ...rule, direction: e.target.value as FirewallRule["direction"] })}>
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                </Select>
              </Field>
              <Field label="Protocol" htmlFor="r-proto">
                <Select id="r-proto" value={rule.protocol} onChange={(e) => setRule({ ...rule, protocol: e.target.value as FirewallRule["protocol"] })}>
                  <option>TCP</option>
                  <option>UDP</option>
                  <option>ICMP</option>
                </Select>
              </Field>
              <Field label="Port or Port Range" htmlFor="r-port" error={errors.port}>
                <Input id="r-port" placeholder={rule.protocol === "ICMP" ? "Not needed for ICMP" : "e.g. 443 or 8080-8090"} disabled={rule.protocol === "ICMP"} value={rule.port} invalid={!!errors.port} onChange={(e) => setRule({ ...rule, port: e.target.value })} />
              </Field>
              <Field label="Source IP / CIDR" htmlFor="r-src" error={errors.source}>
                <Input id="r-src" placeholder="e.g. 192.168.1.0/24" value={rule.source} invalid={!!errors.source} onChange={(e) => setRule({ ...rule, source: e.target.value })} />
              </Field>
              <Field label="Action" htmlFor="r-action">
                <Select id="r-action" value={rule.action} onChange={(e) => setRule({ ...rule, action: e.target.value as FirewallRule["action"] })}>
                  <option value="allow">Allow</option>
                  <option value="deny">Deny</option>
                </Select>
              </Field>
              <Field label="Description" htmlFor="r-desc" error={errors.description}>
                <Input id="r-desc" placeholder="Describe this rule" value={rule.description} invalid={!!errors.description} onChange={(e) => setRule({ ...rule, description: e.target.value })} />
              </Field>
            </div>
            <p className="flex items-center gap-2 rounded-lg bg-brand-50/70 px-3 py-2.5 text-xs text-slate-600">
              <Info className="size-3.5 shrink-0 text-brand-600" /> For better security, allow access only from trusted IP addresses.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setRule(emptyRule); setErrors({}); setRuleState("idle"); }}>Cancel</Button>
              <Button type="submit" loading={ruleState === "saving"} loadingText="Saving…">Save Rule</Button>
            </div>
          </form>
        </Card>
      </div>

      <Modal
        open={!!groupModal}
        onClose={() => setGroupModal(null)}
        title={groupModal?.mode === "create" ? "Create firewall group" : "Edit firewall group"}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setGroupModal(null)}>Cancel</Button>
            <Button onClick={saveGroup} loading={groupSaving} loadingText="Saving…">{groupModal?.mode === "create" ? "Create group" : "Save changes"}</Button>
          </>
        }
      >
        <Field label="Group name" htmlFor="g-name" error={groupErr}>
          <Input id="g-name" value={groupName} invalid={!!groupErr} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Staging-Web" onKeyDown={(e) => e.key === "Enter" && void saveGroup()} />
        </Field>
      </Modal>

      <ConfirmModal
        open={!!removeRule}
        onClose={() => setRemoveRule(null)}
        loading={removing}
        onConfirm={async () => {
          if (!removeRule) return;
          setRemoving(true);
          await api.customer.removeFirewallRule(removeRule.id);
          setRemoving(false);
          setRemoveRule(null);
          toast({ tone: "success", title: "Rule removed", message: removeRule.description });
        }}
        title="Remove this rule?"
        confirmLabel="Remove rule"
        message={<>Traffic matching <b className="text-slate-900">{removeRule?.direction} {removeRule?.protocol} {removeRule?.port}</b> from {removeRule?.source} will no longer be {removeRule?.action === "allow" ? "allowed" : "blocked"}.</>}
      />
    </div>
  );
}
