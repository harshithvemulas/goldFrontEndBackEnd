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
import { WithdrawRequestMenu } from "./withdraw-request-menu";

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
  isLoading,
}: {
  data: any[];
  meta: any;
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
      pagination={{
        total: meta?.total,
        page: meta?.currentPage,
        limit: meta?.perPage,
      }}
      structure={[
        {
          id: "createdAt",
          header: t("Date"),
          cell: (args: any) => {
            const createdAt = args.row.original?.createdAt;
            if (!createdAt)
              return (
                <span className="font-normal text-secondary-text">sN/A</span>
              );

            return (
              <span className="whitespace-nowrap text-xs font-normal leading-5 text-foreground sm:text-sm">
                {format(createdAt, "dd MMM yyyy")}
              </span>
            );
          },
        },

        {
          id: "from",
          header: t("From"),
          cell: (args: any) => {
            const from = args.row.original?.from
              ? JSON.parse(args.row.original.from)
              : null;

            if (!from)
              return (
                <span className="font-normal text-secondary-text">N/A</span>
              );

            return (
              <div className="min-w-28 text-sm font-normal leading-5 text-foreground">
                <Avatar className="size-7 border-2 border-primary p-1">
                  <AvatarImage src={imageURL(from?.image)} alt={from?.label} />
                  <AvatarFallback>
                    {" "}
                    {getAvatarFallback(from?.label)}{" "}
                  </AvatarFallback>
                </Avatar>
                <span>{from?.label}</span>
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
          id: "amount",
          header: t("Amount Sent"),
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
          id: "amount_received",
          header: t("Amount Received"),
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
                href={`/withdraw-request/${data.trxId}`}
                className="block whitespace-nowrap text-xs font-normal leading-4 hover:cursor-pointer hover:underline sm:text-sm"
              >
                {data.trxId}
              </Link>
            );
          },
        },
        {
          id: "method",
          header: t("Method"),
          cell: ({ row }) => {
            const data = row.original;

            return (
              <span className="block whitespace-nowrap text-xs font-normal capitalize leading-4 sm:text-sm">
                {data.method}
              </span>
            );
          },
        },
        {
          id: "menu",
          header: t("Menu"),
          cell: ({ row }) => <WithdrawRequestMenu row={row.original} />,
        },
      ]}
    />
  );
}
