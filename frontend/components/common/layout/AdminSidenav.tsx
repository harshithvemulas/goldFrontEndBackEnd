"use client";

import { SidenavItem } from "@/components/common/layout/SidenavItem";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useApp } from "@/hooks/useApp";
import { useBranding } from "@/hooks/useBranding";
import { imageURL } from "@/lib/utils";
import {
  Add,
  ArrowLeft2,
  ArrowRight,
  Cards,
  Menu,
  Profile2User,
  Receive,
  Repeat,
  Setting2,
  ShoppingBag,
  ShoppingCart,
  TagUser,
  Tree,
  UserOctagon,
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AdminSidenav() {
  const { t } = useTranslation();
  const { isExpanded, setIsExpanded } = useApp();
  const { logo, siteName } = useBranding();

  const sidebarItems = [
    {
      id: "sidebarItem1",
      title: "",
      items: [
        {
          key: "dashboard",
          name: t("Dashboard"),
          icon: <Menu size="20" />,
          link: "/",
          segment: "(dashboard)",
        },
        {
          key: "deposits",
          name: t("Deposits"),
          icon: <Add size="20" />,
          link: "/deposits",
          segment: "deposits",
          children: [
            {
              key: "deposits-pending",
              name: t("Pending"),
              link: "/deposits",
              segment: "deposits",
            },
            {
              key: "deposits-history",
              name: t("History"),
              link: "/deposits/history",
              segment: "history",
            },
          ],
        },
        {
          key: "transfers",
          name: t("Transfers"),
          icon: <ArrowRight size="20" />,
          link: "/transfers",
          segment: "transfers",
          children: [
            {
              key: "transfers-pending",
              segment: "transfers",
              name: t("Pending"),
              link: "/transfers",
            },
            {
              key: "transfers-history",
              segment: "transfers-history ",
              name: t("History"),
              link: "/transfers/history",
            },
          ],
        },
        {
          key: "withdraws",
          name: t("Withdraws"),
          icon: <Receive size="20" />,
          link: "/withdraws",
          segment: "withdraws",
          children: [
            {
              key: "withdraws-pending",
              segment: "withdraws",
              name: t("Pending"),
              link: "/withdraws",
            },
            {
              key: "withdraws-history",
              segment: "withdraws-history",
              name: t("History"),
              link: "/withdraws/history",
            },
          ],
        },
        {
          key: "exchanges",
          name: t("Exchanges"),
          icon: <Repeat size="20" />,
          link: "/exchanges",
          segment: "exchanges",
          children: [
            {
              key: "exchanges-pending",
              segment: "exchanges",
              name: t("Pending"),
              link: "/exchanges",
            },
            {
              key: "exchanges-list",
              segment: "exchanges-history",
              name: t("History"),
              link: "/exchanges/history",
            },
          ],
        },
        {
          key: "payments",
          name: t("Payments"),
          icon: <ShoppingBag size="20" />,
          link: "/payments",
          segment: "payments",
        },
        {
          key: "cards",
          segment: "cards",
          name: t("Cards"),
          icon: <Cards size="20" />,
          link: "/cards",
        },
        {
          key: "investments",
          name: t("Investments"),
          icon: <Tree size="20" />,
          link: "/investments",
          segment: "investments",
        },
      ],
    },
    {
      id: "sidebarItem2",
      items: [
        {
          key: "customers",
          segment: "customers",
          name: t("Customers"),
          icon: <Profile2User size="20" />,
          link: "/customers",
          children: [
            {
              key: "customers",
              segment: "customers",
              name: t("Pending Kyc"),
              link: "/customers",
            },
            {
              key: "customers-list",
              segment: "customers-list",
              name: t("Customer List"),
              link: "/customers/list",
            },
            {
              key: "bulk-email",
              segment: "bulk-email",
              name: t("Bulk Email"),
              link: "/customers/bulk-email",
            },
          ],
        },
        {
          key: "merchants",
          segment: "merchants",
          name: t("Merchants"),
          icon: <ShoppingCart size="20" />,
          link: "/merchants",
          children: [
            {
              key: "merchants",
              segment: "merchants",
              name: t("Pending"),
              link: "/merchants",
            },
            {
              key: "merchant-list",
              segment: "merchants-list",
              name: t("Merchant List"),
              link: "/merchants/list",
            },
            {
              key: "payment-request",
              segment: "payment-request",
              name: t("Payment Request"),
              link: "/merchants/payment-request",
            },
            {
              key: "bulk-email",
              segment: "bulk-email",
              name: t("Bulk Email"),
              link: "/merchants/bulk-email",
            },
          ],
        },
        {
          key: "agents",
          segment: "agents",
          name: t("Agents"),
          icon: <TagUser size="20" />,
          link: "/agents",
          children: [
            {
              key: "agents",
              segment: "agents",
              name: t("Pending"),
              link: "/agents",
            },
            {
              key: "agent-list",
              segment: "agents-list",
              name: t("Agent List"),
              link: "/agents/list",
            },
            {
              key: "bulk-email",
              segment: "bulk-email",
              name: t("Bulk Email"),
              link: "/agents/bulk-email",
            },
          ],
        },
        {
          key: "staffs",
          segment: "staffs",
          name: t("Staffs"),
          icon: <UserOctagon size="20" />,
          link: "/staffs",
        },
        {
          key: "settings",
          segment: "settings",
          name: t("Settings"),
          icon: <Setting2 size="20" />,
          link: "/settings",
        },
      ],
    },
  ];

  return (
    <div
      data-expanded={isExpanded}
      className="absolute z-[60] flex h-screen min-h-80 min-w-80 flex-col border-r border-foreground/10 bg-background transition-all duration-500 data-[expanded=false]:absolute data-[expanded=false]:-translate-x-full lg:relative lg:z-auto"
    >
      <Button
        size="icon"
        variant="outline"
        onClick={() => setIsExpanded(false)}
        className={`absolute -right-5 top-4 rounded-full bg-background ${!isExpanded ? "hidden" : ""} lg:hidden`}
      >
        <ArrowLeft2 />
      </Button>

      {/* Logo */}
      <div className="flex h-[76px] items-center justify-center border-b border-divider-secondary px-4">
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
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-4">
        {sidebarItems.map((sidebar) => (
          <div key={sidebar.id}>
            {sidebar.title !== "" ? (
              <div>
                <Separator className="my-4" />
              </div>
            ) : null}
            <ul className="flex flex-col gap-1">
              {sidebar.items?.map((item) => (
                <li key={item.key}>
                  <SidenavItem sidebarItem={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
