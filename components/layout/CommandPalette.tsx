"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  group: string;
  href: string;
  keywords?: string;
  icon?: ReactNode;
}

function score(item: SearchItem, q: string) {
  const hay = `${item.title} ${item.subtitle ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.every((w) => hay.includes(w))) return -1;
  return item.title.toLowerCase().startsWith(words[0] ?? "") ? 2 : 1;
}

/** Site search (Ctrl/⌘ + K or "/"). */
export function CommandPalette({ open, onClose, items, placeholder = "Search…" }: { open: boolean; onClose: () => void; items: SearchItem[]; placeholder?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return items.slice(0, 9);
    return items
      .map((it) => ({ it, s: score(it, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.it);
  }, [items, q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (it: SearchItem) => {
    onClose();
    if (it.href.startsWith("/#") && window.location.pathname === "/") {
      document.getElementById(it.href.slice(2))?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", it.href);
    } else {
      router.push(it.href);
    }
  };

  if (!open || typeof document === "undefined") return null;

  let lastGroup = "";
  return createPortal(
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Site search">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative mx-auto mt-[8vh] w-[calc(100%-1.5rem)] max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-pop animate-scale-in">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-[18px] text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              }
              if (e.key === "Enter" && results[active]) go(results[active]!);
            }}
            placeholder={placeholder}
            className="h-14 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Search"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active]!.id}` : undefined}
          />
          <kbd className="hidden rounded-md border border-line bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:block">ESC</kbd>
        </div>
        <ul ref={listRef} id="search-results" role="listbox" className="scroll-thin max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-10 text-center text-sm text-slate-500">
              No results for “<span className="font-semibold text-slate-700">{q}</span>”. Try another word.
            </li>
          ) : (
            results.map((it, i) => {
              const header = it.group !== lastGroup ? it.group : null;
              lastGroup = it.group;
              return (
                <li key={it.id}>
                  {header ? <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{header}</p> : null}
                  <button
                    id={`sr-${it.id}`}
                    role="option"
                    aria-selected={i === active}
                    data-index={i}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(it)}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors", i === active ? "bg-brand-50" : "hover:bg-slate-50")}
                  >
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4", i === active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500")}>{it.icon ?? <ArrowRight />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{it.title}</span>
                      {it.subtitle ? <span className="block truncate text-xs text-slate-500">{it.subtitle}</span> : null}
                    </span>
                    {i === active ? <CornerDownLeft className="size-4 text-brand-500" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-line bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-500">
          <span>↑ ↓ to move · Enter to open</span>
          <span>
            <kbd className="font-semibold">Ctrl</kbd> + <kbd className="font-semibold">K</kbd> anywhere
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Opens the palette with Ctrl/⌘+K or "/" (when not typing). */
export function useSearchShortcut(setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}
