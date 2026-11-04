"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormAlert } from "@/components/ui/States";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm({ compact, onDone }: { compact?: boolean; onDone?: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", topic: "General question", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");
  const idp = compact ? "fc" : "cf";

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address, like you@company.com.";
    if (form.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
    return e;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setState("error");
      setServerError("");
      return;
    }
    setState("sending");
    try {
      const res = await api.public.sendContactMessage(form);
      setReference(res.reference);
      setState("sent");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="animate-fade-in">
        <FormAlert tone="success" title="Message sent — thank you!">
          We&apos;ve received your message (reference <b>{reference}</b>) and will reply to <b>{form.email}</b> within one business day.
        </FormAlert>
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setForm({ name: "", email: "", topic: "General question", message: "" });
              setState("idle");
            }}
          >
            Send another message
          </Button>
          {onDone ? (
            <Button variant="ghost" size="sm" onClick={onDone}>
              Close
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {state === "error" ? (
        <FormAlert tone="error" title={serverError ? "Message not sent" : "Please fix the highlighted fields"}>
          {serverError || "Some information is missing or not valid."}
        </FormAlert>
      ) : null}
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Your name" htmlFor={`${idp}-name`} error={errors.name} required>
          <Input id={`${idp}-name`} value={form.name} invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Morgan" autoComplete="name" aria-describedby={errors.name ? `${idp}-name-error` : undefined} />
        </Field>
        <Field label="Work email" htmlFor={`${idp}-email`} error={errors.email} required>
          <Input id={`${idp}-email`} type="email" value={form.email} invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" autoComplete="email" aria-describedby={errors.email ? `${idp}-email-error` : undefined} />
        </Field>
      </div>
      {!compact ? (
        <Field label="Topic" htmlFor={`${idp}-topic`}>
          <Select id={`${idp}-topic`} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
            <option>General question</option>
            <option>Sales &amp; pricing</option>
            <option>Technical support</option>
            <option>Billing</option>
            <option>Partnerships</option>
          </Select>
        </Field>
      ) : null}
      <Field label="Message" htmlFor={`${idp}-message`} error={errors.message} required hint={compact ? undefined : 'Demo tip: include the word "fail" to preview the error state.'}>
        <Textarea id={`${idp}-message`} rows={compact ? 3 : 5} value={form.message} invalid={!!errors.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" aria-describedby={errors.message ? `${idp}-message-error` : undefined} />
      </Field>
      <Button type="submit" loading={state === "sending"} loadingText="Sending…" iconRight={<Send />} className={compact ? "w-full" : undefined}>
        Send message
      </Button>
    </form>
  );
}
