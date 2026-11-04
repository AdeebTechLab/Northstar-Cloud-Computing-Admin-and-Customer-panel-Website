"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, PasswordInput } from "@/components/ui/Field";
import { FormAlert } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { Divider, GoogleButton } from "./AuthShell";

type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function RegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const pwScore = useMemo(() => strength(form.password), [form.password]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid work email, like you@company.com.";
    if (form.password.length < 8) errs.password = "Use at least 8 characters.";
    if (!form.terms) errs.terms = "Please accept the Terms of Service and Privacy Policy.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState("error");
      setMessage("Please fix the highlighted fields to continue.");
      return;
    }
    setState("loading");
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setState("success");
      setMessage("Your account is ready. Opening your dashboard…");
      window.setTimeout(() => router.push("/dashboard"), 900);
    } catch (err) {
      setState("error");
      if (err instanceof ApiError && err.field === "email") setErrors({ email: err.message });
      setMessage(err instanceof ApiError ? err.message : "We couldn't create your account. Please try again.");
    }
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Create your account</p>
      <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900 sm:text-[32px]">
        Get started for <span className="text-indigo-500">free.</span>
      </h1>
      <p className="mt-2 text-sm text-slate-500">Create your Northstar Cloud account and launch your first project.</p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-4">
        {state === "error" ? <FormAlert tone="error" title="Account not created">{message}</FormAlert> : null}
        {state === "success" ? <FormAlert tone="success" title="Welcome to Northstar Cloud!">{message}</FormAlert> : null}
        <Field label="Full name" htmlFor="reg-name" error={errors.name}>
          <Input id="reg-name" autoComplete="name" placeholder="e.g. Alex Morgan" value={form.name} invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Work email" htmlFor="reg-email" error={errors.email}>
          <Input id="reg-email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Create password" htmlFor="reg-password" error={errors.password}>
          <PasswordInput id="reg-password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} invalid={!!errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {form.password ? (
            <div className="mt-2 flex items-center gap-2" aria-live="polite">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < pwScore ? (pwScore <= 1 ? "bg-red-400" : pwScore === 2 ? "bg-amber-400" : "bg-emerald-500") : "bg-slate-200")} />
                ))}
              </div>
              <span className="w-12 text-right text-[11px] font-medium text-slate-500">{["Weak", "Weak", "Fair", "Good", "Strong"][pwScore]}</span>
            </div>
          ) : null}
        </Field>
        <div>
          <Checkbox
            checked={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
            label={
              <>
                I agree to the <Link href="/legal#terms" className="font-semibold text-brand-600 hover:underline">Terms of Service</Link> and{" "}
                <Link href="/legal#privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</Link>.
              </>
            }
          />
          {errors.terms ? <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{errors.terms}</p> : null}
        </div>
        <Button type="submit" size="lg" className="w-full shadow-lg shadow-brand-600/25" loading={state === "loading"} loadingText="Creating account…" iconRight={<ArrowRight />} disabled={state === "success"}>
          Create account
        </Button>
      </form>
      <Divider label="Or continue with" />
      <GoogleButton onClick={() => toast({ tone: "info", title: "Google sign-up", message: "Social sign-up needs the NestJS backend. Use the form for the demo." })} />
      <p className="mt-6 text-center text-[13px] text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
