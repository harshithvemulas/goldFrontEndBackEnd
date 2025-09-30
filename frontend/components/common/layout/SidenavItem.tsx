"use client";

import { Case } from "@/components/common/Case";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/useApp";
import { ArrowDown2 } from "iconsax-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import * as React from "react";

type TSidebarItem = {
  key: string;
  name: string;
  icon: React.ReactElement;
  link: string;
  segment: string;
  color?: string;
  children?: {
    key: string;
    link: string;
    name: string;
    segment: string;
  }[];
};

interface IProps {
  sidebarItem: TSidebarItem;
}

export function SidenavItem({ sidebarItem }: IProps) {
  const [activeSlug, setIsActiveSlug] = React.useState("(dashboard)");
  const [isExtended, setIsExtended] = React.useState(false);

  const { setIsExpanded: handleSidebar, device } = useApp();
  const layoutSegment = useSelectedLayoutSegment();

  React.useEffect(() => {
    setIsActiveSlug(layoutSegment as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setIsExtended(sidebarItem.segment === layoutSegment);
  }, [layoutSegment, sidebarItem.segment]);

  return (
    <div
      data-extended={isExtended}
      className="h-fit overflow-hidden transition-all duration-300 data-[extended=true]:rounded-2xl data-[extended=true]:bg-accent"
    >
      <Link
        href={sidebarItem.link}
        onClick={() => {
          setIsActiveSlug(sidebarItem.segment);
          if (!sidebarItem.children?.length) {
            if (device !== "Desktop") {
              handleSidebar(false);
            }
          }
        }}
        data-active={layoutSegment === sidebarItem.segment}
        className="group inline-flex h-12 w-full items-center gap-2 rounded-2xl p-2 font-medium hover:bg-accent data-[active=true]:bg-accent"
      >
        <Case condition={!!sidebarItem.icon}>
          <div
            data-active={layoutSegment === sidebarItem.segment}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-500 data-[active=true]:bg-primary data-[active=true]:text-white"
          >
            {sidebarItem?.icon}
          </div>
        </Case>

        <span className="flex-1">{sidebarItem.name}</span>

        <Case condition={!!sidebarItem.children?.length}>
          <Button
            variant="ghost"
            type="button"
            size="icon"
            data-extended={isExtended}
            className="group rounded-xl hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsExtended(!isExtended);
            }}
          >
            <ArrowDown2
              size={16}
              className="group-data-[extended=true]:rotate-180"
            />
          </Button>
        </Case>
      </Link>

      <Case condition={!!sidebarItem.children?.length}>
        <ul
          data-extended={isExtended}
          className="ml-5 flex flex-col gap-1.5 transition-all duration-300 data-[extended=true]:pb-2"
          style={{
            height:
              isExtended && sidebarItem.children?.length
                ? sidebarItem.children.length * 32 + 20
                : "0px",
          }}
        >
          {sidebarItem.children?.map((item) => (
            <li key={item.key}>
              <Link
                href={item.link}
                data-active={activeSlug === item.segment}
                onClick={() => {
                  setIsActiveSlug(item.segment);
                  if (device !== "Desktop") {
                    handleSidebar(false);
                  }
                }}
                className="group inline-flex w-full items-center gap-5 py-1.5 text-sm font-semibold leading-5 hover:text-primary data-[active=true]:text-primary"
              >
                <span className="block size-2 rounded-full bg-secondary-text group-hover:bg-primary group-data-[active=true]:bg-primary" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </Case>
    </div>
  );
}
