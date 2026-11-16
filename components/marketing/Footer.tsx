"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, GitBranch, MessageSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import { NorthstarMark } from "@/components/layout/Logos";
import { LastUpdated } from "@/components/layout/SiteChrome";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/products" },
      { label: "Customers", href: "/customers" },
      { label: "Blog", href: "/community" },
      { label: "Careers", href: "/contact" },
      { label: "Press", href: "/contact" },
      { label: "Legal", href: "/legal" },
      { label: "Privacy Policy", href: "/legal#privacy" },
      { label: "Security", href: "/docs#firewall" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Cloud Compute", href: "/products/cloud-compute" },
      { label: "High Performance", href: "/products/high-performance" },
      { label: "Optimized Compute", href: "/products/optimized-compute" },
      { label: "Block Storage", href: "/products/block-storage" },
      { label: "Backups", href: "/products/block-storage#backups" },
      { label: "Cloud Firewalls", href: "/products/cloud-firewalls" },
      { label: "SSH Keys", href: "/dashboard/ssh-keys" },
      { label: "API", href: "/docs#api" },
      { label: "View all Products", href: "/products" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Tutorials", href: "/community" },
      { label: "Documentation", href: "/docs" },
      { label: "Quick start", href: "/docs#quick-start" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Release Notes", href: "/docs" },
      { label: "Newsletter Signup", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "VPS Hosting", href: "/solutions#hosting" },
      { label: "Website Hosting", href: "/solutions#hosting" },
      { label: "Docker Hosting", href: "/solutions#web" },
      { label: "Node.js Hosting", href: "/solutions#web" },
      { label: "Virtual Machines", href: "/solutions#hosting" },
      { label: "View all Solutions", href: "/solutions" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Support", href: "/contact" },
      { label: "Sales", href: "/contact" },
      { label: "Report Abuse", href: "/contact" },
      { label: "System Status", href: "/#customers" },
      { label: "Share your ideas", href: "/contact" },
    ],
  },
];

/* Social glyphs drawn inline (lucide no longer ships brand icons). */
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
      <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L1.5 3h6.4l4.4 5.9L17.5 3zm-1.1 16.2h1.7L6.9 4.7H5.1l11.3 14.5z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12c0-3 .3-4.6.9-5.4.6-.8 1.6-1.1 8.6-1.1s8 .3 8.6 1.1c.6.8.9 2.4.9 5.4s-.3 4.6-.9 5.4c-.6.8-1.6 1.1-8.6 1.1s-8-.3-8.6-1.1c-.6-.8-.9-2.4-.9-5.4z" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3v-11zm6.5 0h3.8v1.6c.6-1 1.9-1.9 3.8-1.9 4 0 4.9 2.6 4.9 6v5.3h-4v-4.7c0-1.3 0-2.9-1.9-2.9s-2.2 1.4-2.2 2.8v4.8H9.5v-11z" />
    </svg>
  );
}

const socials = [
  { label: "X (Twitter)", href: "https://x.com", icon: <XIcon /> },
  { label: "Instagram", href: "https://instagram.com", icon: <InstagramIcon /> },
  { label: "Discord", href: "https://discord.com", icon: <MessageSquare className="size-6" /> },
  { label: "YouTube", href: "https://youtube.com", icon: <YoutubeIcon /> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinIcon /> },
  { label: "GitHub", href: "https://github.com", icon: <GitBranch className="size-6" /> },
];

const linkClass = "text-sm leading-5 text-ink-2 hover:underline";

export function Footer() {
  const [openCol, setOpenCol] = useState<string | null>(null);
  return (
    <footer data-site-footer className="bg-canvas">
      <div className="do-section">
        <div className="do-inner gap-16">
          {/* Desktop columns */}
          <div className="hidden w-full grid-cols-5 gap-8 lg:grid">
            {columns.map((c) => (
              <div key={c.title} className="flex min-w-0 flex-col gap-4">
                <h2 className="font-sans text-base font-bold leading-6 text-ink">{c.title}</h2>
                <div className="flex flex-col gap-2">
                  {c.links.map((l) => (
                    <Link key={l.label} href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile drawers (AccordionDropdown) */}
          <div className="flex w-full flex-col lg:hidden">
            {columns.map((c) => {
              const isOpen = openCol === c.title;
              return (
                <div key={c.title} className="w-full overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`footer-${c.title}`}
                    onClick={() => setOpenCol(isOpen ? null : c.title)}
                    className="flex w-full items-center gap-4 border-b border-line py-2 text-left"
                  >
                    <span className="flex-1 font-sans text-lg font-bold leading-[26px] text-ink">{c.title}</span>
                    <ChevronDown className={cn("size-6 text-ink-2 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  <div id={`footer-${c.title}`} className="do-accordion-content" data-open={isOpen}>
                    <div>
                      <div className="flex flex-col gap-2 border-b border-line py-4">
                        {c.links.map((l) => (
                          <Link key={l.label} href={l.href} className={linkClass} tabIndex={isOpen ? 0 : -1}>
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom row */}
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" aria-label="Northstar Cloud home" className="inline-flex text-foam-400">
                <NorthstarMark size={32} />
              </Link>
              <p className="text-sm leading-5 text-ink-2">© 2026 Northstar Cloud.</p>
              <Link href="/docs" className={linkClass}>
                Sitemap
              </Link>
              <LastUpdated className="text-sm text-muted" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer" className="flex text-ink-2 transition-colors duration-200 hover:text-ink">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
