import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/AdminShell";

export const metadata: Metadata = { title: { default: "Admin Console", template: "%s · Admin Console" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
