"use client";

import cn from "@/lib/utils";
import { IconProps } from "iconsax-react";
import * as React from "react";

type TIconProps = IconProps;

type TIconVariant =
  | "Linear"
  | "Outline"
  | "Broken"
  | "Bold"
  | "Bulk"
  | "TwoTone"
  | undefined;

type TProps = {
  icon: (props: TIconProps) => React.ReactNode;
  title: string;
  className?: string;
};

export function SuccessMenuItem({ icon, title, className }: TProps) {
  const [variant, setVariant] = React.useState<TIconVariant>("Outline");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium hover:text-primary",
        className,
      )}
      onMouseOver={() => setVariant("Bulk")}
      onFocus={() => setVariant("Bulk")}
      onMouseLeave={() => setVariant("Linear")}
      onBlur={() => setVariant("Linear")}
    >
      {icon({ size: "20", variant })}
      <span>{title}</span>
    </div>
  );
}
