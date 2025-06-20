import { Skeleton } from "@/components/features/school/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="border rounded-md">
        <div className="h-12 px-4 border-b flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[100px] mr-4" />
          ))}
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-16 px-4 border-b flex items-center">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[100px] mr-4" />
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[100px]" />

        <div className="flex space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  )
}
