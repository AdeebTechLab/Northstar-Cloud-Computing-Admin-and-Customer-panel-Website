import Link from "next/link";
import { SparkleLogo } from "@/components/layout/Logos";
import { LastUpdated } from "@/components/layout/SiteChrome";

const cols = [
  {
    title: "Platform",
    links: [
      { label: "Cloud compute", href: "/#features" },
      { label: "Pricing & plans", href: "/#pricing" },
      { label: "Global infrastructure", href: "/#why" },
      { label: "Security", href: "/docs#firewall" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API reference", href: "/docs#api" },
      { label: "Guides & tutorials", href: "/docs#quick-start" },
      { label: "Support center", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Northstar", href: "/#why" },
      { label: "Careers", href: "/contact" },
      { label: "Status", href: "/#stats" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer data-site-footer className="bg-navy-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <SparkleLogo solid />
            <p className="mt-4 text-sm leading-relaxed">Cloud infrastructure designed to make building, shipping, and scaling feel straightforward.</p>
            <p className="mt-4 text-[13px] text-slate-500">Built for the next thing.</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-white">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p>© 2026 Northstar Cloud.</p>
            <LastUpdated className="text-slate-500" />
          </div>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/legal#privacy" className="hover:text-white">Privacy</Link>
            <Link href="/legal#terms" className="hover:text-white">Terms</Link>
            <Link href="/#stats" className="hover:text-white">Status</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
