import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main-content" className="do-glow-soft grid min-h-dvh place-items-center bg-canvas px-6 text-center">
      <div className="flex flex-col items-center gap-6 animate-fade-up">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foam-200">Error 404</p>
          <h1 className="t-xl5 t-display">This page drifted off the map.</h1>
          <p className="mx-auto max-w-md text-base text-ink-2">The page you are looking for does not exist or was moved.</p>
        </div>
        <ButtonLink href="/" icon={<ArrowLeft />}>
          Back to home
        </ButtonLink>
      </div>
    </main>
  );
}
