"use client";

import { SearchBox } from "@/components/common/form/SearchBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { useSWR } from "@/hooks/useSWR";
import { copyContent, Currency, searchQuery } from "@/lib/utils";
import { DocumentCopy, MoneyAdd } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { ReferralTable } from "./_components/referral-table";

const currency = new Currency();

export default function Referral() {
  const { referral } = useBranding();
  const searchParams = useSearchParams();
  const { auth, isLoading: authLoading } = useAuth();
  const [search, setSearch] = React.useState("");

  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useSWR(
    `/customers/referred-users?${searchParams.toString()}`,
  );

  const { t } = useTranslation();

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="inline-flex w-full items-center gap-4 rounded-xl border border-border bg-background p-6 md:w-1/3">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <MoneyAdd size={32} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold leading-8">
              {currency.format(Number(referral?.bonusAmount))}
            </h1>

            <p className="text-base font-medium leading-[22px]">
              {t("Total Earnings")}
            </p>
          </div>
        </div>
        <div className="w-full rounded-xl border border-border bg-background px-4 py-0">
          <div className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Refer a friend")}
            </p>
          </div>
          <div className="flex flex-col gap-2 border-t border-divider px-1 py-4 sm:flex-row">
            <Input
              value={authLoading ? t("Loading...") : auth?.getReferralLink()}
              className="h-10"
              readOnly
              disabled
            />
            <Button
              type="button"
              onClick={() => copyContent(auth?.getReferralLink() as string)}
              className="w-full rounded-lg sm:max-w-[302px]"
            >
              <DocumentCopy />
              <span>{t("Copy link")}</span>
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-xl">
        <CardHeader className="flex items-start py-4 sm:flex-row sm:items-center">
          <CardTitle className="flex-1 text-base font-medium leading-[22px]">
            {t("Referrals")}
          </CardTitle>
          <SearchBox
            value={search}
            onChange={handleSearch}
            iconPlacement="end"
            placeholder={t("Search...")}
            className="h-10 rounded-lg"
            containerClass="w-full sm:w-[280px]"
          />
        </CardHeader>

        <CardContent className="border-t border-divider py-4">
          <ReferralTable
            referralUsers={data?.data?.referralUsers}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
