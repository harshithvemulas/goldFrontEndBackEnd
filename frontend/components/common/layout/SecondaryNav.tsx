"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown2 } from "iconsax-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface TTabs {
  title: string;
  icon: React.JSX.Element;
  href: string;
  id: string;
  className?: string;
}

interface IProps {
  tabs: TTabs[];
  fullWidth?: boolean;
  defaultSegment?: string;
}

interface TabState extends TTabs {
  placeTo: "nav" | "menu";
}

export function SecondaryNav({
  tabs,
  fullWidth = true,
  defaultSegment,
}: IProps) {
  const [navItems, setNavItems] = useState<TabState[]>(() =>
    tabs.map((t) => ({ ...t, placeTo: "nav" })),
  );
  const [activeTabId, setActiveTabId] = useState<string>("");
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    setActiveTabId(
      segment && segment !== defaultSegment ? segment : "__DEFAULT__",
    );
  }, [segment, defaultSegment]);

  const updateTabPlace = useCallback((id: string, placeTo: "nav" | "menu") => {
    setNavItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, placeTo } : item)),
    );
  }, []);

  return (
    <div
      className={`inline-flex h-12 items-center rounded-lg bg-accent p-1 text-muted-foreground ${fullWidth ? "w-full" : ""}`}
    >
      {navItems.map((tab) =>
        tab.placeTo === "nav" ? (
          <Tab
            key={tab.id}
            {...tab}
            isActive={activeTabId === tab.id}
            onClick={() => setActiveTabId(tab.id)}
            updateTabPlace={updateTabPlace}
          />
        ) : null,
      )}
      <div className="ml-auto">
        <Menu navItems={navItems} activeTabId={activeTabId} />
      </div>
    </div>
  );
}

function Tab({
  title,
  id,
  icon,
  href,
  isActive,
  onClick,
  updateTabPlace,
}: {
  title: string;
  id: string;
  icon: React.ReactNode;
  href: string;
  isActive: boolean;
  onClick: () => void;
  updateTabPlace: (id: string, placeTo: "nav" | "menu") => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleResize = useCallback(() => {
    const rect = ref.current?.getBoundingClientRect();
    const innerWidth = window?.innerWidth;

    if (rect && innerWidth < rect.right + 150) {
      updateTabPlace(id, "menu");
    } else {
      updateTabPlace(id, "nav");
    }
  }, [id, updateTabPlace]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <Link
      href={href}
      data-state={isActive ? "active" : ""}
      onClick={onClick}
      prefetch={false}
      ref={ref}
      className="inline-flex h-10 w-56 items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium text-secondary-text ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-defaultLite [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

function Menu({
  navItems,
  activeTabId,
}: {
  navItems: TabState[];
  activeTabId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const menuItems = navItems.filter((item) => item.placeTo === "menu");

  const { t } = useTranslation();

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 text-sm font-medium">
          {t("More")}
          <ArrowDown2 size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {menuItems.map((item) => (
          <DropdownMenuItem
            data-active={activeTabId === item.id}
            key={item.id}
            className="data-[active=true]:bg-accent"
          >
            <Link
              href={item.href}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="flex h-full w-full items-center gap-2"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
