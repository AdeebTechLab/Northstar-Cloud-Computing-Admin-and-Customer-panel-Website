import type { Metadata } from "next";
import { DeployServer } from "@/features/customer/DeployServer";

export const metadata: Metadata = { title: "Deploy a New Server" };

export default function Page() {
  return <DeployServer />;
}
