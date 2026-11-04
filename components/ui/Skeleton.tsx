import { cn } from "@/lib/cn";
import { Card } from "./Card";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4", className)} aria-hidden="true" />;
}

export function StatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-4 h-7 w-20" />
          <Skeleton className="mt-3 h-3 w-28" />
        </Card>
      ))}
    </>
  );
}

export function RowsSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-line" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-6 px-5 py-4">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className={cn("h-3.5", c === 0 ? "w-40" : "flex-1")} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BlockSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-2 h-3 w-52" />
      <Skeleton className="mt-6 h-40 w-full" />
    </Card>
  );
}
