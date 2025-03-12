import { Skeleton } from "@/components/ui/skeleton"

export function MainchartSkeletonCard() {
  return (
    <div className="w-full h-full flex flex-col space-y-4 p-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center w-full">
        <div className="space-y-2 w-1/3">
          <Skeleton className="h-6 w-3/4 rounded-xl" /> {/* Title */}
          <Skeleton className="h-4 w-2/3 rounded-xl" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" /> {/* Dropdown */}
      </div>

      {/* Chart Skeleton (Matches ChartContainer height) */}
      <Skeleton className="h-[250px] md:h-[250px] lg:h-[300px] w-full rounded-xl" />
    </div>
  );
}

