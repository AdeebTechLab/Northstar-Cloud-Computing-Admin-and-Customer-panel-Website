import type { Metadata } from "next";
import { AdminCustomers } from "@/features/admin/Customers";

export const metadata: Metadata = { title: "Customers" };

export default function Page() {
  return <AdminCustomers />;
}
