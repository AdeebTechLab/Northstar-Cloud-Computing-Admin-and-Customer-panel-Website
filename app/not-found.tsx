import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center bg-[#f8faff] px-4 text-center">
      <div className="animate-fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">This page drifted off the map.</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-slate-500">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
        <Link href="/" className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>
    </main>
  );
}
