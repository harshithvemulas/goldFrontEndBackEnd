"use client";

import * as React from "react";

import { Add, Profile2User } from "iconsax-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTranslation } from "react-i18next";

const tabs = [
  {
    title: "Pending Verification",
    icon: <Add size="24" variant="Bulk" />,
    href: "/agents",
    id: "__DEFAULT__",
  },
  {
    title: "Agents List",
    icon: <Profile2User size="24" variant="Bulk" />,
    href: "/agents/list",
    id: "list",
  },
];

export function Tabbar() {
  const [isActive, setIsActive] = React.useState("");
  const segment = useSelectedLayoutSegment();

  React.useLayoutEffect(() => {
    if (segment) {
      setIsActive(segment);
    } else {
      setIsActive("__DEFAULT__");
    }
  }, [segment]);

  return (
    <div className="sticky inset-0 left-0 top-0 z-10 border-b border-foreground/[8%] bg-background p-4">
      <div className="inline-flex h-12 w-fit items-center rounded-lg bg-accent p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            {...tab}
            active={isActive === tab.id}
            toggleTab={() => setIsActive(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Tab({
  title,
  icon,
  href = "/",
  active,
  toggleTab,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  active: boolean;
  toggleTab: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Link
      href={href}
      data-state={active ? t("active") : ""}
      onClick={toggleTab}
      prefetch={false}
      className="inline-flex h-10 w-[246px] items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium text-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-defaultLite [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
    >
      {icon}
      <span>{t(title)}</span>
    </Link>
  );
}
