import type { Metadata } from "next";
import { LastUpdated } from "@/components/layout/SiteChrome";

export const metadata: Metadata = { title: "Privacy & Terms" };

export default function LegalPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-slate-900">Privacy &amp; Terms</h1>
        <LastUpdated className="mt-2" />
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">Placeholder text — the final legal wording must be supplied by Northcloud.</div>
        <h2 id="privacy" className="mt-10 text-xl font-semibold text-slate-900">Privacy policy</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">We collect only the information needed to run your account and services, such as your name, email address and billing details. Payment details are processed by our payment provider and are never stored in the browser.</p>
        <h2 id="terms" className="mt-10 text-xl font-semibold text-slate-900">Terms of service</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">By creating an account you agree to use Northstar Cloud services lawfully and to keep your credentials secure. Service availability, billing periods and refunds follow the terms of your selected plan.</p>
      </div>
    </section>
  );
}
