import type { Metadata } from "next";
import { SshKeys } from "@/features/customer/SshKeys";

export const metadata: Metadata = { title: "SSH Keys" };

export default function Page() {
  return <SshKeys />;
}
