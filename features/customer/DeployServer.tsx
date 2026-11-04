"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Check, CheckCircle2, Monitor } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useCatalog } from "@/hooks/useCatalog";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { ConfirmModal } from "@/components/ui/Modal";
import { FormAlert } from "@/components/ui/States";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

function Step({ n, title, sub, children }: { n: number; title: string; sub: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-semibold text-slate-900">
        {n}. {title}
      </h2>
      <p className="mt-0.5 text-[13px] text-slate-500">{sub}</p>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function Choice({ selected, onClick, children, label }: { selected: boolean; onClick: () => void; children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative w-full rounded-lg border p-3.5 text-left transition-all duration-150",
        selected ? "border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/15" : "border-line bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      {children}
      {selected ? <CheckCircle2 className="absolute right-3 top-3 size-4 text-brand-600" /> : null}
    </button>
  );
}

const osIcon: Record<string, ReactNode> = {
  ubuntu: (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#E95420" /><circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="5.6" cy="12" r="1.7" fill="#fff" /><circle cx="15.2" cy="6.5" r="1.7" fill="#fff" /><circle cx="15.2" cy="17.5" r="1.7" fill="#fff" /></svg>
  ),
  debian: (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#D70A53" /><path d="M14.6 7.2a5.2 5.2 0 1 0 1.9 6.6" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /><circle cx="12.3" cy="12.2" r="1.6" fill="#fff" /></svg>
  ),
  windows: (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><rect x="2" y="2" width="9.5" height="9.5" fill="#0078D4" /><rect x="12.5" y="2" width="9.5" height="9.5" fill="#0078D4" /><rect x="2" y="12.5" width="9.5" height="9.5" fill="#0078D4" /><rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#0078D4" /></svg>
  ),
};

const hostnameRe = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const nameRe = /^[a-z0-9][a-z0-9-]{1,40}[a-z0-9]$/;

export function DeployServer() {
  const router = useRouter();
  const toast = useToast();
  const { catalog } = useCatalog();
  const keys = useApi(() => api.customer.sshKeys(), [], { live: false });
  const groups = useApi(() => api.customer.firewallGroups(), [], { live: false });

  const [regionId, setRegionId] = useState("nyc");
  const [osId, setOsId] = useState("ubuntu");
  const [osVersion, setOsVersion] = useState("Ubuntu 24.04 LTS");
  const [planId, setPlanId] = useState("professional");
  const [storage, setStorage] = useState<number | null>(null);
  const [backups, setBackups] = useState(false);
  const [sshKeyId, setSshKeyId] = useState("");
  const [fwId, setFwId] = useState("");
  const [name, setName] = useState("");
  const [hostname, setHostname] = useState("");
  const [errors, setErrors] = useState<{ name?: string; hostname?: string; ssh?: string }>({});
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ tone: "pending" | "error"; msg: string } | null>(null);

  const plans = catalog?.plans.filter((p) => p.status === "active") ?? [];
  const plan = plans.find((p) => p.id === planId);
  const region = catalog?.regions.find((r) => r.id === regionId);
  const os = catalog?.operatingSystems.find((o) => o.id === osId);
  const storageGb = storage ?? plan?.storageGb ?? 0;
  const extraStorage = plan ? Math.max(0, storageGb - plan.storageGb) * 0.1 : 0;
  const monthly = (plan?.priceMonthly ?? 0) + (backups ? (plan?.priceMonthly ?? 0) * 0.2 : 0) + extraStorage;

  useEffect(() => {
    if (os && !os.versions.includes(osVersion)) setOsVersion(os.versions[0]!);
  }, [os, osVersion]);
  useEffect(() => setStorage(null), [planId]);

  const validate = () => {
    const e: typeof errors = {};
    if (!nameRe.test(name.trim())) e.name = "Use 3–42 lowercase letters, numbers or dashes, e.g. web-prod-02.";
    if (hostname.trim() && !hostnameRe.test(hostname.trim())) e.hostname = "Enter a valid hostname, e.g. server.example.com.";
    if (osId !== "windows" && !sshKeyId) e.ssh = "Choose an SSH key so you can log in securely.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const deploy = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.customer.createServer({ regionId, osId, osVersion, planId, storageGb, backups, sshKeyId: sshKeyId || undefined, firewallGroupId: fwId || undefined, name: name.trim(), hostname: hostname.trim() || undefined });
      setConfirm(false);
      setResult({ tone: "pending", msg: res.message });
      toast({ tone: "pending", title: "Provisioning started", message: `${name} is being created. We'll confirm when it is running.` });
      window.setTimeout(() => router.push(`/dashboard/servers/${res.data!.id}`), 1200);
    } catch (err) {
      setConfirm(false);
      if (err instanceof ApiError && err.field === "name") setErrors({ name: err.message });
      setResult({ tone: "error", msg: err instanceof ApiError ? err.message : "The order could not be submitted. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const summary = useMemo(
    () => [
      ["Region", region?.name ?? "—"],
      ["Operating System", osVersion],
      ["Compute", plan ? `${plan.vcpu} vCPU` : "—"],
      ["Memory", plan ? `${plan.memoryGb} GB RAM` : "—"],
      ["Storage", `${storageGb} GB SSD`],
      ["Backup", backups ? "Daily backups" : "Not enabled"],
    ],
    [region, osVersion, plan, storageGb, backups],
  );

  return (
    <div>
      <PageHeader crumbs={[{ label: "My Services", href: "/dashboard/services" }, { label: "Create Server" }]} title="Deploy a New Server" subtitle="Configure your cloud instance to match your workload." />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {result ? <FormAlert tone={result.tone === "pending" ? "pending" : "error"} title={result.tone === "pending" ? "Order submitted — provisioning pending" : "Server not deployed"}>{result.msg}</FormAlert> : null}

          <Step n={1} title="Choose a Server Location" sub="Select the region closest to your users.">
            {!catalog ? <Skeleton className="h-24" /> : (
              <div role="radiogroup" aria-label="Server location" className="grid gap-3 sm:grid-cols-2">
                {catalog.regions.map((r) => (
                  <Choice key={r.id} selected={regionId === r.id} onClick={() => setRegionId(r.id)} label={r.name}>
                    <span className={cn("mb-2 grid size-4 place-items-center rounded-full border-2", regionId === r.id ? "border-brand-600" : "border-slate-300")}>{regionId === r.id ? <span className="size-1.5 rounded-full bg-brand-600" /> : null}</span>
                    <span className="block text-[13px] font-semibold text-slate-900">{r.name}</span>
                    <span className="block text-xs text-slate-500">{r.area}</span>
                  </Choice>
                ))}
              </div>
            )}
          </Step>

          <Step n={2} title="Select an Operating System" sub="Choose the OS for your new instance.">
            {!catalog ? <Skeleton className="h-20" /> : (
              <>
                <div role="radiogroup" aria-label="Operating system" className="grid gap-3 sm:grid-cols-3">
                  {catalog.operatingSystems.map((o) => (
                    <Choice key={o.id} selected={osId === o.id} onClick={() => setOsId(o.id)} label={o.name}>
                      <span className="mb-2 block">{osIcon[o.id] ?? <Monitor className="size-5" />}</span>
                      <span className="block text-[13px] font-semibold text-slate-900">{o.name}</span>
                      <span className="block text-xs text-slate-500">{o.description}</span>
                    </Choice>
                  ))}
                </div>
                <Field label="OS Version" htmlFor="os-version" className="mt-4">
                  <Select id="os-version" value={osVersion} onChange={(e) => setOsVersion(e.target.value)}>
                    {os?.versions.map((v) => <option key={v}>{v}</option>)}
                  </Select>
                </Field>
              </>
            )}
          </Step>

          <Step n={3} title="Choose a Server Plan" sub="Select the resources your application needs.">
            {!catalog ? <Skeleton className="h-20" /> : (
              <>
                <div role="radiogroup" aria-label="Server plan" className="grid gap-3 sm:grid-cols-3">
                  {plans.map((p) => (
                    <Choice key={p.id} selected={planId === p.id} onClick={() => setPlanId(p.id)} label={`${p.name} plan`}>
                      <span className="block text-[13px] font-semibold text-slate-900">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{p.vcpu} vCPU · {p.memoryGb} GB RAM</span>
                      <span className="mt-2 block text-[15px] font-bold text-slate-900">{money(p.priceMonthly).replace(".00", "")}<span className="text-xs font-medium text-slate-500">/mo</span></span>
                    </Choice>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Storage" htmlFor="storage" hint={extraStorage ? `+${money(extraStorage)}/mo for extra storage` : "Included with the plan"}>
                    <Select id="storage" value={storageGb} onChange={(e) => setStorage(Number(e.target.value))}>
                      {plan ? [plan.storageGb, plan.storageGb * 2, plan.storageGb * 4].map((g) => <option key={g} value={g}>{g} GB SSD</option>) : null}
                    </Select>
                  </Field>
                  <Field label="Backup" htmlFor="backup" hint={backups ? `+${money((plan?.priceMonthly ?? 0) * 0.2)}/mo` : undefined}>
                    <Select id="backup" value={backups ? "yes" : "no"} onChange={(e) => setBackups(e.target.value === "yes")}>
                      <option value="no">No automated backup</option>
                      <option value="yes">Daily automated backups (+20%)</option>
                    </Select>
                  </Field>
                </div>
              </>
            )}
          </Step>

          <Step n={4} title="Security Configuration" sub="Set up secure access to your instance.">
            <div className="space-y-4">
              <Field label="SSH Key" htmlFor="ssh" error={errors.ssh} hint={osId === "windows" ? "Windows servers use a password sent to your email." : undefined}>
                <Select id="ssh" value={sshKeyId} invalid={!!errors.ssh} onChange={(e) => setSshKeyId(e.target.value)} disabled={osId === "windows"}>
                  <option value="">Select an SSH key</option>
                  {keys.data?.map((k) => <option key={k.id} value={k.id}>{k.name} ({k.type})</option>)}
                </Select>
              </Field>
              <Field label="Firewall Group" htmlFor="fw">
                <Select id="fw" value={fwId} onChange={(e) => setFwId(e.target.value)}>
                  <option value="">Default Firewall</option>
                  {groups.data?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </Select>
              </Field>
            </div>
          </Step>

          <Step n={5} title="Identify Your Server" sub="Give your server a name you will recognise.">
            <div className="space-y-4">
              <Field label="Server Name" htmlFor="srv-name" error={errors.name} required>
                <Input id="srv-name" placeholder="e.g. web-prod-01" value={name} invalid={!!errors.name} onChange={(e) => setName(e.target.value.toLowerCase())} />
              </Field>
              <Field label="Hostname (optional)" htmlFor="srv-host" error={errors.hostname}>
                <Input id="srv-host" placeholder="e.g. server.example.com" value={hostname} invalid={!!errors.hostname} onChange={(e) => setHostname(e.target.value)} />
              </Field>
            </div>
          </Step>
        </div>

        <aside className="xl:sticky xl:top-24">
          <Card className="p-5">
            <h2 className="text-[15px] font-semibold text-slate-900">Deployment Summary</h2>
            <p className="mt-0.5 text-[13px] text-slate-500">Review your configuration.</p>
            <dl className="mt-4 space-y-2.5 text-[13px]">
              {summary.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-semibold text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-xs text-slate-500">Estimated monthly cost</p>
              <p className="mt-1 text-[28px] font-bold tracking-tight text-slate-900">{money(monthly)}</p>
              <p className="text-xs text-slate-400">USD / month · illustrative pricing</p>
            </div>
            <Button className="mt-4 w-full" iconRight={<ArrowRight />} onClick={() => validate() && setConfirm(true)} disabled={submitting || result?.tone === "pending"}>
              Deploy Server
            </Button>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Review your configuration before deployment. Actual availability and charges depend on the selected provider and plan.</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600"><Check className="size-3.5" /> Secure infrastructure configuration</p>
          </Card>
        </aside>
      </div>

      <ConfirmModal
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={deploy}
        loading={submitting}
        tone="primary"
        title="Confirm your order"
        confirmLabel={`Deploy for ${money(monthly)}/mo`}
        message={
          <>
            <p>
              Deploy <b className="text-slate-900">{name}</b> in <b className="text-slate-900">{region?.name}</b> on the <b className="text-slate-900">{plan?.name}</b> plan with {osVersion}?
            </p>
            <p className="mt-2 text-xs text-slate-500">Your balance or default payment method is checked first. The server shows as “Provisioning” until the infrastructure confirms it is running.</p>
          </>
        }
      />
    </div>
  );
}
