"use client";

import { SecondaryNav } from "@/components/common/layout/SecondaryNav";
import { PercentageSquare, ReceiptDisscount } from "iconsax-react";
import { useTranslation } from "react-i18next";

export function Tabbar() {
  const { t } = useTranslation();

  const tabs = [
    {
      title: t("My Investments"),
      icon: <PercentageSquare size="24" variant="Bulk" />,
      href: "/investments/",
      id: "__DEFAULT__",
    },
    {
      title: t("Available Plans"),
      icon: <ReceiptDisscount size="24" variant="Bulk" />,
      href: "/investments/available-plans",
      id: "available-plans",
    },
  ];

  return (
    <div className="sticky inset-0 left-0 top-0 z-10 border-b border-black/[8%] bg-white p-4">
      <SecondaryNav tabs={tabs} />
    </div>
  );
}
