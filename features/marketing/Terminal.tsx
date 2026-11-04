"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";

const command = "northstar compute create \\\n  --region us-central \\\n  --plan standard";

/** Terminal card from the "From terminal to production" section, with a typing animation. */
export function TerminalWindow() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  // Start the "deploy" animation when the terminal scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timers: number[] = [];
    const start = () => {
      timers = [400, 1000, 1600, 2300].map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
    };
    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        start();
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);
  const checks = ["Validating configuration...", "Allocating compute resources...", "Configuring secure networking..."];

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900 shadow-2xl shadow-navy-900/30">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-slate-600" />
          <span className="size-2.5 rounded-full bg-slate-600" />
          <span className="size-2.5 rounded-full bg-slate-600" />
        </div>
        <span className="text-[11px] text-slate-500">Terminal — northstar</span>
        <CopyButton value={command.replace(/\\\n\s+/g, "")} label="Copy command" dark showText />
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.9] text-slate-300 sm:px-6" aria-label="Example deployment in the terminal">
        <code>
          <span className="text-emerald-400">$</span> <span className="text-white">northstar compute create</span> <span className="text-slate-500">\</span>
          {"\n"}
          {"    "}<span className="text-brand-300">--region</span> <span className="text-amber-200">us-central</span> <span className="text-slate-500">\</span>
          {"\n"}
          {"    "}<span className="text-brand-300">--plan</span> <span className="text-amber-200">standard</span>
          {"\n\n"}
          {checks.map((c, i) => (
            <span key={c} className={step > i ? "block opacity-100 transition-opacity duration-300" : "block opacity-0"}>
              <Check className="mr-2 inline size-3.5 text-emerald-400" strokeWidth={3} />
              {c}
            </span>
          ))}
          {"\n"}
          <span className={step > 3 ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
            Instance ready in <span className="text-brand-300">42 seconds</span>
            {"\n"}
            <span className="text-brand-300">→</span> <span className="text-slate-200">srv-ns-8f21.northstar.run</span>
          </span>
        </code>
      </pre>
    </div>
  );
}
