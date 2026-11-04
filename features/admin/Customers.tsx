"use client";

import { useEffect, useMemo, useState } from "react";
import { Columns3, Download, Plus, Search, ArrowUpRight } from "lucide-react";
import type { AdminCustomer, CustomerStatus } from "@/types";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useCatalog } from "@/hooks/useCatalog";
import { useQueryParam } from "@/hooks/useQueryParam";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/cn";
import { number, shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Checkbox, Field, Input, Select } from "@/components/ui/Field";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Popover } from "@/components/ui/Menu";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const avatarColors = ["bg-brand-50 text-brand-700", "bg-emerald-50 text-emerald-700", "bg-violet-50 text-violet-700", "bg-orange-50 text-orange-700", "bg-rose-50 text-rose-700", "bg-sky-50 text-sky-700"];
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
type Col = "plan" | "servers" | "joined" | "status";

export function AdminCustomers() {
  const toast = useToast();
  const customers = useApi(() => api.admin.customers(), []);
  const { catalog, plan } = useCatalog();
  const initialQ = useQueryParam("q");
  const [q, setQ] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [cols, setCols] = useState<Record<Col, boolean>>({ plan: true, servers: true, joined: true, status: true });
  const [viewing, setViewing] = useState<AdminCustomer | null>(null);
  const [statusChange, setStatusChange] = useState<{ c: AdminCustomer; to: CustomerStatus } | null>(null);
  const [changing, setChanging] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newC, setNewC] = useState({ name: "", email: "", planId: "starter" });
  const [addErr, setAddErr] = useState<{ name?: string; email?: string }>({});
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState("");

  useEffect(() => {
    if (initialQ) setQ(initialQ);
  }, [initialQ]);

  const list = customers.data ?? [];
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((c) => (!t || `${c.name} ${c.email}`.toLowerCase().includes(t)) && (planFilter === "all" || c.planId === planFilter) && (status === "all" || c.status === status));
  }, [list, q, planFilter, status]);
  const paged = usePaged(filtered, page, 6);

  const addCustomer = async () => {
    const e: typeof addErr = {};
    if (newC.name.trim().length < 2) e.name = "Enter the customer's name.";
    if (!/^\S+@\S+\.\S+$/.test(newC.email)) e.email = "Enter a valid email address.";
    setAddErr(e);
    if (Object.keys(e).length) return;
    setAdding(true);
    try {
      const c = await api.admin.addCustomer(newC);
      setAdded(`${c.name} was added with status “Pending verification”. A welcome email is sent by the backend.`);
    } catch (err) {
      setAddErr({ email: err instanceof ApiError ? err.message : "Could not add customer." });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <PageHeader title="Customers" subtitle="Manage customer accounts, subscriptions, and access." actions={<Button icon={<Plus />} onClick={() => { setNewC({ name: "", email: "", planId: "starter" }); setAddErr({}); setAdded(""); setAddOpen(true); }}>Add Customer</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customers.loading ? <StatSkeleton /> : (
          <>
            <StatCard label="Total Customers" value={number(12846)} sub="↑ 8.2% this month" subTone="success" />
            <StatCard label="Active Accounts" value={number(11982)} sub={<span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500" /> 93.3% of customers</span>} subTone="success" />
            <StatCard label="Pending Verification" value={126} sub="Needs review" subTone="warning" />
            <StatCard label="Suspended Accounts" value={38} sub="Account restricted" subTone="danger" />
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-72"><Input leading={<Search />} placeholder="Search by name or email" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search customers" /></div>
        <div className="grid grid-cols-2 gap-3 md:flex">
          <div className="md:w-40"><Select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }} aria-label="Filter by plan"><option value="all">All plans</option>{catalog?.plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></div>
          <div className="md:w-40"><Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status"><option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></Select></div>
        </div>
        <Button variant="secondary" className="md:ml-auto" icon={<Download />} onClick={() => downloadCsv("customers.csv", ["Name", "Email", "Plan", "Active servers", "Joined", "Status"], filtered.map((c) => [c.name, c.email, plan(c.planId)?.name ?? c.planId, c.activeServers, c.joinedAt, c.status]))}>Export CSV</Button>
      </div>

      <Card className="mt-4">
        <CardHeader title="All Customers" subtitle={`Showing ${paged.from}–${paged.to} of ${number(filtered.length)} customers in this demo`} action={
          <Popover label="Manage columns" className="w-52 p-3" trigger={({ toggle }) => <Button variant="secondary" size="sm" icon={<Columns3 />} onClick={toggle}>Manage Columns</Button>}>
            {() => (
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Visible columns</p>
                {(Object.keys(cols) as Col[]).map((k) => (
                  <Checkbox key={k} label={{ plan: "Plan", servers: "Active servers", joined: "Joined date", status: "Status" }[k]} checked={cols[k]} onChange={(e) => setCols({ ...cols, [k]: e.target.checked })} />
                ))}
              </div>
            )}
          </Popover>
        } />
        <div className="mt-4">
          {customers.loading ? <RowsSkeleton rows={6} cols={6} /> : filtered.length === 0 ? <EmptyState title="No customers found" message="Try another name, email, plan or status." /> : (
            <>
              <Table label="Customers" minWidth={820}>
                <THead>
                  <Th>Customer</Th>
                  {cols.plan ? <Th>Plan</Th> : null}
                  {cols.servers ? <Th>Active servers</Th> : null}
                  {cols.joined ? <Th>Joined date</Th> : null}
                  {cols.status ? <Th>Status</Th> : null}
                  <Th className="text-right">Action</Th>
                </THead>
                <tbody>
                  {paged.slice.map((c, i) => (
                    <Tr key={c.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold", avatarColors[i % avatarColors.length])}>{initials(c.name)}</span>
                          <div><p className="font-semibold text-slate-900">{c.name}</p><p className="text-[11px] text-slate-400">{c.email}</p></div>
                        </div>
                      </Td>
                      {cols.plan ? <Td>{plan(c.planId)?.name}</Td> : null}
                      {cols.servers ? <Td>{c.activeServers}</Td> : null}
                      {cols.joined ? <Td>{shortDate(c.joinedAt)}</Td> : null}
                      {cols.status ? <Td><StatusBadge status={c.status} /></Td> : null}
                      <Td className="text-right"><Button variant="secondary" size="xs" iconRight={<ArrowUpRight />} onClick={() => setViewing(c)}>View Details</Button></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${filtered.length} results`} />
            </>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent Customer Activity" />
          <ul className="divide-y divide-line px-5 pb-3 pt-2 text-[13px]">
            {[["New account created", "Olivia Martin · Business plan", "5 min ago"], ["Plan upgraded", "James Wilson · Starter to Professional", "1 hour ago"], ["Email verification pending", "Sophia Chen · New registration", "2 hours ago"]].map(([t, s, w]) => (
              <li key={t} className="flex justify-between gap-3 py-3"><div><p className="font-semibold text-slate-900">{t}</p><p className="text-xs text-slate-500">{s}</p></div><span className="shrink-0 text-[11px] text-slate-400">{w}</span></li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Account Management" subtitle="Review account activity and customer access from one place." />
          <div className="p-5"><div className="rounded-lg bg-brand-50/70 p-4 text-[13px]"><p className="font-semibold text-brand-800">Admin tip</p><p className="mt-1 text-slate-600">Review pending verification requests and confirm account details before changing customer access.</p></div></div>
        </Card>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name ?? ""} description={viewing?.email} footer={viewing ? (
        <>
          {viewing.status === "pending" ? <Button variant="secondary" onClick={() => setStatusChange({ c: viewing, to: "active" })}>Verify account</Button> : null}
          {viewing.status === "suspended" ? <Button onClick={() => setStatusChange({ c: viewing, to: "active" })}>Reactivate</Button> : <Button variant="danger-outline" onClick={() => setStatusChange({ c: viewing, to: "suspended" })}>Suspend account</Button>}
          <Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>
        </>
      ) : null}>
        {viewing ? (
          <dl className="grid gap-4 text-[13px] sm:grid-cols-2">
            {[["Plan", plan(viewing.planId)?.name], ["Active servers", String(viewing.activeServers)], ["Joined", shortDate(viewing.joinedAt)], ["Customer ID", viewing.id]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-slate-500">{k}</dt><dd className="mt-0.5 font-semibold text-slate-900">{v}</dd></div>
            ))}
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={viewing.status} /></dd></div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmModal open={!!statusChange} onClose={() => setStatusChange(null)} loading={changing} tone={statusChange?.to === "suspended" ? "danger" : "primary"}
        title={statusChange?.to === "suspended" ? `Suspend ${statusChange?.c.name}?` : `Activate ${statusChange?.c.name}?`}
        confirmLabel={statusChange?.to === "suspended" ? "Suspend account" : "Activate account"}
        message={statusChange?.to === "suspended" ? "The customer loses dashboard access and their services may be paused according to the suspension policy." : "The customer regains full access to their account."}
        onConfirm={async () => {
          if (!statusChange) return;
          setChanging(true);
          await api.admin.setCustomerStatus(statusChange.c.id, statusChange.to);
          setChanging(false);
          toast({ tone: "success", title: "Customer updated", message: `${statusChange.c.name} is now ${statusChange.to}.` });
          setViewing((v) => (v ? { ...v, status: statusChange.to } : v));
          setStatusChange(null);
        }} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add customer" size="sm" footer={added ? <Button onClick={() => setAddOpen(false)}>Done</Button> : <><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={addCustomer} loading={adding} loadingText="Adding…">Add customer</Button></>}>
        {added ? <FormAlert tone="success" title="Customer added">{added}</FormAlert> : (
          <div className="space-y-4">
            <Field label="Full name" htmlFor="nc-name" error={addErr.name}><Input id="nc-name" value={newC.name} invalid={!!addErr.name} onChange={(e) => setNewC({ ...newC, name: e.target.value })} /></Field>
            <Field label="Email" htmlFor="nc-email" error={addErr.email}><Input id="nc-email" type="email" value={newC.email} invalid={!!addErr.email} onChange={(e) => setNewC({ ...newC, email: e.target.value })} /></Field>
            <Field label="Plan" htmlFor="nc-plan"><Select id="nc-plan" value={newC.planId} onChange={(e) => setNewC({ ...newC, planId: e.target.value })}>{catalog?.plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
