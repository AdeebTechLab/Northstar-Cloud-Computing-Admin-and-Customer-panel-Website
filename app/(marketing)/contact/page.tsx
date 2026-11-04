import type { Metadata } from "next";
import { BookOpen, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Eyebrow } from "@/features/marketing/Sections";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = { title: "Contact support" };

export default function ContactPage() {
  return (
    <section className="bg-[#f8faff] py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div className="animate-fade-up">
          <Eyebrow>Support</Eyebrow>
          <h1 className="mt-4 text-[32px] font-bold leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl">We&apos;re here to help.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-500">Questions about plans, deployments or billing? Send us a message and the right team will get back to you.</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3 text-slate-600"><span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><Mail className="size-4" /></span><a className="font-medium hover:text-brand-600" href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a></li>
            <li className="flex items-center gap-3 text-slate-600"><span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><Clock className="size-4" /></span>24/7 technical support · replies within 1 business day</li>
            <li className="flex items-center gap-3 text-slate-600"><span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><BookOpen className="size-4" /></span><Link className="font-medium hover:text-brand-600" href="/docs">Browse the documentation</Link></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card animate-fade-up [animation-delay:120ms] sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Send us a message</h2>
          <p className="mb-6 mt-1 text-[13px] text-slate-500">All fields marked * are required.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
