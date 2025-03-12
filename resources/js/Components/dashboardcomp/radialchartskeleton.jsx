import { Skeleton } from "@/components/ui/skeleton"

export function RadialChartSkeletonCard() {
  return (
    <div className="w-full h-full flex flex-col space-y-4 p-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start w-full">
        <div className="space-y-2 w-1/3">
          <Skeleton className="h-6 w-3/4 rounded-xl" /> {/* Title */}
          <Skeleton className="h-4 w-2/3 rounded-xl" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-[130px] rounded-lg" /> {/* Dropdown */}
      </div>

      {/* Pie Chart Skeleton (Matches ChartContainer height) */}
      <div className="flex justify-center items-center">
        <Skeleton className="h-[250px] w-[250px] rounded-full" />
      </div>

      {/* Footer Skeleton (Legend Items) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Circle Indicator */}
            <Skeleton className="h-4 w-20 ml-2 rounded-md" /> {/* Label */}
          </div>
          <Skeleton className="h-4 w-8 rounded-md" /> {/* Count */}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Circle Indicator */}
            <Skeleton className="h-4 w-20 ml-2 rounded-md" /> {/* Label */}
          </div>
          <Skeleton className="h-4 w-8 rounded-md" /> {/* Count */}
        </div>
      </div>
    </div>
  );
}
