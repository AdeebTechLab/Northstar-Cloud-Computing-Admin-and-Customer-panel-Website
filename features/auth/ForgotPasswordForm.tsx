"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { FormAlert } from "@/components/ui/States";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter the email address you signed up with.");
      return;
    }
    setError("");
    setState("loading");
    await api.auth.requestPasswordReset(email);
    setState("sent");
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Password help</p>
      <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">Reset your password</h1>
      <p className="mt-2 text-sm text-slate-500">Enter your email and we&apos;ll send you a link to choose a new password.</p>
      {state === "sent" ? (
        <div className="mt-7 space-y-4">
          <FormAlert tone="success" title="Check your inbox">
            If an account exists for <b>{email}</b>, a reset link is on its way. (Demo: no email is actually sent.)
          </FormAlert>
          <Button variant="secondary" onClick={() => setState("idle")}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          {error ? <FormAlert tone="error" title="Email needed">{error}</FormAlert> : null}
          <Field label="Email address" htmlFor="fp-email" error={error || undefined}>
            <Input id="fp-email" type="email" leading={<Mail />} placeholder="you@company.com" value={email} invalid={!!error} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={state === "loading"} loadingText="Sending link…">
            Send reset link
          </Button>
        </form>
      )}
      <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:underline">
        <ArrowLeft className="size-4" /> Back to login
      </Link>
    </div>
  );
}
