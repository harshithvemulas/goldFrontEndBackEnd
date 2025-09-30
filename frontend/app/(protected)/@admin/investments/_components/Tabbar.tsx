"use client";

import { Case } from "@/components/common/Case";
import { SecondaryNav } from "@/components/common/layout/SecondaryNav";
import { Button } from "@/components/ui/button";
import { Add, ArrowLeft2, FlashCircle, ReceiptDisscount } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useTranslation } from "react-i18next";

export function Tabbar() {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();

  const { t } = useTranslation();

  const tabs = [
    {
      title: t("Investments"),
      icon: <ReceiptDisscount size="24" variant="Bulk" />,
      href: "/investments",
      id: "__DEFAULT__",
    },
    {
      title: t("History"),
      icon: <ReceiptDisscount size="24" variant="Bulk" />,
      href: "/investments/history",
      id: "history",
    },
    {
      title: t("Manage Plans"),
      icon: <FlashCircle size="24" variant="Bulk" />,
      href: "/investments/manage-plans",
      id: "manage-plans",
    },
  ];

  return (
    <div className="sticky inset-0 left-0 top-0 z-10 flex h-20 items-center border-b border-foreground/[8%] bg-background p-4">
      <Case condition={segment === "create-plan" || segment === "edit-plan"}>
        <div className="line-clamp-1 inline-flex max-w-full items-center gap-2 px-0 text-sm font-medium text-secondary-text sm:text-base [&>li]:flex [&>li]:items-center">
          <Link
            href="/investments/manage-plans"
            className="flex items-center gap-x-1 p-0 pr-2 text-foreground hover:text-primary sm:pr-4"
          >
            <ArrowLeft2 className="size-4 sm:size-6" />
            {t("Back")}
          </Link>

          <span className="line-clamp-1 flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-secondary-text">
            /{" "}
            {segment === "create-plan"
              ? t("Create new investment plan")
              : t("Edit investment plan")}
          </span>
        </div>
      </Case>

      <Case condition={segment !== "create-plan" && segment !== "edit-plan"}>
        <div className="flex w-full items-center justify-between">
          <SecondaryNav tabs={tabs} fullWidth={false} />

          {segment === "manage-plans" && (
            <Button
              onClick={() => router.push("/investments/create-plan")}
              type="button"
              variant="default"
            >
              <Add size={20} />
              {t("Create new plan")}
            </Button>
          )}
        </div>
      </Case>
    </div>
  );
}
