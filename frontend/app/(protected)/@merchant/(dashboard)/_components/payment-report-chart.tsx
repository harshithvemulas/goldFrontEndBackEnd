"use client";

import { Loader } from "@/components/common/Loader";
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
    "Fab",
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
    // Create a NumberFormat instance for the current locale
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "code",
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    });

    // Format the value and return it
    return formatter.format(value);
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "basic-bar",
      stacked: false,
      offsetY: 0, // Adjust this value as needed
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          cssClass: "text-[11px] font-normal leading-4 fill-secondary-text",
        },
      },
      axisBorder: {
        show: false, // Hide the x-axis border if needed
      },
      axisTicks: {
        show: false, // Hide the x-axis ticks if needed
      },
    },
    dataLabels: {
      enabled: false,
    },
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
      borderColor: "#E0E0E0", // Color of the x-axis grid lines
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
