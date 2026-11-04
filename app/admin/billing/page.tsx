import type { Metadata } from "next";
import { AdminBilling } from "@/features/admin/Billing";

export const metadata: Metadata = { title: "Billing & Payments" };

export default function Page() {
  return <AdminBilling />;
}
