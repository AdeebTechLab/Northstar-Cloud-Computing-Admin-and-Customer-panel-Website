import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { SkipLink } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: { default: "Northstar Cloud — Cloud infrastructure without compromise", template: "%s · Northstar Cloud" },
  description: "Deploy high-performance cloud servers in minutes. Predictable pricing, modern infrastructure and developer-first tools.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SkipLink />
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
