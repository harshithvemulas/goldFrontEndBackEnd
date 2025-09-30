"use client";

import { SecondaryNav } from "@/components/common/layout/SecondaryNav";
import Switch from "@/components/ui/switch";
import { toggleActivity } from "@/data/admin/toggleActivity";
import {
  ArrowLeft2,
  Candle2,
  Clock,
  ShieldSecurity,
  Sms,
  UserEdit,
} from "iconsax-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate } from "swr";

export const runtime = "edge";

export default function CustomerDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { t } = useTranslation();

  const tabs = [
    {
      title: t("Account Details"),
      icon: <UserEdit size="24" variant="Bulk" />,
      href: `/merchants/${params?.userId}/${params?.merchantId}?${searchParams.toString()}`,
      id: "__DEFAULT__",
    },
    {
      title: t("Transactions"),
      icon: <Clock size="24" variant="Bulk" />,
      href: `/merchants/${params?.userId}/${params?.merchantId}/transactions?${searchParams.toString()}`,
      id: "transactions",
    },
    {
      title: t("KYC"),
      icon: <ShieldSecurity size="24" variant="Bulk" />,
      href: `/merchants/${params?.userId}/${params?.merchantId}/kyc?${searchParams.toString()}`,
      id: "kyc",
    },
    {
      title: t("Fees"),
      icon: <ShieldSecurity size="24" variant="Bulk" />,
      href: `/merchants/${params?.userId}/${params?.merchantId}/fees?${searchParams.toString()}`,
      id: "fees",
    },
    {
      title: t("Permissions"),
      icon: <Candle2 size="24" variant="Bulk" />,
      href: `/merchants/${params?.userId}/${params?.merchantId}/permissions?${searchParams.toString()}`,
      id: "permissions",
    },
    {
      title: t("Send Email"),
      icon: <Sms size="24" variant="Bulk" />,
      href: `/merchants/${params?.userId}/${params?.merchantId}/send-email?${searchParams.toString()}`,
      id: "send-email",
    },
  ];

  return (
    <>
      <div className="sticky inset-0 left-0 top-0 z-10 border-b border-foreground/[8%] bg-background p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <ul className="line-clamp-1 inline-flex items-center gap-2 p-0 text-sm font-medium text-secondary-text sm:text-base [&>li]:flex [&>li]:items-center">
            <li>
              <Link
                href="/merchants/list"
                className="flex items-center gap-x-1 p-0 pr-2 text-foreground hover:text-primary sm:pr-4"
              >
                <ArrowLeft2 />
                {t("Back")}
              </Link>
            </li>
            <li className="line-clamp-1 whitespace-nowrap">
              / {searchParams.get("name")}
            </li>
            <li className="line-clamp-1 whitespace-nowrap">
              / {t("Merchant")} #{params.merchantId}
            </li>
          </ul>
          <div className="ml-auto inline-flex items-center gap-2 text-sm sm:text-base">
            <span>{t("Active")}</span>
            <Switch
              defaultChecked={searchParams.get("active") === "1"}
              className="data-[state=unchecked]:bg-muted"
              onCheckedChange={(checked) => {
                toast.promise(toggleActivity(params.userId as string), {
                  loading: t("Loading..."),
                  success: (res) => {
                    if (!res.status) throw new Error(res.message);
                    const sp = new URLSearchParams(searchParams);
                    mutate(`/admin/merchants/${params.merchantId}`);
                    sp.set("active", checked ? "1" : "0");
                    router.push(`${pathname}?${sp.toString()}`);
                    return res.message;
                  },
                  error: (err) => err.message,
                });
              }}
            />
          </div>
        </div>

        <SecondaryNav tabs={tabs} />
      </div>

      {children}
    </>
  );
}
