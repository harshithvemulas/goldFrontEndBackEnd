import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-3xl">
      <Skeleton className="mb-2 h-3 w-full max-w-[500px]" />
      <Skeleton className="mb-2 h-7 w-full max-w-[300px]" />

      <Skeleton className="my-6 h-[1px] w-full" />

      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="mb-2 h-3 w-full max-w-[200px]" />
          <Skeleton className="mb-2 h-10 w-full" />
        </div>

        <div>
          <Skeleton className="mb-2 h-3 w-full max-w-[200px]" />
          <Skeleton className="mb-2 h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-full max-w-[200px]" />
          <Skeleton className="mb-2 h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-full max-w-[200px]" />
          <Skeleton className="mb-2 h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-full max-w-[200px]" />
          <Skeleton className="mb-2 h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-full max-w-[200px]" />
          <Skeleton className="mb-2 h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
