import type { Metadata } from "next";
import { SupportCenter } from "@/features/customer/SupportCenter";

export const metadata: Metadata = { title: "Support Center" };

export default function Page() {
  return <SupportCenter />;
}
