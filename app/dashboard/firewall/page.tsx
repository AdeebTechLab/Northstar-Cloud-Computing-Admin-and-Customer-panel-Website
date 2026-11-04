import type { Metadata } from "next";
import { Firewall } from "@/features/customer/Firewall";

export const metadata: Metadata = { title: "Firewall" };

export default function Page() {
  return <Firewall />;
}
