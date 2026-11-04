import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/LoginForm";
import { PageLoader } from "@/components/ui/Spinner";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginForm />
    </Suspense>
  );
}
