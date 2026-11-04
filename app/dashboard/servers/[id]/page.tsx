import type { Metadata } from "next";
import { ServerDetail } from "@/features/customer/ServerDetail";

export const metadata: Metadata = { title: "Server details" };

/**
 * Pre-renders the demo server IDs (plus a pool for servers created in the demo)
 * so the static preview build works. With a real API, remove this and let the
 * page render on demand.
 */
export function generateStaticParams() {
  return Array.from({ length: 40 }, (_, i) => ({ id: `srv-00${1284 + i}` }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServerDetail id={id} />;
}
