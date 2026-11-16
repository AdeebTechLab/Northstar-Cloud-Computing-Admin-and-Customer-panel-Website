"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/site";
import { ContactForm } from "./ContactForm";

/** Floating "Contact us" pill with a small message panel. */
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
        <div ref={panelRef} role="dialog" aria-label="Contact Northstar Cloud" className="do-card do-card-border-light absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-sm origin-bottom-right shadow-pop animate-scale-in">
          <div className="border-b border-line bg-surface-2 px-5 py-4">
            <p className="font-sans text-lg font-bold leading-[26px] text-ink">Talk to our team</p>
            <p className="mt-0.5 text-sm text-muted">We usually reply within a few hours.</p>
          </div>
          <div className="scroll-thin max-h-[60vh] overflow-y-auto p-5">
            <ContactForm compact onDone={() => setOpen(false)} />
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-4 text-sm">
              <a href={`mailto:${BRAND.supportEmail}`} className="flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-ink-2 hover:bg-hover hover:text-ink">
                <Mail className="size-4" /> Email us
              </a>
              <Link href="/docs" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-ink-2 hover:bg-hover hover:text-ink">
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
          "group flex h-12 items-center gap-2 rounded-full bg-foam-200 pl-4 pr-5 text-base font-medium text-deep-50 shadow-[0_0_12px_rgba(111,224,237,0.35)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-foam-400",
          open && "pl-3.5 pr-3.5",
        )}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5 transition-transform group-hover:rotate-[-8deg]" />}
        {open ? null : <span className="hidden sm:inline">Contact us</span>}
      </button>
    </div>
  );
}
