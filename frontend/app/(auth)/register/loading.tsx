import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-2xl">
      <Skeleton className="mb-2 h-3 w-full max-w-[500px]" />
      <Skeleton className="mb-2 h-7 w-full max-w-[300px]" />

      <Skeleton className="my-6 h-[1px] w-full" />

      <div className="grid grid-cols-12 gap-6">
        <Skeleton className="mb-2 aspect-square w-full" />
        <Skeleton className="mb-2 aspect-square w-full" />
        <Skeleton className="mb-2 aspect-square w-full" />
      </div>
    </div>
  );
}
