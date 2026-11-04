import type { Metadata } from "next";
import { AdminSupport } from "@/features/admin/Support";

export const metadata: Metadata = { title: "Support Tickets" };

export default function Page() {
  return <AdminSupport />;
}
