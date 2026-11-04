import type { Metadata } from "next";
import { AdminPlans } from "@/features/admin/Plans";

export const metadata: Metadata = { title: "Plans & Pricing" };

export default function Page() {
  return <AdminPlans />;
}
