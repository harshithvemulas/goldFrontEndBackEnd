"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import cn from "@/lib/utils";
import { SearchNormal1 } from "iconsax-react";

interface ISearchBoxProps extends React.ComponentProps<typeof Input> {
  iconPlacement?: "start" | "end";
  containerClass?: string;
}

export function SearchBox({
  iconPlacement = "start",
  className,
  containerClass,
  ...props
}: ISearchBoxProps) {
  return (
    <div className={cn("relative flex items-center", containerClass)}>
      <SearchNormal1
        size="20"
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          iconPlacement === "end" ? "right-2.5" : "left-2.5",
        )}
      />
      <Input
        type="text"
        className={cn(
          "h-10",
          iconPlacement === "end" ? "pr-10" : "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}
