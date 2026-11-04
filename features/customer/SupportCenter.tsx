"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, DollarSign, Paperclip, Plus, Wrench, X } from "lucide-react";
import type { SupportTicket } from "@/types";
import { api, ApiError, type NewTicketInput } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/panel/PageHeader";
import { pad2 } from "@/lib/format";

const priorityColor = { low: "text-slate-500", medium: "text-amber-600", high: "text-orange-600", urgent: "text-red-600" };
const emptyForm = { category: "" as NewTicketInput["category"] | "", priority: "" as NewTicketInput["priority"] | "", subject: "", serverId: "", description: "" };

export function SupportCenter() {
  const tickets = useApi(() => api.customer.tickets(), []);
  const servers = useApi(() => api.customer.servers(), [], { live: false });
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<"category" | "priority" | "subject" | "description" | "file", string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [viewing, setViewing] = useState<SupportTicket | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = tickets.data ?? [];
  const paged = usePaged(list, page, showAll ? 50 : 4);

  const goToForm = (category?: NewTicketInput["category"]) => {
    if (category) setForm((f) => ({ ...f, category }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.category) errs.category = "Choose a category.";
    if (!form.priority) errs.priority = "Choose a priority.";
    if (form.subject.trim().length < 5) errs.subject = "Briefly describe your issue (5+ characters).";
    if (form.description.trim().length < 20) errs.description = "Add a few details so we can help faster (20+ characters).";
    if (file && file.size > 10 * 1024 * 1024) errs.file = "Files must be 10 MB or smaller.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState("error");
      setMsg("Please complete the highlighted fields.");
      return;
    }
    setState("sending");
    try {
      const t = await api.customer.createTicket({ category: form.category as NewTicketInput["category"], priority: form.priority as NewTicketInput["priority"], subject: form.subject, serverId: form.serverId || undefined, description: form.description, attachmentName: file?.name });
      setState("sent");
      setMsg(`Ticket ${t.id} was created. Our team will reply by email and here in the Support Center.`);
      setForm(emptyForm);
      setFile(null);
      setPage(1);
    } catch (err) {
      setState("error");
      setMsg(err instanceof ApiError ? err.message : "The ticket could not be submitted.");
    }
  };

  return (
    <div>
      <PageHeader crumbs={[{ label: "Workspace" }, { label: "Help & Support" }]} title="Support Center" subtitle="Get help with your servers, billing, and account. Our support team is here for you." actions={<Button icon={<Plus />} onClick={() => goToForm()}>Create New Ticket</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        {tickets.loading ? <StatSkeleton count={3} /> : (
          <>
            <StatCard label="Total Tickets" value={pad2(list.length + 6)} sub="All tickets submitted by you" />
            <StatCard label="Open Tickets" value={pad2(list.filter((t) => t.status !== "resolved").length)} sub="Awaiting support response" />
            <StatCard label="Resolved Tickets" value={pad2(list.filter((t) => t.status === "resolved").length + 6)} sub="Successfully resolved" />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { icon: <Wrench />, cls: "bg-brand-50 text-brand-600", title: "Technical Support", text: "Get assistance with server setup, connectivity, performance, and infrastructure.", cta: "Explore technical help", onClick: () => goToForm("Technical") },
          { icon: <DollarSign />, cls: "bg-violet-50 text-violet-600", title: "Billing & Payments", text: "Questions about invoices, account balance, payment methods, or charges.", cta: "Get billing assistance", onClick: () => goToForm("Billing") },
          { icon: <BookOpen />, cls: "bg-emerald-50 text-emerald-600", title: "Documentation", text: "Browse setup guides, API references, and common troubleshooting steps.", cta: "View documentation", href: "/docs" },
        ].map((c) => (
          <Card key={c.title} className="group p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop">
            <span className={cn("grid size-9 place-items-center rounded-lg [&_svg]:size-4", c.cls)}>{c.icon}</span>
            <p className="mt-4 text-[14px] font-semibold text-slate-900">{c.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.text}</p>
            {c.href ? (
              <Link href={c.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">{c.cta} <ArrowRight className="size-3.5" /></Link>
            ) : (
              <button type="button" onClick={c.onClick} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">{c.cta} <ArrowRight className="size-3.5" /></button>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-brand-100 bg-brand-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[14px] font-semibold text-slate-900">Need urgent assistance?</p>
          <p className="mt-0.5 text-xs text-slate-600">Submit a support ticket with the details of your issue, and our team can review it.</p>
        </div>
        <Button iconRight={<ArrowRight />} onClick={() => { setForm((f) => ({ ...f, priority: "urgent" })); goToForm(); }}>Contact Support</Button>
      </div>

      <Card className="mt-4">
        <CardHeader title="My Support Tickets" subtitle="Track the progress of your requests." action={<Button variant="secondary" size="sm" iconRight={<ArrowRight />} onClick={() => setShowAll((v) => !v)}>{showAll ? "Show fewer" : "View All Tickets"}</Button>} />
        <div className="mt-4">
          {tickets.loading ? <RowsSkeleton rows={4} cols={6} /> : list.length === 0 ? <EmptyState title="No tickets yet" message="When you contact support, your tickets appear here." /> : (
            <>
              <Table label="Support tickets" minWidth={820}>
                <THead><Th>Ticket ID</Th><Th>Subject</Th><Th>Category</Th><Th>Last updated</Th><Th>Status</Th><Th>Priority</Th></THead>
                <tbody>
                  {paged.slice.map((t) => (
                    <Tr key={t.id} className="cursor-pointer" onClick={() => setViewing(t)}>
                      <Td className="font-semibold text-slate-900">{t.id}</Td>
                      <Td><button type="button" className="text-left font-semibold text-slate-900 hover:text-brand-600" onClick={(e) => { e.stopPropagation(); setViewing(t); }}>{t.subject}</button><p className="text-[11px] text-slate-400">{t.context}</p></Td>
                      <Td>{t.category}</Td>
                      <Td>{shortDate(t.updatedAt)}</Td>
                      <Td><StatusBadge status={t.status} /></Td>
                      <Td className={cn("font-semibold capitalize", priorityColor[t.priority])}>{t.priority}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination variant="text" page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${paged.total} tickets`} />
            </>
          )}
        </div>
      </Card>

      <div ref={formRef} className="scroll-mt-24">
        <Card className="mt-4">
          <CardHeader title="Submit a Support Request" subtitle="Tell us what you need help with." />
          <form onSubmit={submit} noValidate className="space-y-4 p-5">
            {state === "sent" ? <FormAlert tone="success" title="Ticket submitted">{msg}</FormAlert> : null}
            {state === "error" ? <FormAlert tone="error" title="Ticket not submitted">{msg}</FormAlert> : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Request Category" htmlFor="t-cat" error={errors.category}>
                <Select id="t-cat" value={form.category} invalid={!!errors.category} onChange={(e) => setForm({ ...form, category: e.target.value as NewTicketInput["category"] })}>
                  <option value="">Select a category</option><option>Technical</option><option>Billing</option><option>Security</option><option>Account</option>
                </Select>
              </Field>
              <Field label="Priority" htmlFor="t-pri" error={errors.priority}>
                <Select id="t-pri" value={form.priority} invalid={!!errors.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as NewTicketInput["priority"] })}>
                  <option value="">Select a priority</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                </Select>
              </Field>
            </div>
            <Field label="Subject" htmlFor="t-sub" error={errors.subject}>
              <Input id="t-sub" placeholder="Briefly describe your issue" value={form.subject} invalid={!!errors.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </Field>
            <Field label="Related Server (Optional)" htmlFor="t-srv">
              <Select id="t-srv" value={form.serverId} onChange={(e) => setForm({ ...form, serverId: e.target.value })}>
                <option value="">No specific server</option>
                {servers.data?.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.ipAddresses[0]})</option>)}
              </Select>
            </Field>
            <Field label="Description" htmlFor="t-desc" error={errors.description}>
              <Textarea id="t-desc" rows={4} placeholder="Describe your issue and include any relevant details…" value={form.description} invalid={!!errors.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Attachment (Optional)" htmlFor="t-file" error={errors.file}>
              <input ref={fileRef} id="t-file" type="file" accept=".png,.jpg,.jpeg,.pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              {file ? (
                <div className="flex items-center justify-between rounded-lg border border-line bg-slate-50 px-3 py-2.5 text-[13px]">
                  <span className="flex items-center gap-2 truncate text-slate-700"><Paperclip className="size-4 text-slate-400" />{file.name} <span className="text-xs text-slate-400">({Math.ceil(file.size / 1024)} KB)</span></span>
                  <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Remove attachment"><X className="size-4" /></button>
                </div>
              ) : (
                <label htmlFor="t-file" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40">
                  <span className="flex items-center gap-1.5 text-[13px] text-slate-600"><Plus className="size-4" /> Attach screenshots or files</span>
                  <span className="mt-1 text-[11px] text-slate-400">PNG, JPG, PDF · Up to 10 MB</span>
                </label>
              )}
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setForm(emptyForm); setFile(null); setErrors({}); setState("idle"); }}>Cancel</Button>
              <Button type="submit" loading={state === "sending"} loadingText="Submitting…" iconRight={<ArrowRight />}>Submit Ticket</Button>
            </div>
          </form>
        </Card>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`${viewing?.id} · ${viewing?.subject}`} description={viewing ? `${viewing.category} · last updated ${shortDate(viewing.updatedAt)}` : undefined} footer={<Button onClick={() => setViewing(null)}>Close</Button>}>
        {viewing ? (
          <div className="space-y-4 text-[13px]">
            <div className="flex flex-wrap gap-2"><StatusBadge status={viewing.status} /><span className={cn("font-semibold capitalize", priorityColor[viewing.priority])}>{viewing.priority} priority</span></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Related to</p><p className="font-semibold text-slate-900">{viewing.context}</p></div>
            <div><p className="text-xs text-slate-500">Your message</p><p className="mt-1 leading-relaxed text-slate-700">{viewing.description ?? "No description provided."}</p></div>
            <div className="rounded-lg border border-line p-3"><p className="text-xs font-semibold text-brand-700">Northstar Support</p><p className="mt-1 text-slate-600">{viewing.status === "resolved" ? "This ticket has been resolved. Reply to reopen it." : "Thanks for reaching out — an engineer is reviewing your request."}</p></div>
          </div>
        ) : null}
      </Modal>
      <p className="mt-6 text-center text-xs text-slate-400">Northstar Cloud · Support Center</p>
    </div>
  );
}
