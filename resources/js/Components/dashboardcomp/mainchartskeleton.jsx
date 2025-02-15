import { Skeleton } from "@/components/ui/skeleton"

export function MainchartSkeletonCard() {
  return (
    <div className="w-full h-full sm:w-full sm:h-full flex justify-center items-center py-4 flex-col space-y-3">

      <div className="flex justify-between px-4 flex-nowrap h-[15%] w-full sm:h-[20%] ">
        <div className="space-y-2 px-4 flex-nowrap h-[20%%] w-full justify-start">

          <Skeleton className="h-[30%] w-[30%]  rounded-xl" />
          <Skeleton className="h-[30%] w-[50%]  rounded-xl" />
        </div>
        <Skeleton className="h-[50%] w-[20%]  rounded-xl" />
      </div>
      <Skeleton className="h-[95%] w-[95%] sm:h-full rounded-xl" />

    </div>
  )
}
