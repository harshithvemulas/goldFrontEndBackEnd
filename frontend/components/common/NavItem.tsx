"use client";

import { Badge } from "@/components/ui/badge";
import { useApp } from "@/hooks/useApp";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import cn from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

type NavItemProps = {
  title?: string;
  nav: {
    key: string;
    color?: string;
    name: string;
    icon: React.ReactNode;
    link: string;
    visible?: boolean;
    isLoading: boolean;
    isActive?: boolean;
    badge?: {
      title: string;
      className?: string;
      variant?:
        | "default"
        | "secondary"
        | "success"
        | "error"
        | "destructive"
        | "outline"
        | null
        | undefined;
    };
  }[];
};

export default function NavItem({ title = "", nav }: NavItemProps) {
  const segment = useSelectedLayoutSegment();
  const { setIsExpanded } = useApp();
  const { width } = useDeviceSize();

  const closeSidebar = () => {
    if (width < 1024) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="py-4">
      {title && (
        <div className="mb-2 whitespace-nowrap">
          <span className="px-2 text-sm font-medium tracking-wide text-secondary-600">
            {title}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {nav.map((item) =>
          item.visible === undefined || item.visible ? (
            <Link
              key={item?.key}
              href={item?.link}
              aria-disabled={
                typeof item?.isActive === "undefined" || item.isActive
              }
              onClick={(e) => {
                if (typeof item?.isActive === "undefined" || item.isActive) {
                  closeSidebar();
                } else {
                  e.preventDefault();
                }
              }}
              className={clsx(
                "flex w-full items-center gap-2 whitespace-nowrap rounded-2xl px-2 py-2 transition-all duration-150 ease-in-out hover:bg-secondary active:bg-important/20",
                segment === item.key && "bg-secondary",
                (segment === "(dashboard)" || segment === "__DEFAULT__") &&
                  item.key === "dashboard" &&
                  "bg-secondary",
                typeof item.isActive !== "undefined" &&
                  !item.isActive &&
                  "opacity-50",
              )}
            >
              {item?.icon && (
                <div
                  data-active={segment === item.key}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-500 data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  {item?.icon}
                </div>
              )}
              <p className="font-medium">{item?.name}</p>

              {item.badge !== undefined ? (
                <Badge
                  variant={item.badge?.variant ?? "secondary"}
                  className={cn("", item.badge?.className)}
                >
                  {item.badge.title}
                </Badge>
              ) : null}
            </Link>
          ) : null,
        )}
      </div>
    </div>
  );
}
