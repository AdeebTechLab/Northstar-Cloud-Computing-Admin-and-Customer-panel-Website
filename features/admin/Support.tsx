"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SupportTicket, TicketStatus } from "@/types";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const priorityColor = { low: "text-slate-500", medium: "text-amber-600", high: "text-orange-600", urgent: "text-red-600" };
const tabs: { id: "all" | TicketStatus; label: string }[] = [
  { id: "all", label: "All tickets" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

/** Admin support queue (not in the Figma file — built with the same components). */
export function AdminSupport() {
  const toast = useToast();
  const tickets = useApi(() => api.admin.tickets(), []);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<SupportTicket | null>(null);
  const [newStatus, setNewStatus] = useState<TicketStatus>("open");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const list = tickets.data ?? [];
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((x) => (tab === "all" || x.status === tab) && (!t || `${x.id} ${x.subject} ${x.customerName} ${x.context}`.toLowerCase().includes(t)));
  }, [list, tab, q]);
  const paged = usePaged(filtered, page, 6);

  return (
    <div>
      <PageHeader title="Support Tickets" subtitle="Respond to customer requests and keep the queue moving." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tickets.loading ? <StatSkeleton /> : (
          <>
            <StatCard label="Open" value={list.filter((t) => t.status === "open").length} sub="Waiting for a first reply" subTone="warning" />
            <StatCard label="In Progress" value={list.filter((t) => t.status === "in_progress").length} sub="Assigned to the team" subTone="brand" />
            <StatCard label="Resolved" value={list.filter((t) => t.status === "resolved").length} sub="Closed in the last 30 days" subTone="success" />
            <StatCard label="Avg. First Response" value="2h 14m" sub="Sample data" />
          </>
        )}
      </div>

      <Card className="mt-4">
        <div className="flex flex-col gap-3 border-b border-line px-5 pt-4 md:flex-row md:items-end md:justify-between">
          <div role="tablist" aria-label="Ticket status" className="flex gap-5 overflow-x-auto text-[13px]">
            {tabs.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => { setTab(t.id); setPage(1); }} className={cn("-mb-px shrink-0 border-b-2 pb-3 font-medium transition-colors", tab === t.id ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-800")}>
                {t.label} <span className="ml-1 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-500">{t.id === "all" ? list.length : list.filter((x) => x.status === t.id).length}</span>
              </button>
            ))}
          </div>
          <div className="pb-3 md:w-72"><Input leading={<Search />} placeholder="Search tickets or customers" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search tickets" className="h-9" /></div>
        </div>
        {tickets.loading ? <RowsSkeleton rows={6} cols={6} /> : filtered.length === 0 ? <EmptyState title="No tickets here" message="Nothing matches this filter right now." /> : (
          <>
            <Table label="Support tickets" minWidth={900}>
              <THead><Th>Ticket</Th><Th>Customer</Th><Th>Category</Th><Th>Updated</Th><Th>Priority</Th><Th>Status</Th><Th className="text-right">Action</Th></THead>
              <tbody>
                {paged.slice.map((t) => (
                  <Tr key={t.id}>
                    <Td><p className="font-semibold text-slate-900">{t.subject}</p><p className="text-[11px] text-slate-400">{t.id} · {t.context}</p></Td>
                    <Td><p className="font-medium text-slate-800">{t.customerName}</p><p className="text-[11px] text-slate-400">{t.customerEmail}</p></Td>
                    <Td>{t.category}</Td>
                    <Td>{shortDate(t.updatedAt)}</Td>
                    <Td className={cn("font-semibold capitalize", priorityColor[t.priority])}>{t.priority}</Td>
                    <Td><StatusBadge status={t.status} /></Td>
                    <Td className="text-right"><Button variant="secondary" size="xs" onClick={() => { setViewing(t); setNewStatus(t.status); setReply(""); setSaved(false); }}>Open</Button></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${filtered.length} tickets`} />
          </>
        )}
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`${viewing?.id} · ${viewing?.subject}`} description={`${viewing?.customerName} · ${viewing?.category}`} size="lg"
        footer={saved ? <Button onClick={() => setViewing(null)}>Done</Button> : <><Button variant="secondary" onClick={() => setViewing(null)}>Cancel</Button><Button loading={saving} loadingText="Saving…" onClick={async () => {
          if (!viewing) return;
          setSaving(true);
          await api.admin.updateTicketStatus(viewing.id, newStatus);
          setSaving(false);
          setSaved(true);
          toast({ tone: "success", title: "Ticket updated", message: `${viewing.id} is now ${newStatus.replace("_", " ")}.` });
        }}>Save &amp; reply</Button></>}>
        {saved ? <FormAlert tone="success" title="Ticket updated">{reply.trim() ? "Your reply was queued for email delivery by the backend." : "The status was changed."}</FormAlert> : viewing ? (
          <div className="space-y-4 text-[13px]">
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Customer message</p><p className="mt-1 text-slate-700">{viewing.description ?? `Help needed with ${viewing.context}.`}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status" htmlFor="at-status"><Select id="at-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value as TicketStatus)}><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></Select></Field>
              <Field label="Priority"><p className={cn("flex h-10 items-center font-semibold capitalize", priorityColor[viewing.priority])}>{viewing.priority}</p></Field>
            </div>
            <Field label="Reply to customer (optional)" htmlFor="at-reply"><Textarea id="at-reply" rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" /></Field>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
