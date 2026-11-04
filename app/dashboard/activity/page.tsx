import type { Metadata } from "next";
import { ActivityLog } from "@/features/customer/ActivityLog";

export const metadata: Metadata = { title: "Activity Log" };

export default function Page() {
  return <ActivityLog />;
}
