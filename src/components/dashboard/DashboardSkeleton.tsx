import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column skeleton */}
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-3 w-20 rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
        {/* Right column skeleton */}
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-3 w-20 rounded-lg" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
