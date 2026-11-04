"use client";

import { useRef, useState, type FormEvent } from "react";
import { Copy, KeyRound, Lock, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import type { SshKey } from "@/types";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { pad2, shortDate } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ConfirmModal } from "@/components/ui/Modal";
import { Menu } from "@/components/ui/Menu";
import { RowsSkeleton, StatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState, FormAlert } from "@/components/ui/States";
import { Table, Td, Th, THead, Tr } from "@/components/ui/Table";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/panel/PageHeader";

const keyRe = /^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp(256|384|521))\s+[A-Za-z0-9+/=]{20,}(\s+.*)?$/;

export function SshKeys() {
  const toast = useToast();
  const keys = useApi(() => api.customer.sshKeys(), []);
  const formRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", type: "ED25519" as SshKey["type"], publicKey: "" });
  const [errors, setErrors] = useState<{ name?: string; publicKey?: string }>({});
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [toDelete, setToDelete] = useState<SshKey | null>(null);
  const [deleting, setDeleting] = useState(false);

  const list = keys.data ?? [];
  const inUse = list.filter((k) => k.linkedServers > 0).length;

  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => nameRef.current?.focus(), 350);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().length < 2) errs.name = "Give the key a name, e.g. My Laptop Key.";
    if (!keyRe.test(form.publicKey.trim())) errs.publicKey = form.publicKey.includes("PRIVATE KEY") ? "This looks like a PRIVATE key. Never paste private keys — use the .pub file." : "Paste a valid public key starting with ssh-ed25519, ssh-rsa or ecdsa-sha2-…";
    else if (form.type === "RSA" && !form.publicKey.trim().startsWith("ssh-rsa")) errs.publicKey = "The key type is RSA but the key is not an ssh-rsa key.";
    else if (form.type === "ED25519" && !form.publicKey.trim().startsWith("ssh-ed25519")) errs.publicKey = "The key type is ED25519 but the key is not an ssh-ed25519 key.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }
    setState("saving");
    try {
      const k = await api.customer.addSshKey(form);
      setState("saved");
      setMessage(`“${k.name}” was added. You can now attach it when deploying a server.`);
      setForm({ name: "", type: "ED25519", publicKey: "" });
    } catch (err) {
      setState("error");
      if (err instanceof ApiError && err.field === "name") setErrors({ name: err.message });
      setMessage(err instanceof ApiError ? err.message : "The key could not be added.");
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.customer.removeSshKey(toDelete.id);
      toast({ tone: "success", title: "SSH key deleted", message: `${toDelete.name} was removed.` });
      setToDelete(null);
    } catch (err) {
      toast({ tone: "error", title: "Key not deleted", message: err instanceof ApiError ? err.message : "Please try again." });
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="SSH Keys" subtitle="Manage secure SSH authentication keys for your cloud servers." actions={<Button icon={<Plus />} onClick={focusForm}>Add SSH Key</Button>} />

      <div className="mb-4 flex gap-3 rounded-xl border border-brand-100 bg-brand-50/70 p-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700"><Lock className="size-4" /></span>
        <div>
          <p className="text-[13px] font-semibold text-slate-900">Secure access to your servers</p>
          <p className="mt-0.5 text-xs text-slate-600">SSH keys provide a secure way to authenticate with your instances. Add your public key here and attach it when deploying a server. Never upload or share your private key.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {keys.loading ? <StatSkeleton count={3} /> : (
          <>
            <StatCard label="Total SSH Keys" value={pad2(list.length)} />
            <StatCard label="Keys In Use" value={pad2(inUse)} />
            <StatCard label="Unused Keys" value={pad2(list.length - inUse)} />
          </>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Your SSH Keys" action={<span className="text-xs text-slate-400">{list.length} keys</span>} />
        <div className="mt-4">
          {keys.loading ? <RowsSkeleton rows={4} cols={6} /> : keys.error ? <ErrorState onRetry={keys.reload} /> : list.length === 0 ? (
            <EmptyState icon={<KeyRound />} title="No SSH keys yet" message="Add your first public key to log in to servers securely." action={<Button size="sm" icon={<Plus />} onClick={focusForm}>Add SSH Key</Button>} />
          ) : (
            <Table label="SSH keys" minWidth={820}>
              <THead>
                <Th>Key name</Th>
                <Th>Fingerprint</Th>
                <Th>Linked servers</Th>
                <Th>Created</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </THead>
              <tbody>
                {list.map((k) => (
                  <Tr key={k.id}>
                    <Td>
                      <p className="font-semibold text-slate-900">{k.name}</p>
                      <p className="text-[11px] text-slate-400">{k.type}{k.bits ? ` · ${k.bits} bit` : ""}</p>
                    </Td>
                    <Td>
                      <span className="inline-flex items-center gap-1 font-mono text-xs" title={k.fingerprint}>
                        {k.fingerprint.slice(0, 13)}…{k.fingerprint.slice(-4)}
                        <CopyButton value={k.fingerprint} label="Copy fingerprint" />
                      </span>
                    </Td>
                    <Td>{k.linkedServers} {k.linkedServers === 1 ? "server" : "servers"}</Td>
                    <Td>{shortDate(k.createdAt)}</Td>
                    <Td><StatusBadge status={k.linkedServers ? "in_use" : "unused"} /></Td>
                    <Td className="text-right">
                      <Menu
                        label={`Actions for ${k.name}`}
                        trigger={({ toggle, open }) => (
                          <button type="button" onClick={toggle} aria-expanded={open} className="grid size-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50" aria-label={`Actions for ${k.name}`}>
                            <MoreHorizontal className="size-4" />
                          </button>
                        )}
                        items={[
                          { label: "Copy fingerprint", icon: <Copy />, onSelect: () => { void navigator.clipboard?.writeText(k.fingerprint); toast({ tone: "success", title: "Fingerprint copied" }); } },
                          { label: "Delete key", icon: <Trash2 />, danger: true, onSelect: () => setToDelete(k) },
                        ]}
                      />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
          <div className="flex items-center justify-between px-5 py-3.5 text-xs text-slate-500">
            <span>Showing {list.length} SSH keys</span>
            <Button variant="secondary" size="sm" onClick={focusForm}>Manage Keys</Button>
          </div>
        </div>
      </Card>

      <div ref={formRef} className="scroll-mt-24">
        <Card className="mt-4">
          <CardHeader title="Add a New SSH Key" subtitle="Register a public key to use when deploying or configuring servers." />
          <form onSubmit={submit} noValidate className="space-y-4 px-5 pb-5 pt-5">
            {state === "saved" ? <FormAlert tone="success" title="SSH key added">{message}</FormAlert> : null}
            {state === "error" ? <FormAlert tone="error" title="Key not added">{message}</FormAlert> : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Key Name" htmlFor="key-name" error={errors.name}>
                <Input ref={nameRef} id="key-name" placeholder="e.g. My Laptop Key" value={form.name} invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Key Type" htmlFor="key-type">
                <Select id="key-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as SshKey["type"] })}>
                  <option value="ED25519">ED25519</option>
                  <option value="RSA">RSA</option>
                  <option value="ECDSA">ECDSA</option>
                </Select>
              </Field>
            </div>
            <Field label="Public Key" htmlFor="key-public" error={errors.publicKey} hint="Paste only your public key. Do not paste a private key or secret credential.">
              <Textarea id="key-public" rows={4} className="font-mono text-xs" placeholder="Paste your SSH public key here (ssh-ed25519 or ssh-rsa …)" value={form.publicKey} invalid={!!errors.publicKey} onChange={(e) => setForm({ ...form, publicKey: e.target.value })} spellCheck={false} />
            </Field>
            <div className="flex gap-2">
              <Button type="submit" loading={state === "saving"} loadingText="Adding key…">Add Public Key</Button>
              <Button variant="secondary" onClick={() => { setForm({ name: "", type: "ED25519", publicKey: "" }); setErrors({}); setState("idle"); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      </div>

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        loading={deleting}
        title={`Delete “${toDelete?.name}”?`}
        confirmLabel="Delete key"
        message={toDelete?.linkedServers ? `This key is linked to ${toDelete.linkedServers} server(s). Detach it from those servers first, otherwise the request will be refused.` : "Servers deployed later will not be able to use this key. This cannot be undone."}
      />
    </div>
  );
}
