import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-1/2 rounded-md" /> {/* Title */}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
          <Skeleton className="h-8 w-16 rounded-md" /> {/* Value */}
        </div>
      </CardContent>
    </Card>
  );
}
