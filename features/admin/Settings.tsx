"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Bell, Code2, Mail, Settings as Cog, Shield, Wrench } from "lucide-react";
import type { PlatformSettings } from "@/types";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, Toggle } from "@/components/ui/Field";
import { ConfirmModal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { FormAlert } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const sections = [
  { id: "general", label: "General Settings", icon: <Cog /> },
  { id: "security", label: "Security & Access", icon: <Shield /> },
  { id: "notifications", label: "Notifications", icon: <Bell /> },
  { id: "email", label: "Email Configuration", icon: <Mail /> },
  { id: "api", label: "API & Integrations", icon: <Code2 /> },
  { id: "maintenance", label: "Maintenance", icon: <Wrench /> },
];

function Section({ id, title, sub, children }: { id: string; title: string; sub: string; children: ReactNode }) {
  return (
    <Card id={`set-${id}`} className="scroll-mt-24">
      <CardHeader title={title} subtitle={sub} />
      <div className="p-5">{children}</div>
    </Card>
  );
}

export function AdminSettings() {
  const toast = useToast();
  const settings = useApi(() => api.admin.settings(), [], { live: false });
  const [s, setS] = useState<PlatformSettings | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<{ field?: string; message?: string }>({});
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [active, setActive] = useState("general");

  useEffect(() => {
    if (settings.data && !s) setS(settings.data);
  }, [settings.data, s]);

  if (!s) {
    return <div><Skeleton className="mb-6 h-8 w-48" /><div className="grid gap-4 lg:grid-cols-[220px_1fr]"><Skeleton className="h-64" /><Skeleton className="h-[480px]" /></div></div>;
  }

  const patch = <K extends keyof PlatformSettings>(k: K, v: PlatformSettings[K]) => {
    setS({ ...s, [k]: v });
    if (state !== "idle") setState("idle");
  };

  const save = async () => {
    if (!s.platformName.trim()) {
      setError({ field: "platformName", message: "Platform name is required." });
      setState("error");
      return;
    }
    if (s.security.sessionTimeoutMinutes < 5 || s.security.sessionTimeoutMinutes > 1440) {
      setError({ field: "timeout", message: "Session timeout must be between 5 and 1440 minutes." });
      setState("error");
      return;
    }
    setState("saving");
    setError({});
    try {
      const res = await api.admin.saveSettings(s);
      setS(res);
      setState("saved");
      toast({ tone: "success", title: "Settings saved", message: "Platform settings were updated." });
    } catch (err) {
      setState("error");
      setError({ field: err instanceof ApiError ? err.field : undefined, message: err instanceof ApiError ? err.message : "Settings were not saved." });
    }
  };

  return (
    <div>
      <PageHeader crumbs={[{ label: "Admin Console" }, { label: "System" }, { label: "Settings" }]} title="Platform Settings" subtitle="Configure platform defaults, security, notifications, and integrations." actions={<Button onClick={save} loading={state === "saving"} loadingText="Saving…">Save Settings</Button>} />

      {state === "saved" ? <FormAlert tone="success" title="Settings saved" className="mb-4">All changes are stored.</FormAlert> : null}
      {state === "error" ? <FormAlert tone="error" title="Settings not saved" className="mb-4">{error.message}</FormAlert> : null}

      <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="no-print lg:sticky lg:top-24">
          <Card className="flex gap-1 overflow-x-auto p-2 lg:flex-col">
            {sections.map((x) => (
              <a key={x.id} href={`#set-${x.id}`} onClick={() => setActive(x.id)} aria-current={active === x.id ? "true" : undefined} className={cn("flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors [&_svg]:size-4", active === x.id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                {x.icon} {x.label}
              </a>
            ))}
          </Card>
        </nav>

        <div className="space-y-4">
          <Section id="general" title="General Settings" sub="Manage platform identity and default preferences.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Platform Name" htmlFor="ps-name" hint="Shown in emails and the customer console." error={error.field === "platformName" ? error.message : undefined}><Input id="ps-name" value={s.platformName} invalid={error.field === "platformName"} onChange={(e) => patch("platformName", e.target.value)} /></Field>
              <Field label="Support Email" htmlFor="ps-email" hint="Where customers send support requests." error={error.field === "supportEmail" ? error.message : undefined}><Input id="ps-email" type="email" value={s.supportEmail} invalid={error.field === "supportEmail"} onChange={(e) => patch("supportEmail", e.target.value)} /></Field>
              <Field label="Default Region" htmlFor="ps-region"><Select id="ps-region" value={s.defaultRegion} onChange={(e) => patch("defaultRegion", e.target.value)}>{["US East (New Jersey)", "US Central (Chicago)", "Europe (Frankfurt)", "UK (London)", "Asia Pacific (Singapore)"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Default Currency" htmlFor="ps-cur"><Select id="ps-cur" value={s.defaultCurrency} onChange={(e) => patch("defaultCurrency", e.target.value)}>{["USD — US Dollar", "EUR — Euro", "GBP — British Pound", "PKR — Pakistani Rupee"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Timezone" htmlFor="ps-tz"><Select id="ps-tz" value={s.timezone} onChange={(e) => patch("timezone", e.target.value)}>{["UTC (Coordinated Universal Time)", "Asia/Karachi (UTC+05:00)", "America/New_York (UTC−05:00)", "Europe/London (UTC±00:00)"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Language" htmlFor="ps-lang"><Select id="ps-lang" value={s.language} onChange={(e) => patch("language", e.target.value)}>{["English (United States)", "English (United Kingdom)", "اردو (Urdu)"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
            </div>
          </Section>

          <Section id="security" title="Security & Access" sub="Configure security policies for administrators and customers.">
            <div className="divide-y divide-line">
              <Toggle label="Two-Factor Authentication" description="Require a second step for all administrator accounts." checked={s.security.adminTwoFactor} onChange={(v) => patch("security", { ...s.security, adminTwoFactor: v })} />
              <Toggle label="Login Alert Emails" description="Email admins when a new device signs in." checked={s.security.loginAlerts} onChange={(v) => patch("security", { ...s.security, loginAlerts: v })} />
              <Toggle label="Automatic Session Timeout" description="Sign users out after a period of inactivity." checked={s.security.autoSessionTimeout} onChange={(v) => patch("security", { ...s.security, autoSessionTimeout: v })} />
            </div>
            <Field label="Session Timeout (minutes)" htmlFor="ps-timeout" className="mt-3 sm:max-w-xs" error={error.field === "timeout" ? error.message : undefined}>
              <Input id="ps-timeout" type="number" min={5} max={1440} disabled={!s.security.autoSessionTimeout} invalid={error.field === "timeout"} value={s.security.sessionTimeoutMinutes} onChange={(e) => patch("security", { ...s.security, sessionTimeoutMinutes: Number(e.target.value) })} />
            </Field>
          </Section>

          <Section id="notifications" title="Notifications" sub="Choose which platform events notify the admin team.">
            <div className="divide-y divide-line">
              <Toggle label="Server Health Alerts" description="CPU, memory and availability incidents." checked={s.notifications.serverHealth} onChange={(v) => patch("notifications", { ...s.notifications, serverHealth: v })} />
              <Toggle label="Payment Failure Alerts" description="Failed renewals and declined payments." checked={s.notifications.paymentFailures} onChange={(v) => patch("notifications", { ...s.notifications, paymentFailures: v })} />
              <Toggle label="New Support Tickets" description="Notify when customers open a ticket." checked={s.notifications.newTickets} onChange={(v) => patch("notifications", { ...s.notifications, newTickets: v })} />
              <Toggle label="Weekly Platform Summary" description="A weekly email with revenue and usage." checked={s.notifications.weeklySummary} onChange={(v) => patch("notifications", { ...s.notifications, weeklySummary: v })} />
            </div>
          </Section>

          <Section id="email" title="Email Configuration" sub="Set the sender details used for platform notifications.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sender Name" htmlFor="ps-sn"><Input id="ps-sn" value={s.email.senderName} onChange={(e) => patch("email", { ...s.email, senderName: e.target.value })} /></Field>
              <Field label="Sender Email" htmlFor="ps-se"><Input id="ps-se" type="email" value={s.email.senderEmail} onChange={(e) => patch("email", { ...s.email, senderEmail: e.target.value })} /></Field>
              <Field label="SMTP Host" htmlFor="ps-host"><Input id="ps-host" value={s.email.smtpHost} onChange={(e) => patch("email", { ...s.email, smtpHost: e.target.value })} /></Field>
              <Field label="SMTP Port" htmlFor="ps-port"><Input id="ps-port" inputMode="numeric" value={s.email.smtpPort} onChange={(e) => patch("email", { ...s.email, smtpPort: e.target.value.replace(/\D/g, "") })} /></Field>
            </div>
            <p className="mt-4 rounded-lg bg-brand-50/70 px-3 py-2.5 text-xs text-slate-600">SMTP passwords are stored by the NestJS API only — they are never entered or shown in the browser.</p>
          </Section>

          <Section id="api" title="API & Integrations" sub="Manage API access and connected services.">
            <div className="divide-y divide-line">
              <Toggle label="API Access" description="Allow customers to create API tokens." checked={s.integrations.apiAccess} onChange={(v) => patch("integrations", { ...s.integrations, apiAccess: v })} />
              <Toggle label="Webhook Notifications" description="Send platform events to configured webhooks." checked={s.integrations.webhooks} onChange={(v) => patch("integrations", { ...s.integrations, webhooks: v })} />
              <Toggle label="Third-Party Integrations" description="Enable reselling through connected cloud providers." checked={s.integrations.thirdParty} onChange={(v) => patch("integrations", { ...s.integrations, thirdParty: v })} />
            </div>
          </Section>

          <Section id="maintenance" title="Maintenance" sub="Control platform maintenance mode and the customer notice.">
            <div className="divide-y divide-line"><Toggle label="Maintenance Mode" description="Show a maintenance notice and pause new orders." checked={s.maintenance.enabled} onChange={(v) => patch("maintenance", { ...s.maintenance, enabled: v })} /></div>
            <Field label="Maintenance Notice" htmlFor="ps-notice" className="mt-3"><Textarea id="ps-notice" rows={3} value={s.maintenance.notice} onChange={(e) => patch("maintenance", { ...s.maintenance, notice: e.target.value })} placeholder="e.g. Scheduled maintenance on Nov 10 from 02:00–03:00 UTC." /></Field>
            {s.maintenance.enabled ? <FormAlert tone="pending" title="Maintenance mode will be on after saving" className="mt-3">Customers will see the notice and new orders pause.</FormAlert> : <p className="mt-3 rounded-lg bg-brand-50/70 px-3 py-2.5 text-xs text-slate-600">Maintenance mode is currently off. Changes take effect after saving.</p>}
            <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
              <Button variant="secondary" onClick={() => { if (settings.data) setS(settings.data); setState("idle"); setError({}); }}>Discard</Button>
              <Button onClick={save} loading={state === "saving"} loadingText="Saving…">Save Settings</Button>
            </div>
          </Section>

          <Card className="border-red-200">
            <CardHeader title={<span className="text-red-600">Danger Zone</span>} subtitle="These actions affect the whole platform." />
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">Reset all platform preferences to their defaults. Customer data is not affected.</p>
              <Button variant="danger-outline" onClick={() => setResetOpen(true)}>Reset Platform Preferences</Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal open={resetOpen} onClose={() => setResetOpen(false)} loading={resetting} title="Reset platform preferences?" confirmLabel="Reset to defaults"
        message="All settings on this page return to their defaults. This cannot be undone."
        onConfirm={async () => {
          setResetting(true);
          const res = await api.admin.resetSettings();
          setS(res);
          setResetting(false);
          setResetOpen(false);
          setState("idle");
          toast({ tone: "success", title: "Preferences reset", message: "Platform settings are back to defaults." });
        }} />
    </div>
  );
}
