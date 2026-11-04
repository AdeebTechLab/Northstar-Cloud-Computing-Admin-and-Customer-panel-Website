"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role, SessionUser } from "@/types";
import { api } from "@/lib/api";
import { PageLoader } from "@/components/ui/Spinner";

/**
 * DEMO session handling. Only the signed-in user's display info is kept in the
 * browser so the demo survives refreshes. A real build must use the httpOnly
 * session cookie issued by NestJS and let the API decide permissions.
 */
const SESSION_KEY = "northcloud-demo-session";

type Status = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  user: SessionUser | null;
  status: Status;
  login: (email: string, password: string, remember?: boolean) => Promise<SessionUser>;
  register: (input: { name: string; email: string; password: string }) => Promise<SessionUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: SessionUser | null, remember = true) {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    if (user) (remember ? window.localStorage : window.sessionStorage).setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* storage blocked – session lasts for this page only */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const u = readSession();
    setUser(u);
    setStatus(u ? "authenticated" : "anonymous");
  }, []);

  const login = useCallback(async (email: string, password: string, remember = true) => {
    const u = await api.auth.login(email, password);
    writeSession(u, remember);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const register = useCallback(async (input: { name: string; email: string; password: string }) => {
    const u = await api.auth.register(input);
    writeSession(u, true);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(() => ({ user, status, login, register, logout }), [user, status, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export const homeFor = (role: Role) => (role === "admin" ? "/admin" : "/dashboard");

/** Client-side guard for the demo. The NestJS API stays the real security boundary. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "anonymous") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (status === "authenticated" && user && user.role !== role) router.replace(homeFor(user.role));
  }, [status, user, role, router, pathname]);

  if (status !== "authenticated" || !user || user.role !== role) {
    return <PageLoader label={status === "anonymous" ? "Redirecting to login…" : "Loading your console…"} />;
  }
  return <>{children}</>;
}
