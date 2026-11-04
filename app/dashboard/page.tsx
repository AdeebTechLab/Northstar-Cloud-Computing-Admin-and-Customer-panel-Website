import type { Metadata } from "next";
import { CustomerOverview } from "@/features/customer/Overview";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return <CustomerOverview />;
}
