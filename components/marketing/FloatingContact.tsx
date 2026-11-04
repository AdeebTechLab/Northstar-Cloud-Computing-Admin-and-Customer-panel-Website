"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/site";
import { ContactForm } from "./ContactForm";

/** Floating "Contact us" button with a small message panel. */
export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div data-floating className="fixed bottom-5 right-4 z-[65] sm:bottom-6 sm:right-6">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Contact Northstar Cloud"
          className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-sm origin-bottom-right overflow-hidden rounded-2xl border border-line bg-white shadow-pop animate-scale-in"
        >
          <div className="bg-gradient-to-br from-brand-700 to-brand-500 px-5 py-4 text-white">
            <p className="text-[15px] font-semibold">Talk to our team</p>
            <p className="mt-0.5 text-[13px] text-white/80">We usually reply within a few hours.</p>
          </div>
          <div className="scroll-thin max-h-[60vh] overflow-y-auto p-5">
            <ContactForm compact onDone={() => setOpen(false)} />
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-4 text-[13px]">
              <a href={`mailto:${BRAND.supportEmail}`} className="flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600">
                <Mail className="size-4" /> Email us
              </a>
              <Link href="/docs" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600">
                <BookOpen className="size-4" /> Read docs
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close contact panel" : "Contact us"}
        className={cn(
          "group flex h-12 items-center gap-2 rounded-full bg-brand-600 pl-4 pr-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/35 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl",
          open && "pl-3.5 pr-3.5",
        )}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5 transition-transform group-hover:rotate-[-8deg]" />}
        {open ? null : <span className="hidden sm:inline">Contact us</span>}
      </button>
    </div>
  );
}
