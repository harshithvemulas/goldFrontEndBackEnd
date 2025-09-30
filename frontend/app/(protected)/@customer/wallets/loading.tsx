import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full w-full bg-background p-4">
      <div className="flex flex-wrap gap-4 p-4">
        <Skeleton className="h-48 w-80 rounded-xl" />
        <Skeleton className="h-48 w-80 rounded-xl" />
        <Skeleton className="h-48 w-80 rounded-xl" />
        <Skeleton className="h-48 w-80 rounded-xl" />
      </div>
    </div>
  );
}
