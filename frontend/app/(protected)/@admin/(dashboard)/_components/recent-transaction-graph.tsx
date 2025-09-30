"use client";

import { Loader } from "@/components/common/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Separator from "@/components/ui/separator";
import { useBranding } from "@/hooks/useBranding";
import { useSWR } from "@/hooks/useSWR";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const formatNumber = (value: number) => {
  // Create a NumberFormat instance for the current locale
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });

  // Format the value and return it
  return formatter.format(value);
};

export function RecentTransactionGraph() {
  const type = ["deposit", "withdraw", "exchange"];
  const { defaultCurrency } = useBranding();

  // Construct the query string using URLSearchParams
  const params = new URLSearchParams();
  type.forEach((t) => params.append("type[]", t));
  params.append("currency", defaultCurrency);

  const { data, isLoading } = useSWR(
    `/admin/transactions/chart/dashboard?${params.toString()}`,
  );

  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  if (!data?.data?.data) return null;
  // Extract data for the series
  const dates = Object.keys(data?.data?.data);
  const deposits = dates.map((date) => data?.data?.data[date].deposit);
  const withdraws = dates.map((date) => data?.data?.data[date].withdraw);
  const exchanges = dates.map((date) => data?.data?.data[date].exchange);

  // Updated series based on the data
  const series = [
    {
      name: t("Deposits"),
      data: deposits,
    },
    {
      name: t("Withdraw"),
      data: withdraws,
    },
    {
      name: t("Exchange"),
      data: exchanges,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "basic-bar",
      stacked: false,
      offsetY: 0,
      toolbar: { show: false },
    },
    xaxis: {
      categories: dates,
      labels: {
        style: {
          cssClass: "text-[11px] font-normal leading-4 fill-secondary-text",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
      },
    },
    colors: ["#107C10", "#B10E1C", "#718096"],
    forecastDataPoints: {
      count: 1,
      fillOpacity: 1,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    yaxis: {
      labels: {
        formatter(value) {
          return formatNumber(value);
        },
        style: {
          cssClass: "text-[11px] font-normal leading-4 fill-secondary-text",
        },
      },
    },
    grid: {
      borderColor: "#E0E0E0",
      padding: {
        bottom: 0,
      },
    },
  };

  return (
    <Card className="flex flex-col gap-4 rounded-xl px-6 pb-4 pt-6 shadow-default">
      <CardHeader className="flex-row items-center justify-between gap-4 p-0">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-semibold leading-10">
            {t("Recent transactions")}
          </CardTitle>

          <CardDescription className="hidden" />
          <div className="text-xs font-normal leading-4 text-foreground">
            <ul className="inline-flex gap-2">
              <li className="inline-flex items-center gap-1">
                <span className="block size-2 rounded-full bg-spacial-green" />
                {t("Deposits")}
              </li>
              <li className="inline-flex items-center gap-1">
                <span className="block size-2 rounded-full bg-spacial-red" />
                {t("Withdraw")}
              </li>
              <li className="inline-flex items-center gap-1">
                <span className="block size-2 rounded-full bg-gray" />
                {t("Exchange")}
              </li>
            </ul>
          </div>
        </div>
      </CardHeader>
      <Separator className="mb-1 mt-[5px]" />
      <CardContent className="p-0">
        <Suspense fallback={<Loader />}>
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="300px"
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
