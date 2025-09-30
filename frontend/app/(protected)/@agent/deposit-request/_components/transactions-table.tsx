import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Currency, imageURL, startCase } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { DepositRequestMenu } from "./deposit-request-menu";

// variant
type BadgeVariant =
  | "error"
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "important"
  | null
  | undefined;

const status = {
  pending: "secondary",
  completed: "success",
  failed: "destructive",
};

const currency = new Currency();

export default function TransactionsTable({
  data,
  meta,
}: {
  data: any[];
  meta: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data}
      sorting={sorting}
      setSorting={setSorting}
      pagination={{
        total: meta?.total,
        page: meta?.currentPage,
        limit: meta?.perPage,
      }}
      structure={[
        {
          id: "createdAt",
          header: t("Date"),
          cell: ({ row }) => {
            const data = row.original;

            if (!data?.createdAt) {
              return <span className="text-sm text-secondary-text">N/A</span>;
            }

            return (
              <span className="block w-[100px] text-xs font-normal leading-5 text-foreground sm:text-sm">
                {format(data?.createdAt, "dd MMM yyyy")}
              </span>
            );
          },
        },

        {
          id: "to",
          header: t("To"),
          cell: ({ row }) => {
            const data = row.original;
            const to = data.to ? JSON.parse(data.to) : null;

            if (!to) {
              return <span className="text-sm text-secondary-text">N/A</span>;
            }

            return (
              <div className="w-28 text-sm font-normal leading-5 text-foreground">
                <Avatar className="size-7 border-2 border-primary p-1">
                  <AvatarImage src={imageURL(to?.image)} alt={to?.label} />
                  <AvatarFallback>
                    {" "}
                    {getAvatarFallback(to?.label)}{" "}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm">{to?.label}</span>
              </div>
            );
          },
        },

        {
          id: "status",
          header: t("Status"),
          cell: ({ row }) => {
            const data = row.original;

            if (!data?.status) {
              return <span className="text-sm text-secondary-text">N/A</span>;
            }

            return (
              <Badge
                variant={
                  status[
                    data.status as "pending" | "completed" | "failed"
                  ] as BadgeVariant
                }
              >
                {t(startCase(data.status))}
              </Badge>
            );
          },
        },

        {
          id: "status",
          header: t("Payment Status"),
          cell: ({ row }) => {
            const data = row.original;

            if (!data?.status) {
              return <span className="text-sm text-secondary-text">N/A</span>;
            }

            return (
              <Badge
                variant={
                  status[
                    data.status as "pending" | "completed" | "failed"
                  ] as BadgeVariant
                }
              >
                {t(startCase(data.status))}
              </Badge>
            );
          },
        },

        {
          id: "amount",
          header: t("Amount"),
          cell: ({ row }) => {
            const data = row.original;
            const metaData = JSON.parse(data.metaData);

            return (
              <span className="block whitespace-nowrap pr-3 text-xs font-semibold leading-4 sm:text-sm">
                {currency.format(data.amount, metaData.currency)}
              </span>
            );
          },
        },

        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }) => {
            const data = row.original;
            const metaData = JSON.parse(data.metaData);

            return (
              <span className="block whitespace-nowrap pr-3 text-xs font-semibold leading-4 sm:text-sm">
                {currency.format(data.fee, metaData.currency)}
              </span>
            );
          },
        },

        {
          id: "after_processing",
          header: t("After Processing"),
          cell: ({ row }) => {
            const data = row.original;
            const metaData = JSON.parse(data.metaData);

            return (
              <span className="block whitespace-nowrap pr-3 text-xs font-semibold leading-4 sm:text-sm">
                {currency.format(data.total, metaData.currency)}
              </span>
            );
          },
        },
        {
          id: "trxId",
          header: t("Trx ID"),
          cell: ({ row }) => {
            const data = row.original;

            return (
              <Link
                href={`/deposit-request/${data?.trxId}`}
                className="block whitespace-nowrap text-xs font-normal leading-4 hover:underline sm:text-sm"
              >
                {data.trxId}
              </Link>
            );
          },
        },

        {
          id: "menu",
          header: t("Menu"),
          cell: ({ row }) => <DepositRequestMenu row={row.original} />,
        },
      ]}
    />
  );
}
