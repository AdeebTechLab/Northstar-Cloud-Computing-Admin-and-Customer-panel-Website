/**
 * Small typed fetch helper for the future NestJS adapter.
 * Endpoint paths are not defined yet — add them once the API contract is agreed.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function httpRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include", // session cookie issued by NestJS (httpOnly)
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}
