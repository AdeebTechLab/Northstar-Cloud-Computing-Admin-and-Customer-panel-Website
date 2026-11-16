import type { Metadata } from "next";
import { BookOpen, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Eyebrow } from "@/features/marketing/Sections";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = { title: "Contact support" };

const rows = [
  { icon: <Mail />, body: <a className="do-inlinelink" href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a> },
  { icon: <Clock />, body: <>24/7 technical support · replies within 1 business day</> },
  { icon: <BookOpen />, body: <Link className="do-inlinelink" href="/docs">Browse the documentation</Link> },
];

export default function ContactPage() {
  return (
    <div className="do-glow-soft">
      <section className="do-section">
        <div className="do-inner">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div className="flex flex-col gap-4 animate-fade-up">
              <Eyebrow>Support</Eyebrow>
              <h1 className="t-xl5 t-display">We are here to help.</h1>
              <p className="text-base text-ink-2">Questions about plans, deployments or billing? Send us a message and the right team will get back to you.</p>
              <ul className="mt-4 flex flex-col gap-4 text-base text-ink-2">
                {rows.map((r, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-line bg-surface text-foam-200 [&_svg]:size-5">{r.icon}</span>
                    {r.body}
                  </li>
                ))}
              </ul>
            </div>
            <div className="do-card do-card-border-light p-6 sm:p-8 animate-fade-up [animation-delay:120ms]">
              <h2 className="font-sans text-lg font-bold leading-[26px] text-ink">Send us a message</h2>
              <p className="mt-1 text-sm text-muted">We read every message and reply by email.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
