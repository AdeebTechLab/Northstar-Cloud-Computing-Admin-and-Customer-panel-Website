import type { Metadata } from "next";
import { DocsView } from "@/features/marketing/Docs";

export const metadata: Metadata = { title: "Documentation" };

export default function DocsPage() {
  return <DocsView />;
}
