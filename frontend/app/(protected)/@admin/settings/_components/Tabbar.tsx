"use client";

import * as React from "react";

import { Case } from "@/components/common/Case";
import { SecondaryNav } from "@/components/common/layout/SecondaryNav";
import {
  AddSquare,
  ArrowLeft2,
  ChemicalGlass,
  Code,
  EmptyWallet,
  FlashCircle,
  LoginCurve,
  Receive,
} from "iconsax-react";
import Link from "next/link";
import {
  useSearchParams,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useTranslation } from "react-i18next";

export function Tabbar() {
  const [isActive, setIsActive] = React.useState("");
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const tabs = [
    {
      title: t("Deposit Gateways"),
      icon: <AddSquare size="24" variant="Bulk" />,
      href: "/settings",
      id: "__DEFAULT__",
    },
    {
      title: t("Withdraw Methods"),
      icon: <Receive size="24" variant="Bulk" />,
      href: "/settings/withdraw-methods",
      id: "withdraw-methods",
    },
    {
      title: t("Plugins"),
      icon: <ChemicalGlass size="24" variant="Bulk" />,
      href: "/settings/plugins",
      id: "plugins",
    },
    {
      title: t("Services"),
      icon: <FlashCircle size="24" variant="Bulk" />,
      href: "/settings/services",
      id: "services",
    },
    {
      title: t("Currency"),
      icon: <EmptyWallet size="24" variant="Bulk" />,
      href: "/settings/currencies",
      id: "currencies",
    },
    {
      title: t("Site Settings"),
      icon: <Code size="24" variant="Bulk" />,
      href: "/settings/site-settings",
      id: "site-settings",
    },
    {
      title: t("Login Sessions"),
      icon: <LoginCurve size="24" variant="Bulk" />,
      href: "/settings/login-sessions",
      id: "login-sessions",
    },
  ];

  React.useLayoutEffect(() => {
    if (segment) {
      setIsActive(segment === "gateways" ? "__DEFAULT__" : segment);
    } else {
      setIsActive("__DEFAULT__");
    }
  }, [segment]);

  return (
    <div className="sticky inset-0 left-0 top-0 z-10 border-b border-foreground/[8%] bg-background p-4">
      <Case condition={segments.length > 1}>
        <div className="line-clamp-1 inline-flex max-w-full items-center gap-2 px-0 pb-4 text-sm font-medium text-secondary-text sm:text-base [&>li]:flex [&>li]:items-center">
          <Link
            href={
              isActive === "__DEFAULT__" ? "/settings" : `/settings/${isActive}`
            }
            className="flex items-center gap-x-1 p-0 pr-2 text-foreground hover:text-primary sm:pr-4"
          >
            <ArrowLeft2 className="size-4 sm:size-6" />
            {t("Back")}
          </Link>

          <span className="line-clamp-1 flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-secondary-text">
            /{" "}
            {segments[1] === "create"
              ? "Create withdraw method"
              : searchParams.get("name")}
          </span>
        </div>
      </Case>

      <SecondaryNav tabs={tabs} defaultSegment="gateways" />
    </div>
  );
}
