import type { Metadata } from "next";
import { AccountSettings } from "@/features/customer/AccountSettings";

export const metadata: Metadata = { title: "Account Settings" };

export default function Page() {
  return <AccountSettings />;
}
