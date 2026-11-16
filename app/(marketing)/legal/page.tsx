import type { Metadata } from "next";
import { LastUpdated } from "@/components/layout/SiteChrome";

export const metadata: Metadata = { title: "Privacy & Terms" };

export default function LegalPage() {
  return (
    <section className="do-section">
      <div className="do-inner">
        <div className="w-full max-w-[864px]">
          <h1 className="t-xl5 t-display">Privacy &amp; Terms</h1>
          <LastUpdated className="mt-3" />
          <div className="mt-6 rounded-lg border border-tentacle-700 bg-tentacle-900 px-4 py-3 text-sm text-tentacle-200">Placeholder text — the final legal wording must be supplied by Northcloud.</div>
          <h2 id="privacy" className="t-xl3 t-display mt-12 scroll-mt-24">Privacy policy</h2>
          <p className="mt-3 text-base text-ink-2">We collect only the information needed to run your account and services, such as your name, email address and billing details. Payment details are processed by our payment provider and are never stored in the browser.</p>
          <h2 id="terms" className="t-xl3 t-display mt-12 scroll-mt-24">Terms of service</h2>
          <p className="mt-3 text-base text-ink-2">By creating an account you agree to use Northstar Cloud services lawfully and to keep your credentials secure. Service availability, billing periods and refunds follow the terms of your selected plan.</p>
        </div>
      </div>
    </section>
  );
}
