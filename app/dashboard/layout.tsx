import type { Metadata } from "next";
import { CustomerShell } from "@/features/customer/CustomerShell";

export const metadata: Metadata = { title: { default: "Customer Console", template: "%s · Customer Console" } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
