import type { Metadata } from "next";
import { AdminServers } from "@/features/admin/Servers";

export const metadata: Metadata = { title: "Servers & Infrastructure" };

export default function Page() {
  return <AdminServers />;
}
