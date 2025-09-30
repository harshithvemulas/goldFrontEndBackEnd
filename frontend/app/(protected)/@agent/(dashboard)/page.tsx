"use client";

import { Case } from "@/components/common/Case";
import { KycWalletCard } from "@/components/common/KycWalletCard";
import { WalletCardDashboard } from "@/components/common/WalletCardDashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { useSWR } from "@/hooks/useSWR";
import { useWallets } from "@/hooks/useWallets";
import { IWallet } from "@/types/wallet";
import { format } from "date-fns";
import { Add, ArrowRight2, PercentageSquare, Receive } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentReportChart } from "./_components/payment-report-chart";
import { StatusCard } from "./_components/status-card";

export default function DashboardPage() {
  const { defaultCurrency } = useBranding();
  const { t } = useTranslation();
  const [chartCurrency, setChartCurrency] = useState(defaultCurrency);
  const { wallets, isLoading: walletIsFetching } = useWallets();
  const { auth, isLoading: authLoading } = useAuth();

  // Fetch the monthly transaction report data based on the selected currency
  const { data: chartData, isLoading: isChartDataLoading } = useSWR(
    `/transactions/chart/moonthly-report?currency=${chartCurrency}`,
  );

  // Fetch total count of pending withdrawal and deposit requests
  const { data, isLoading: isCounting } = useSWR(
    "/transactions/counts/total?status=pending",
  );

  // Total pending commission
  const { data: pendingCommission, isLoading: pendingCommissionIsLoading } =
    useSWR(auth ? `/commissions/total-pending/${auth?.id}` : "");

  // Create a number formatter that
  // ensures numbers have at least 2 digits (e.g., 01, 02, 10)
  // Locale set to "en-US"
  const numberFormat = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  });

  return (
    <main className="p-4">
      {/* Wallet card */}
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <Case condition={authLoading}>
          <Skeleton className="h-[200px] w-[350px]" />
        </Case>

        <KycWalletCard
          isVerified={!!auth?.getKYCStatus()}
          documentStatus={auth?.kyc ? "submitted" : "not submitted"}
        />
        {walletIsFetching ? (
          <Skeleton className="h-[200px] w-[350px]" />
        ) : (
          wallets?.map(
            (wallet: IWallet) =>
              wallet.pinDashboard && (
                <WalletCardDashboard
                  key={wallet.id}
                  {...{
                    logo: wallet?.logo,
                    title: wallet?.currency.code,
                    balance: wallet.balance,
                    currency: wallet?.currency.code,
                    walletId: wallet.id,
                    card: wallet?.cards?.[0],
                  }}
                />
              ),
          )
        )}

        <Link
          href="/wallets"
          prefetch={false}
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-700 transition duration-300 ease-out hover:text-secondary-800"
        >
          <span>{t("Show all wallets")}</span>
          <ArrowRight2 size={12} />
        </Link>
      </div>
      {/* End Wallet card */}

      <div className="flex flex-col flex-wrap gap-4 lg:flex-row">
        {/* Table section */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Chart */}
          <Card className="flex flex-col gap-4 px-6 pb-4 pt-6 shadow-default">
            <CardHeader className="flex-row items-center justify-between gap-4 p-0">
              <div className="flex flex-col gap-2">
                <CardDescription className="text-xs font-normal leading-4 text-foreground">
                  {t("Total transaction /")} {format(new Date(), "MMMM")}
                </CardDescription>
                <div className="flex h-10 items-center">
                  <CardTitle className="text-xl font-semibold leading-10">
                    {/*
                     * Get and format the current month's total from chart data.
                     * Fallback to 0 if no matching data is found, then format it to 2 decimal places.
                     */}

                    {(
                      chartData?.data?.data?.find(
                        ({ month }: { month: number }) =>
                          numberFormat.format(month)?.toString() ===
                          format(new Date(), "MM"),
                      )?.total ?? 0
                    )?.toFixed(2)}

                    {/* Show currency */}
                    {` ${chartCurrency}`}
                  </CardTitle>
                </div>
              </div>
              <Select value={chartCurrency} onValueChange={setChartCurrency}>
                <SelectTrigger className="h-8 w-[100px] text-sm font-normal leading-5 [&>svg]:size-4">
                  <SelectValue placeholder={defaultCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {wallets?.map((wallet: IWallet) => (
                    <SelectItem key={wallet.id} value={wallet?.currency.code}>
                      {wallet?.currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <Separator className="mb-1 mt-[5px]" />
            <CardContent className="p-0">
              {/* Dashboard Payment Received Report Chart */}
              <PaymentReportChart
                data={chartData?.data?.data ?? []}
                currencyCode={chartCurrency}
                isLoading={isChartDataLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right section */}
        <div className="grid w-full grid-cols-1 gap-4 lg:max-w-[350px]">
          {/* withdraw request card... */}
          <StatusCard
            title={t("Deposit request")}
            Icon={Add}
            iconContainerClass="bg-spacial-green-foreground"
            iconVariant="Outline"
            value={data?.data?.deposit_request}
            isLoading={isCounting}
          />

          {/* withdraw request card... */}
          <StatusCard
            title={t("Withdraw request")}
            Icon={Receive}
            value={data?.data?.withdraw_request}
            isLoading={isCounting}
          />

          {/* commission card... */}
          <StatusCard
            title={t("Commission")}
            Icon={PercentageSquare}
            value={pendingCommission?.data?.total}
            isLoading={pendingCommissionIsLoading}
            currency={pendingCommission?.data?.currency}
          />
        </div>
      </div>
    </main>
  );
}
