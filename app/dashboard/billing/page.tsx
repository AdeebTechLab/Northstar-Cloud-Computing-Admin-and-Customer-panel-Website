import type { Metadata } from "next";
import { Billing } from "@/features/customer/Billing";

export const metadata: Metadata = { title: "Billing & Payments" };

export default function Page() {
  return <Billing />;
}
