"use client";

import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useApp } from "@/hooks/useApp";
import { useBranding } from "@/hooks/useBranding";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { imageURL } from "@/lib/utils";
import {
  Add,
  ArrowCircleUp2,
  ArrowLeft2,
  ArrowRight,
  Cards,
  Clock,
  FlashCircle,
  InfoCircle,
  Menu,
  Profile2User,
  Receipt21,
  Receive,
  Repeat,
  Save2,
  Setting2,
  Share,
  ShoppingBag,
  Tree,
  Wallet2,
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import NavItem from "./NavItem";

export default function SideNav({
  userRole = "customer",
}: {
  userRole: string;
}) {
  const { t } = useTranslation();
  const { isExpanded, setIsExpanded } = useApp();
  const { settings, isLoading } = useGlobalSettings();
  const { logo, siteName } = useBranding();

  return (
    <div
      data-expanded={isExpanded}
      className="group absolute z-[60] flex h-full min-w-80 flex-col border-r border-foreground/10 bg-background transition-all duration-500 data-[expanded=false]:absolute data-[expanded=false]:-translate-x-full sm:pb-1 lg:relative lg:z-auto"
    >
      <Button
        size="icon"
        variant="outline"
        onClick={() => setIsExpanded(false)}
        className="absolute -right-5 top-4 rounded-full bg-background group-data-[expanded=false]:hidden lg:hidden"
      >
        <ArrowLeft2 />
      </Button>

      <div className="flex h-[76px] items-center justify-center border-b border-divider-secondary">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src={imageURL(logo)}
            width={160}
            height={40}
            alt={siteName}
            className="max-h-10 object-contain"
          />
        </Link>
      </div>
      <div className="flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden px-4">
        <NavItem
          nav={[
            {
              key: "(dashboard)",
              name: t("Dashboard"),
              icon: <Menu size="20" />,
              link: "/",
              isLoading: false,
            },
            {
              key: "deposit",
              name: t("Deposit"),
              icon: <Add size="20" />,
              link: "/deposit",
              isLoading,
              isActive: settings?.deposit?.status === "on",
            },
            {
              key: "transfer",
              name: t("Transfer"),
              icon: <ArrowRight size="20" />,
              link: "/transfer",
              visible: userRole !== "agent",
              isLoading,
              isActive: settings?.transfer?.status === "on",
            },
            {
              key: "withdraw",
              name: t("Withdraw"),
              icon: <Receive size="20" />,
              link: "/withdraw",
              isLoading,
              isActive: settings?.withdraw?.status === "on",
            },
            {
              key: "exchange",
              name: t("Exchange"),
              icon: <Repeat size="20" />,
              link: "/exchange",
              isLoading,
              isActive: settings?.exchange?.status === "on",
            },
            {
              key: "payment",
              name: t("Payment"),
              icon: <ShoppingBag size="20" />,
              link: "/payment",
              visible: userRole !== "agent",
              isLoading,
              isActive: settings?.payment?.status === "on",
            },
            {
              key: "services",
              name: t("Services"),
              icon: <FlashCircle size="20" />,
              link: "/services",
              visible: userRole !== "agent",
              isLoading,
              isActive: true,
            },
            {
              key: "cards",
              name: t("Cards"),
              icon: <Cards size="20" />,
              link: "/cards",
              isLoading,
              isActive: settings?.virtual_card?.status === "on",
              visible: settings?.virtual_card?.status === "on",
            },
            {
              key: "investments",
              name: t("Investments"),
              icon: <Tree size="20" />,
              link: "/investments",
              isLoading,
            },
          ]}
        />
        <Separator className="bg-divider-secondary" />
        <NavItem
          nav={[
            {
              key: "direct-deposit",
              name: t("Deposit to Customer"),
              icon: <Add size="20" />,
              link: "/direct-deposit",
              visible: userRole === "agent",
              isLoading,
              isActive: true,
            },
            {
              key: "deposit-request",
              name: t("Deposit Requests"),
              icon: <Add size="20" />,
              link: "/deposit-request",
              visible: userRole === "agent",
              isLoading,
            },

            {
              key: "withdraw-request",
              name: t("Withdraw Requests"),
              icon: <ArrowCircleUp2 size="20" />,
              link: "/withdraw-request",
              visible: userRole === "agent",
              isLoading,
            },
            {
              key: "transaction-history",
              name: t("Transaction History"),
              icon: <Clock size="20" />,
              link: "/transaction-history",
              isLoading,
            },
            {
              key: "investments-history",
              name: t("Investments History"),
              icon: <Clock size="20" />,
              link: "/investments-history",
              isLoading,
            },
            {
              key: "settlements",
              name: t("Settlements"),
              icon: <Clock size="20" />,
              link: "/settlements",
              visible: userRole === "agent",
              isLoading,
            },

            {
              key: "merchant-transactions",
              name: t("Merchant Transaction"),
              icon: <Receipt21 size="20" />,
              link: "/merchant-transactions",
              visible: userRole === "merchant",
              isLoading,
            },
            {
              key: "payment-requests",
              name: t("Payment Requests"),
              icon: <InfoCircle size="20" />,
              link: "/payment-requests",
              visible: userRole === "merchant",
              isLoading,
            },
            {
              key: "favorites",
              name: t("Favorites"),
              icon: <Save2 size="20" />,
              link: "/favorites",
              visible: userRole !== "agent",
              isLoading,
            },
            {
              key: "contacts",
              name: t("Contacts"),
              icon: <Profile2User size="20" />,
              link: "/contacts",
              visible: userRole !== "agent",
              isLoading,
            },
            {
              key: "wallets",
              name: t("Wallets"),
              icon: <Wallet2 size="20" />,
              link: "/wallets",
              isLoading,
            },
            {
              key: "referral",
              name: t("Referral"),
              icon: <Share size="20" />,
              link: "/referral",
              isLoading,
            },
            {
              key: "settings",
              name: t("Settings"),
              icon: <Setting2 size="20" />,
              link: "/settings",
              isLoading,
            },
          ]}
        />
      </div>
    </div>
  );
}
