"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Download, Plus, Search } from "lucide-react";
import type { AdminTransaction } from "@/types";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useQueryParam } from "@/hooks/useQueryParam";
import { downloadCsv } from "@/lib/csv";
import { money, money0, number, shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select, Toggle } from "@/components/ui/Field";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { BlockSkeleton, RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Pagination, usePaged } from "@/components/ui/Pagination";
import { BarChart } from "@/components/charts/Charts";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

export function AdminBilling() {
  const toast = useToast();
  const tx = useApi(() => api.admin.transactions(), []);
  const overview = useApi(() => api.admin.overview(), [], { live: false });
  const customers = useApi(() => api.admin.customers(), [], { live: false });
  const initialQ = useQueryParam("q");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminTransaction | null>(null);
  const [refund, setRefund] = useState<AdminTransaction | null>(null);
  const [refunding, setRefunding] = useState(false);
  const [invOpen, setInvOpen] = useState(false);
  const [inv, setInv] = useState({ customer: "", amount: "", description: "" });
  const [invErr, setInvErr] = useState<{ customer?: string; amount?: string }>({});
  const [invState, setInvState] = useState<"idle" | "sending" | "done">("idle");
  const [cfgOpen, setCfgOpen] = useState(false);
  const [cfg, setCfg] = useState({ currency: "USD ($)", cycle: "Monthly", autoInvoice: true, retries: "3" });
  const [cfgDraft, setCfgDraft] = useState(cfg);

  useEffect(() => { if (initialQ) setQ(initialQ); }, [initialQ]);

  const list = tx.data ?? [];
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((x) => (!t || `${x.id} ${x.customer} ${x.email}`.toLowerCase().includes(t)) && (status === "all" || x.status === status) && (method === "all" || x.method.toLowerCase().startsWith(method)));
  }, [list, q, status, method]);
  const paged = usePaged(filtered, page, 5);

  const createInvoice = async () => {
    const e: typeof invErr = {};
    if (!inv.customer) e.customer = "Choose a customer.";
    if (!(Number(inv.amount) > 0)) e.amount = "Enter an amount above $0.";
    setInvErr(e);
    if (Object.keys(e).length) return;
    setInvState("sending");
    await new Promise((r) => setTimeout(r, 900));
    setInvState("done");
  };

  return (
    <div>
      <PageHeader title="Billing & Payments" subtitle="Track revenue, customer payments, invoices, and refunds." actions={<Button icon={<Plus />} onClick={() => { setInv({ customer: "", amount: "", description: "" }); setInvErr({}); setInvState("idle"); setInvOpen(true); }}>Create Invoice</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tx.loading ? <StatSkeleton /> : (
          <>
            <StatCard label="Total Revenue" value={money0(84290)} sub="↑ 12.6% vs. last month" subTone="success" />
            <StatCard label="Successful Payments" value={number(3842)} sub="↑ 6.4% this month" subTone="success" />
            <StatCard label="Pending Payments" value={money0(2480)} sub="18 payments awaiting" subTone="warning" />
            <StatCard label="Failed Transactions" value={26} sub="Requires review" subTone="danger" />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {overview.loading || !overview.data ? <BlockSkeleton /> : (
          <Card>
            <CardHeader title="Revenue Overview" subtitle="Monthly payments collected" />
            <div className="px-5 pb-5 pt-6">
              <BarChart data={overview.data.revenue} format={(v) => money0(v)} height={160} />
              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500"><span className="size-2 rounded-sm bg-brand-600" /> Revenue collected · USD</p>
            </div>
          </Card>
        )}
        <Card>
          <CardHeader title="Payment Summary" subtitle="Transaction status breakdown" />
          <dl className="divide-y divide-line px-5 pb-2 pt-2 text-[13px]">
            {[["Successful", "3,842", "bg-emerald-500"], ["Pending", "18", "bg-amber-500"], ["Failed", "26", "bg-red-500"]].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between py-3"><dt className="flex items-center gap-2 text-slate-600"><span className={`size-2 rounded-full ${c}`} />{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
            ))}
            <div className="flex justify-between py-3"><dt className="text-slate-500">Refunds this month</dt><dd className="font-semibold text-slate-900">$1,240</dd></div>
          </dl>
        </Card>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-72"><Input leading={<Search />} placeholder="Search invoice or customer" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search transactions" /></div>
        <div className="grid grid-cols-2 gap-3 md:flex">
          <div className="md:w-40"><Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status"><option value="all">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option></Select></div>
          <div className="md:w-40"><Select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} aria-label="Payment method"><option value="all">All methods</option><option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="paypal">PayPal</option></Select></div>
        </div>
        <Button variant="secondary" className="md:ml-auto" icon={<Download />} onClick={() => downloadCsv("transactions.csv", ["Invoice", "Transaction", "Customer", "Email", "Date", "Method", "Amount", "Status"], filtered.map((x) => [x.id, x.transactionId, x.customer, x.email, x.date, x.method, x.amount, x.status]))}>Export CSV</Button>
      </div>

      <Card className="mt-4">
        <CardHeader title="Recent Transactions" subtitle="Review payment history and transaction details." action={<Button variant="secondary" size="sm" onClick={() => { setQ(""); setStatus("all"); setMethod("all"); }}>View All Invoices</Button>} />
        <div className="mt-4">
          {tx.loading ? <RowsSkeleton rows={5} cols={7} /> : filtered.length === 0 ? <EmptyState title="No transactions match" message="Try a different search or filter." /> : (
            <>
              <Table label="Transactions" minWidth={900}>
                <THead><Th>Invoice</Th><Th>Customer</Th><Th>Date</Th><Th>Payment method</Th><Th>Amount</Th><Th>Status</Th><Th className="text-right">Action</Th></THead>
                <tbody>
                  {paged.slice.map((x) => (
                    <Tr key={x.id}>
                      <Td><p className="font-semibold text-slate-900">{x.id}</p><p className="text-[11px] text-slate-400">{x.transactionId}</p></Td>
                      <Td><p className="font-medium text-slate-800">{x.customer}</p><p className="text-[11px] text-slate-400">{x.email}</p></Td>
                      <Td>{shortDate(x.date)}</Td>
                      <Td>{x.method}</Td>
                      <Td className="font-semibold text-slate-900">{money(x.amount)}</Td>
                      <Td><StatusBadge status={x.status} /></Td>
                      <Td className="text-right"><Button variant="secondary" size="xs" iconRight={<ArrowUpRight />} onClick={() => setViewing(x)}>Details</Button></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <Pagination page={paged.page} pages={paged.pages} onChange={setPage} summary={`Showing ${paged.to - paged.from + 1} of ${filtered.length} transactions`} />
            </>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Billing Configuration" subtitle="Platform-wide billing preferences" />
          <dl className="divide-y divide-line px-5 text-[13px]">
            {[["Default currency", cfg.currency], ["Billing cycle", cfg.cycle], ["Automatic invoicing", cfg.autoInvoice ? "Enabled" : "Disabled"], ["Failed payment retries", `${cfg.retries} attempts`]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3"><dt className="text-slate-600">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
            ))}
          </dl>
          <div className="p-5 pt-3"><Button variant="secondary" size="sm" onClick={() => { setCfgDraft(cfg); setCfgOpen(true); }}>Edit Billing Settings</Button></div>
        </Card>
        <Card>
          <CardHeader title="Payment Issues" subtitle="Transactions that may need review" />
          <dl className="divide-y divide-line px-5 text-[13px]">
            {[["Failed transactions", "26", "text-red-600"], ["Overdue invoices", "14", "text-amber-600"], ["Refund requests", "9", "text-slate-900"]].map(([k, v, c]) => (
              <div key={k} className="flex justify-between py-3"><dt className="text-slate-600">{k}</dt><dd className={`font-semibold ${c}`}>{v}</dd></div>
            ))}
          </dl>
          <p className="m-5 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">Review failed payments and overdue invoices before taking action. Transaction and refund actions require a connected billing system.</p>
        </Card>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.id ?? ""} description={viewing?.transactionId}
        footer={<>{viewing?.status === "paid" ? <Button variant="danger-outline" onClick={() => setRefund(viewing)}>Issue refund</Button> : null}<Button variant="secondary" onClick={() => setViewing(null)}>Close</Button></>}>
        {viewing ? (
          <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
            {[["Customer", viewing.customer], ["Email", viewing.email], ["Date", shortDate(viewing.date)], ["Method", viewing.method], ["Amount", money(viewing.amount)]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-slate-500">{k}</dt><dd className="mt-0.5 font-semibold text-slate-900">{v}</dd></div>
            ))}
            <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={viewing.status} /></dd></div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmModal open={!!refund} onClose={() => setRefund(null)} loading={refunding} title={`Refund ${refund ? money(refund.amount) : ""} to ${refund?.customer}?`} confirmLabel="Request refund"
        message="The refund is sent to the payment gateway. It shows as pending until the gateway confirms it."
        onConfirm={async () => {
          setRefunding(true);
          await new Promise((r) => setTimeout(r, 900));
          setRefunding(false);
          setRefund(null);
          setViewing(null);
          toast({ tone: "pending", title: "Refund requested", message: "Waiting for payment gateway confirmation (demo)." });
        }} />

      <Modal open={invOpen} onClose={() => setInvOpen(false)} title="Create invoice" size="sm" footer={invState === "done" ? <Button onClick={() => setInvOpen(false)}>Done</Button> : <><Button variant="secondary" onClick={() => setInvOpen(false)}>Cancel</Button><Button onClick={createInvoice} loading={invState === "sending"} loadingText="Creating…">Create invoice</Button></>}>
        {invState === "done" ? <FormAlert tone="success" title="Invoice drafted">A {money(Number(inv.amount))} invoice was drafted for {customers.data?.find((c) => c.id === inv.customer)?.name}. The billing backend issues the final invoice number.</FormAlert> : (
          <div className="space-y-4">
            <Field label="Customer" htmlFor="ci-c" error={invErr.customer}><Select id="ci-c" value={inv.customer} invalid={!!invErr.customer} onChange={(e) => setInv({ ...inv, customer: e.target.value })}><option value="">Choose a customer</option>{customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
            <Field label="Amount (USD)" htmlFor="ci-a" error={invErr.amount}><Input id="ci-a" inputMode="decimal" value={inv.amount} invalid={!!invErr.amount} onChange={(e) => setInv({ ...inv, amount: e.target.value.replace(/[^\d.]/g, "") })} placeholder="0.00" /></Field>
            <Field label="Description" htmlFor="ci-d"><Input id="ci-d" value={inv.description} onChange={(e) => setInv({ ...inv, description: e.target.value })} placeholder="e.g. Extra bandwidth — October" /></Field>
          </div>
        )}
      </Modal>

      <Modal open={cfgOpen} onClose={() => setCfgOpen(false)} title="Billing settings" size="sm" footer={<><Button variant="secondary" onClick={() => setCfgOpen(false)}>Cancel</Button><Button onClick={() => { setCfg(cfgDraft); setCfgOpen(false); toast({ tone: "success", title: "Billing settings saved" }); }}>Save settings</Button></>}>
        <div className="space-y-4">
          <Field label="Default currency" htmlFor="bc-cur"><Select id="bc-cur" value={cfgDraft.currency} onChange={(e) => setCfgDraft({ ...cfgDraft, currency: e.target.value })}><option>USD ($)</option><option>EUR (€)</option><option>PKR (Rs)</option></Select></Field>
          <Field label="Failed payment retries" htmlFor="bc-retry"><Select id="bc-retry" value={cfgDraft.retries} onChange={(e) => setCfgDraft({ ...cfgDraft, retries: e.target.value })}>{["1", "2", "3", "4", "5"].map((n) => <option key={n}>{n}</option>)}</Select></Field>
          <div className="rounded-lg border border-line px-4"><Toggle label="Automatic invoicing" checked={cfgDraft.autoInvoice} onChange={(v) => setCfgDraft({ ...cfgDraft, autoInvoice: v })} /></div>
        </div>
      </Modal>
    </div>
  );
}
