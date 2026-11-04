import type { Metadata } from "next";
import { MyServices } from "@/features/customer/MyServices";

export const metadata: Metadata = { title: "My Services" };

export default function Page() {
  return <MyServices />;
}
