import type { Metadata } from "next";
import { AdminOverview } from "@/features/admin/Overview";

export const metadata: Metadata = { title: "Admin Overview" };

export default function Page() {
  return <AdminOverview />;
}
