import { Skeleton } from "@/components/ui/skeleton";
import cn from "@/lib/utils";
import * as React from "react";

// Review items
export function ReviewItemList({
  groupName,
  children,
  className,
}: {
  groupName?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-y-4 text-sm sm:text-base", className)}>
      {groupName ? (
        <li className="text-base font-medium leading-[22px]">{groupName}</li>
      ) : null}

      {children}
    </ul>
  );
}

// Review item
export function ReviewItem({
  title,
  value,
  className,
  titleClassName,
  valueClassName,
  isLoading = false,
}: {
  title: string;
  value: string | React.ReactNode;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <li className={cn("flex items-center gap-4", className)}>
        <Skeleton className="h-5 w-2/3" />
      </li>
    );
  }

  return (
    <li className={cn("flex items-center gap-4", className)}>
      <div className={cn("flex-1", titleClassName)}>{title}</div>
      <div
        className={cn(
          "justify-self-end text-right font-medium leading-[22px]",
          valueClassName,
        )}
      >
        {value}
      </div>
    </li>
  );
}
