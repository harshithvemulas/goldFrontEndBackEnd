import { Skeleton } from "@/components/ui/skeleton";
import cn from "@/lib/utils";
import { IconProps } from "iconsax-react";
import React from "react";

export function ReportCard({
  title,
  value,
  status,
  icon,
  iconClass,
  statusClass,
  className,
  isLoading,
}: {
  title: string;
  value: string;
  status: string;
  iconClass?: string;
  statusClass?: string;
  className?: string;
  isLoading?: boolean;
  icon: (props: IconProps) => React.ReactElement;
}) {
  if (isLoading) {
    return <Skeleton className={cn("", className)} />;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-xl bg-background px-6 py-3 shadow-default",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-[54px] w-[54px] items-center justify-center rounded-full bg-muted",
          iconClass,
        )}
      >
        {icon({ size: 34, variant: "Outline" })}
      </div>
      <div className="flex flex-col gap-y-2">
        <h1>{value}</h1>
        <span className="block text-xs font-normal leading-4">{title} </span>
        <h6 className={cn("text-sm font-semibold leading-5", statusClass)}>
          {status}
        </h6>
      </div>
    </div>
  );
}
