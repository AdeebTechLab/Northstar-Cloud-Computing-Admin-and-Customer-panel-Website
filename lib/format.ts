const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US");

export const money = (v: number) => usd.format(v);
export const money0 = (v: number) => usd0.format(v);
export const number = (v: number) => num.format(v);
export const pad2 = (v: number) => String(v).padStart(2, "0");

const toDate = (v: string | Date) => (typeof v === "string" ? new Date(v.length === 10 ? `${v}T12:00:00Z` : v) : v);

/** Oct 29, 2026 */
export const shortDate = (v: string | Date) =>
  toDate(v).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

/** 10:42 AM */
export const time = (v: string | Date) =>
  toDate(v).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

/** Oct 29, 10:42 */
export const dateTimeShort = (v: string | Date) =>
  `${toDate(v).toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" })}, ${toDate(v).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}`;

export const longDate = (v: string | Date) =>
  toDate(v).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function relativeTime(v: string | Date, now = new Date()) {
  const diff = (now.getTime() - toDate(v).getTime()) / 1000;
  if (diff < 45) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return shortDate(v);
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
