"use client";

import { Loader } from "@/components/common/Loader";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PaymentReportChartProps {
  data?: Array<{ month: number; total: number }>; // Expecting an array of data
  currencyCode: string;
  isLoading: boolean;
}

export function PaymentReportChart({
  data = [], // Default to empty array if no data is provided
  currencyCode,
  isLoading = true,
}: PaymentReportChartProps) {
  const { t } = useTranslation();

  const categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatNumber = (value: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "code",
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    });

    return formatter.format(value);
  };

  const options: ApexOptions = {
    chart: {
      id: "payment-report-bar",
      stacked: false,
      offsetY: 0,
      toolbar: { show: false },
    },
    xaxis: {
      type: "category",
      categories, // Use the categories here
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
    // need to color current month
    colors: categories.map((item) =>
      item === format(new Date(), "MMM") ? "#EE792B" : "#718096",
    ),
    legend: { show: false },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 10,
        borderRadiusApplication: "end",
      },
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

  const series = [
    {
      name: t("Total Payments"),
      data: data?.map((item) => item.total), // Extract totals from the data
    },
  ];

  if (isLoading) {
    return <div>{t("Loading...")}</div>; // Show loading state if data is being fetched
  }

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Chart
          options={options}
          series={series}
          type="bar"
          width="100%"
          height="200px"
        />
      </Suspense>
    </div>
  );
}
