"use client";

import { SecondaryNav } from "@/components/common/layout/SecondaryNav";
import {
  Global,
  LoginCurve,
  ShieldSecurity,
  ShoppingCart,
  UserEdit,
  Wifi,
} from "iconsax-react";
import { useTranslation } from "react-i18next";

export function Tabbar() {
  const { t } = useTranslation();

  const tabs = [
    {
      title: t("Account Settings"),
      icon: <UserEdit size="24" variant="Bulk" />,
      href: "/settings",
      id: "__DEFAULT__",
    },
    {
      title: t("KYC Verification"),
      icon: <ShieldSecurity size="24" variant="Bulk" />,
      href: "/settings/kyc-verification-settings",
      id: "kyc-verification-settings",
    },
    {
      title: t("Merchant Settings"),
      icon: <ShoppingCart size="24" variant="Bulk" />,
      href: "/settings/merchant-settings",
      id: "merchant-settings",
    },
    {
      title: t("MPay API"),
      icon: <Wifi size="24" variant="Bulk" />,
      href: "/settings/mpay-api",
      id: "mpay-api",
    },
    {
      title: t("Webhook URL"),
      icon: <Global size="24" variant="Bulk" />,
      href: "/settings/webhook-url-settings",
      id: "webhook-url-settings",
    },
    {
      title: t("Login Sessions"),
      icon: <LoginCurve size="24" variant="Bulk" />,
      href: "/settings/login-sessions",
      id: "login-sessions",
    },
  ];

  return (
    <div className="sticky inset-0 left-0 top-0 z-10 border-b border-foreground/[8%] bg-background p-4">
      <SecondaryNav tabs={tabs} />
    </div>
  );
}
