"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { CopyButton } from "@/components/ui/CopyButton";

/** Code block cloned from the DigitalOcean CodeHeader + code block: grey title bar, navy body, pill copy button. */
export function CodeBlock({ title, code, children, className }: { title: string; code: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-line-soft", className)}>
      <div className="flex items-center justify-between gap-4 bg-scale-600 px-4 py-2">
        <span className="min-w-0 truncate text-sm font-medium text-deep-50">{title}</span>
        <CopyButton value={code} label="Copy" variant="code" showText />
      </div>
      <pre className="scroll-thin overflow-x-auto bg-code px-5 py-5 font-mono text-[13px] leading-[1.85] text-[#f7f8fb]">
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}

const command = "northstar compute create \\\n  --region us-central \\\n  --plan standard";

/** Terminal card with a typing/deploy animation. */
export function TerminalWindow() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
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
    <div ref={ref}>
      <CodeBlock title="Terminal — northstar" code={command.replace(/\\\n\s+/g, "")}>
        <span className="text-algae-300">$</span> <span className="text-deep-1000">northstar compute create</span> <span className="text-deep-700">\</span>
        {"\n"}
        {"    "}<span className="text-foam-200">--region</span> <span className="text-tentacle-200">us-central</span> <span className="text-deep-700">\</span>
        {"\n"}
        {"    "}<span className="text-foam-200">--plan</span> <span className="text-tentacle-200">standard</span>
        {"\n\n"}
        {checks.map((c, i) => (
          <span key={c} className={step > i ? "block opacity-100 transition-opacity duration-300" : "block opacity-0"}>
            <Check className="mr-2 inline size-3.5 text-algae-300" strokeWidth={3} />
            {c}
          </span>
        ))}
        {"\n"}
        <span className={step > 3 ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
          Instance ready in <span className="text-foam-200">42 seconds</span>
          {"\n"}
          <span className="text-foam-200">→</span> <span className="text-deep-950">srv-ns-8f21.northstar.run</span>
        </span>
      </CodeBlock>
    </div>
  );
}
