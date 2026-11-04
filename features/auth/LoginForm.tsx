"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, ShieldCheck, User } from "lucide-react";
import { ApiError } from "@/lib/api";
import { homeFor, useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, PasswordInput } from "@/components/ui/Field";
import { FormAlert } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { Divider, GoogleButton } from "./AuthShell";

const demo = [
  { label: "Admin panel", email: "northcloud99@gmail.com", password: "north111", icon: <ShieldCheck className="size-4" /> },
  { label: "Customer panel", email: "democustomer2@gmail.com", password: "customer111", icon: <User className="size-4" /> },
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { login, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Enter your password.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState("error");
      setMessage("Please fill in the highlighted fields.");
      return;
    }
    setState("loading");
    try {
      const u = await login(email, password, remember);
      setState("success");
      setMessage(`Signed in as ${u.name}. Taking you to the ${u.role === "admin" ? "admin console" : "customer panel"}…`);
      const next = params.get("next");
      const safeNext = next && next.startsWith(u.role === "admin" ? "/admin" : "/dashboard") ? next : homeFor(u.role);
      window.setTimeout(() => router.push(safeNext), 700);
    } catch (err) {
      setState("error");
      setMessage(err instanceof ApiError ? err.message : "Sign-in failed. Please try again.");
      setErrors({ password: " " });
    }
  };

  if (user && state !== "success") {
    return (
      <div className="animate-fade-in">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Already signed in</p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">Welcome back, {user.name.split(" ")[0]}.</h1>
        <p className="mt-2 text-sm text-slate-500">You are signed in as {user.email}.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => router.push(homeFor(user.role))} iconRight={<ArrowRight />}>
            Open {user.role === "admin" ? "admin console" : "dashboard"}
          </Button>
          <Button variant="secondary" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Welcome back</p>
      <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900 sm:text-[32px]">
        Log in to your <span className="text-indigo-500">cloud.</span>
      </h1>
      <p className="mt-2 text-sm text-slate-500">Sign in to manage your Northstar Cloud servers and billing.</p>

      <div className="mt-6 rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-3">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">Demo accounts · click to fill</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {demo.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword(d.password);
                setErrors({});
                setState("idle");
              }}
              className="flex items-center gap-2.5 rounded-lg border border-brand-100 bg-white px-3 py-2 text-left transition-all hover:-translate-y-px hover:border-brand-300 hover:shadow-card"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">{d.icon}</span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-slate-900">{d.label}</span>
                <span className="block truncate text-[11px] text-slate-500">{d.email}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        {state === "error" ? <FormAlert tone="error" title="Couldn't sign you in">{message}</FormAlert> : null}
        {state === "success" ? <FormAlert tone="success" title="Login successful">{message}</FormAlert> : null}
        <Field label="Email address" htmlFor="login-email" error={errors.email}>
          <Input id="login-email" type="email" leading={<Mail />} autoComplete="email" placeholder="you@company.com" value={email} invalid={!!errors.email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="login-password" error={errors.password?.trim() ? errors.password : undefined}>
          <PasswordInput id="login-password" autoComplete="current-password" placeholder="Your password" value={password} invalid={!!errors.password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <div className="flex items-center justify-between gap-3">
          <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <Link href="/forgot-password" className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full shadow-lg shadow-brand-600/25" loading={state === "loading"} loadingText="Signing in…" iconRight={<ArrowRight />} disabled={state === "success"}>
          Log in
        </Button>
      </form>
      <Divider label="Or continue with" />
      <GoogleButton onClick={() => toast({ tone: "info", title: "Google sign-in", message: "Social login needs the NestJS backend. Use a demo account for now." })} />
      <p className="mt-6 text-center text-[13px] text-slate-500">
        New to Northstar Cloud?{" "}
        <Link href="/register" className="font-semibold text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
