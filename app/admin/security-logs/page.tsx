import type { Metadata } from "next";
import { AdminSecurity } from "@/features/admin/Security";

export const metadata: Metadata = { title: "Security & Logs" };

export default function Page() {
  return <AdminSecurity />;
}
