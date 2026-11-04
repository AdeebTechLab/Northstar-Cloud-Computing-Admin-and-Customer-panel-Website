"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Bell, CreditCard, Globe, KeyRound, Laptop, Lock, ShieldCheck, Smartphone, User } from "lucide-react";
import type { AccountProfile } from "@/types";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, PasswordInput, Select, Textarea, Toggle } from "@/components/ui/Field";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { FormAlert } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const sections = [
  { id: "profile", label: "Profile", icon: <User /> },
  { id: "security", label: "Security", icon: <Lock /> },
  { id: "notifications", label: "Notifications", icon: <Bell /> },
  { id: "billing", label: "Billing Details", icon: <CreditCard />, href: "/dashboard/billing" },
  { id: "preferences", label: "Preferences", icon: <Globe /> },
  { id: "api", label: "API & Access", icon: <KeyRound /> },
];

function SecurityRow({ icon, title, sub, action, badge }: { icon: ReactNode; title: string; sub: string; action: ReactNode; badge?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 [&_svg]:size-4">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      {badge}
      {action}
    </div>
  );
}

export function AccountSettings() {
  const toast = useToast();
  const profile = useApi(() => api.customer.profile(), [], { live: false });
  const [form, setForm] = useState<AccountProfile | null>(null);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string }>({});
  const [profileState, setProfileState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [prefState, setPrefState] = useState<"idle" | "saving" | "saved">("idle");
  const [active, setActive] = useState("profile");

  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [pwState, setPwState] = useState<"idle" | "saving" | "saved">("idle");

  const [twoFaOpen, setTwoFaOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const sessions = useApi(() => api.customer.sessions(), [], { live: true });
  const [apiOpen, setApiOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (profile.data && !form) setForm(profile.data);
  }, [profile.data, form]);

  // Highlight the section in view.
  useEffect(() => {
    const els = sections.filter((s) => !s.href).map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id.replace("sec-", ""));
    }, { rootMargin: "-80px 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [form]);

  if (!form) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-56" />
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]"><Skeleton className="h-64" /><Skeleton className="h-96" /></div>
      </div>
    );
  }

  const saveProfile = async () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.phone && !/^[+\d][\d\s()-]{6,}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    setErrors(e);
    if (Object.keys(e).length) {
      setProfileState("error");
      return;
    }
    setProfileState("saving");
    await api.customer.updateProfile(form);
    setProfileState("saved");
  };

  const savePrefs = async (patch: Partial<AccountProfile>, silent?: boolean) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (!silent) setPrefState("saving");
    await api.customer.updateProfile(patch);
    if (!silent) setPrefState("saved");
    else toast({ tone: "success", title: "Preference saved" });
  };

  const changePassword = async () => {
    const e: typeof pwErr = {};
    if (!pw.current) e.current = "Enter your current password.";
    if (pw.next.length < 8) e.next = "Use at least 8 characters.";
    else if (pw.next === pw.current) e.next = "Choose a password you haven't used before.";
    if (pw.confirm !== pw.next) e.confirm = "Passwords do not match.";
    setPwErr(e);
    if (Object.keys(e).length) return;
    setPwState("saving");
    try {
      await api.customer.changePassword(pw.current, pw.next);
      setPwState("saved");
      setForm({ ...form, passwordChangedDaysAgo: 0 });
    } catch (err) {
      setPwState("idle");
      if (err instanceof ApiError && err.field === "current") setPwErr({ current: err.message });
      else setPwErr({ next: err instanceof ApiError ? err.message : "Password not changed." });
    }
  };

  const set = (k: keyof AccountProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [k]: e.target.value });
    if (profileState !== "idle") setProfileState("idle");
  };

  return (
    <div>
      <PageHeader crumbs={[{ label: "Workspace" }, { label: "Account" }, { label: "Settings" }]} title="Account Settings" subtitle="Manage your profile, security, notifications, and account preferences." actions={<Button onClick={saveProfile} loading={profileState === "saving"} loadingText="Saving…">Save Changes</Button>} />

      <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="no-print lg:sticky lg:top-24">
          <Card className="flex gap-1 overflow-x-auto p-2 lg:flex-col">
            {sections.map((s) =>
              s.href ? (
                <Link key={s.id} href={s.href} className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 [&_svg]:size-4">
                  {s.icon} {s.label}
                </Link>
              ) : (
                <a key={s.id} href={`#sec-${s.id}`} onClick={() => setActive(s.id)} aria-current={active === s.id ? "true" : undefined} className={cn("flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors [&_svg]:size-4", active === s.id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                  {s.icon} {s.label}
                </a>
              ),
            )}
          </Card>
        </nav>

        <div className="space-y-4">
          <Card id="sec-profile" className="scroll-mt-24">
            <CardHeader title="Personal Information" subtitle="Update your personal details associated with your account." />
            <div className="space-y-4 p-5">
              {profileState === "saved" ? <FormAlert tone="success" title="Profile saved">Your changes have been saved.</FormAlert> : null}
              {profileState === "error" ? <FormAlert tone="error" title="Profile not saved">Please fix the highlighted fields.</FormAlert> : null}
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">{(form.firstName[0] ?? "") + (form.lastName[0] ?? "")}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{form.firstName} {form.lastName}</p>
                  <p className="text-xs text-slate-500">{form.email}</p>
                  <button type="button" onClick={() => toast({ tone: "info", title: "Profile photos", message: "Photo upload connects to file storage in the backend phase." })} className="mt-0.5 text-xs font-semibold text-brand-600 hover:underline">Change profile photo</button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" htmlFor="p-first" error={errors.firstName}><Input id="p-first" value={form.firstName} invalid={!!errors.firstName} onChange={set("firstName")} autoComplete="given-name" /></Field>
                <Field label="Last Name" htmlFor="p-last" error={errors.lastName}><Input id="p-last" value={form.lastName} invalid={!!errors.lastName} onChange={set("lastName")} autoComplete="family-name" /></Field>
                <Field label="Email Address" htmlFor="p-email" error={errors.email}><Input id="p-email" type="email" value={form.email} invalid={!!errors.email} onChange={set("email")} autoComplete="email" /></Field>
                <Field label="Phone Number" htmlFor="p-phone" error={errors.phone}><Input id="p-phone" value={form.phone} invalid={!!errors.phone} onChange={set("phone")} autoComplete="tel" /></Field>
                <Field label="Company Name" htmlFor="p-company"><Input id="p-company" value={form.company} onChange={set("company")} autoComplete="organization" /></Field>
                <Field label="Job Title" htmlFor="p-job"><Input id="p-job" value={form.jobTitle} onChange={set("jobTitle")} /></Field>
              </div>
              <Field label="Account Description (Optional)" htmlFor="p-desc"><Textarea id="p-desc" rows={2} placeholder="Add a short description about your account" value={form.description} onChange={set("description")} /></Field>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => { if (profile.data) setForm(profile.data); setErrors({}); setProfileState("idle"); }}>Cancel</Button>
                <Button onClick={saveProfile} loading={profileState === "saving"} loadingText="Saving…">Save Profile</Button>
              </div>
            </div>
          </Card>

          <Card id="sec-security" className="scroll-mt-24">
            <CardHeader title="Security & Authentication" subtitle="Protect your account and manage sign-in security." />
            <div className="divide-y divide-line px-5 pb-2">
              <SecurityRow icon={<ShieldCheck />} title="Two-Factor Authentication" sub="Add an extra layer of security to your account." badge={form.twoFactor ? <Badge tone="success">Enabled</Badge> : <Badge tone="warning">Off</Badge>} action={<Button variant="secondary" size="sm" onClick={() => setTwoFaOpen(true)}>Manage</Button>} />
              <SecurityRow icon={<Lock />} title="Password" sub={form.passwordChangedDaysAgo === 0 ? "Changed just now" : `Last changed ${form.passwordChangedDaysAgo} days ago`} action={<Button variant="secondary" size="sm" onClick={() => { setPw({ current: "", next: "", confirm: "" }); setPwErr({}); setPwState("idle"); setPwOpen(true); }}>Change Password</Button>} />
              <SecurityRow icon={<Laptop />} title="Active Sessions" sub={`${sessions.data?.length ?? 3} active sessions on your account`} action={<Button variant="secondary" size="sm" onClick={() => setSessionsOpen(true)}>View Sessions</Button>} />
              <div id="sec-api" className="scroll-mt-24">
                <SecurityRow icon={<KeyRound />} title="API Access" sub="Manage API tokens and access permissions." action={<Button variant="secondary" size="sm" onClick={() => setApiOpen(true)}>Manage API Keys</Button>} />
              </div>
            </div>
          </Card>

          <Card id="sec-notifications" className="scroll-mt-24">
            <CardHeader title="Notification Preferences" subtitle="Choose which updates you want to receive." />
            <div className="divide-y divide-line px-5">
              <Toggle label="Service & Server Alerts" description="Alerts about server status, downtime, and resource usage." checked={form.notifications.serverAlerts} onChange={(v) => void savePrefs({ notifications: { ...form.notifications, serverAlerts: v } }, true)} />
              <Toggle label="Billing Notifications" description="Invoices, payment changes, and billing reminders." checked={form.notifications.billing} onChange={(v) => void savePrefs({ notifications: { ...form.notifications, billing: v } }, true)} />
              <Toggle label="Security Notifications" description="New logins, password changes, and security events." checked={form.notifications.security} onChange={(v) => void savePrefs({ notifications: { ...form.notifications, security: v } }, true)} />
              <Toggle label="Product Updates & News" description="New features, platform updates, and announcements." checked={form.notifications.product} onChange={(v) => void savePrefs({ notifications: { ...form.notifications, product: v } }, true)} />
            </div>
            <p className="mx-5 mb-5 mt-2 rounded-lg bg-brand-50/70 px-3 py-2.5 text-xs text-slate-600">Critical security and service alerts may still be sent to help protect your account.</p>
          </Card>

          <Card id="sec-preferences" className="scroll-mt-24">
            <CardHeader title="Regional Preferences" subtitle="Set the default language, time zone, and display format." />
            <div className="space-y-4 p-5">
              {prefState === "saved" ? <FormAlert tone="success" title="Preferences saved" /> : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Language" htmlFor="r-lang"><Select id="r-lang" value={form.regional.language} onChange={(e) => { setPrefState("idle"); setForm({ ...form, regional: { ...form.regional, language: e.target.value } }); }}>{["English (United States)", "English (United Kingdom)", "اردو (Urdu)", "Deutsch", "Español"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
                <Field label="Time Zone" htmlFor="r-tz"><Select id="r-tz" value={form.regional.timezone} onChange={(e) => { setPrefState("idle"); setForm({ ...form, regional: { ...form.regional, timezone: e.target.value } }); }}>{["UTC+05:00 — Karachi", "UTC±00:00 — London", "UTC−05:00 — New York", "UTC+01:00 — Berlin", "UTC+08:00 — Singapore"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
                <Field label="Date Format" htmlFor="r-date"><Select id="r-date" value={form.regional.dateFormat} onChange={(e) => { setPrefState("idle"); setForm({ ...form, regional: { ...form.regional, dateFormat: e.target.value } }); }}>{["MMM DD, YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
                <Field label="Display Currency" htmlFor="r-cur"><Select id="r-cur" value={form.regional.currency} onChange={(e) => { setPrefState("idle"); setForm({ ...form, regional: { ...form.regional, currency: e.target.value } }); }}>{["USD — US Dollar", "EUR — Euro", "GBP — British Pound", "PKR — Pakistani Rupee"].map((o) => <option key={o}>{o}</option>)}</Select></Field>
              </div>
              <div className="flex justify-end"><Button onClick={() => void savePrefs({ regional: form.regional })} loading={prefState === "saving"} loadingText="Saving…">Save Preferences</Button></div>
            </div>
          </Card>

          <Card className="border-red-200">
            <CardHeader title={<span className="text-red-600">Danger Zone</span>} subtitle="Actions that affect your account permanently." />
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs text-slate-500">Account closure may permanently remove access to your services and account information. Review your active services and billing before proceeding.</p>
              <Button variant="danger-outline" onClick={() => setCloseOpen(true)}>Request Account Closure</Button>
            </div>
          </Card>
          <p className="text-center text-xs text-slate-400">Northstar Cloud · Account Settings</p>
        </div>
      </div>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change password" description="Use at least 8 characters with a mix of letters and numbers." size="sm"
        footer={pwState === "saved" ? <Button onClick={() => setPwOpen(false)}>Done</Button> : <><Button variant="secondary" onClick={() => setPwOpen(false)}>Cancel</Button><Button onClick={changePassword} loading={pwState === "saving"} loadingText="Updating…">Update password</Button></>}>
        {pwState === "saved" ? <FormAlert tone="success" title="Password updated">Demo note: the demo login keeps using customer111.</FormAlert> : (
          <div className="space-y-4">
            <Field label="Current password" htmlFor="pw-cur" error={pwErr.current} hint="Demo: customer111"><PasswordInput id="pw-cur" value={pw.current} invalid={!!pwErr.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" /></Field>
            <Field label="New password" htmlFor="pw-new" error={pwErr.next}><PasswordInput id="pw-new" value={pw.next} invalid={!!pwErr.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
            <Field label="Confirm new password" htmlFor="pw-conf" error={pwErr.confirm}><PasswordInput id="pw-conf" value={pw.confirm} invalid={!!pwErr.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
          </div>
        )}
      </Modal>

      <ConfirmModal open={twoFaOpen} onClose={() => setTwoFaOpen(false)} tone={form.twoFactor ? "danger" : "primary"}
        title={form.twoFactor ? "Turn off two-factor authentication?" : "Turn on two-factor authentication?"}
        confirmLabel={form.twoFactor ? "Turn off" : "Turn on"}
        message={form.twoFactor ? "Your account will be protected by your password only. We recommend keeping 2FA on." : "You'll be asked for a code from your authenticator app when you sign in (setup screen comes from the backend)."}
        onConfirm={async () => { await savePrefs({ twoFactor: !form.twoFactor }, true); setTwoFaOpen(false); }} />

      <Modal open={sessionsOpen} onClose={() => setSessionsOpen(false)} title="Active sessions" description="Devices currently signed in to your account." footer={<Button onClick={() => setSessionsOpen(false)}>Close</Button>}>
        <ul className="divide-y divide-line">
          {sessions.data?.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-500">{s.device.includes("iPhone") ? <Smartphone className="size-4" /> : <Laptop className="size-4" />}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-900">{s.device} {s.current ? <Badge tone="success" className="ml-1">This device</Badge> : null}</p>
                <p className="text-xs text-slate-500">{s.location} · {s.lastActive}</p>
              </div>
              {!s.current ? <Button variant="danger-outline" size="xs" onClick={async () => { await api.customer.revokeSession(s.id); toast({ tone: "success", title: "Session signed out", message: s.device }); }}>Sign out</Button> : null}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={apiOpen} onClose={() => setApiOpen(false)} title="API keys" footer={<Button onClick={() => setApiOpen(false)}>Close</Button>}>
        <FormAlert tone="info" title="Created by the backend">API tokens are generated and stored by the NestJS API and shown only once. The browser never stores them.</FormAlert>
        <p className="mt-4 text-[13px] text-slate-600">You have no API tokens yet. Token management becomes available when the API is connected.</p>
      </Modal>

      <ConfirmModal open={closeOpen} onClose={() => setCloseOpen(false)} loading={closing} title="Request account closure?" confirmLabel="Send closure request"
        message="This sends a request to our team. Nothing is deleted until we confirm with you by email and your active services are cancelled."
        onConfirm={async () => {
          setClosing(true);
          const res = await api.customer.requestAccountClosure();
          setClosing(false);
          setCloseOpen(false);
          toast({ tone: "pending", title: "Closure request received", message: res.message });
        }} />
    </div>
  );
}
