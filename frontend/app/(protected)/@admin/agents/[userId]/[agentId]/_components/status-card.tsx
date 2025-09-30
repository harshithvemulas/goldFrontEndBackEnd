import cn from "@/lib/utils";
import { IconProps } from "iconsax-react";
import React from "react";

export function StatusCard({
  title,
  status,
  icon,
  iconClass,
  statusClass,
  className,
}: {
  title: string;
  status: string;
  iconClass?: string;
  statusClass?: string;
  className?: string;
  icon: (props: IconProps) => React.ReactElement;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-xl bg-background px-6 py-3 shadow-default",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-[54px] w-[54px] items-center justify-center rounded-full bg-important/20",
          iconClass,
        )}
      >
        {icon({ size: 34, variant: "Bulk" })}
      </div>
      <div className="flex flex-col gap-y-2">
        <span className="block text-xs font-normal leading-4">{title} </span>
        <h6 className={cn("text-sm font-semibold leading-5", statusClass)}>
          {status}
        </h6>
      </div>
    </div>
  );
}
