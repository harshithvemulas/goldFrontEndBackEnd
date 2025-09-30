import AdminUserRow from "@/components/common/AdminUserRow";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Currency, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { SortingState } from "@tanstack/react-table";
import { Eye } from "iconsax-react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const currency = new Currency();

export default function WithdrawTable({
  data,
  meta,
  isLoading,
  refresh,
}: {
  data: TransactionData[];
  meta: any;
  isLoading: boolean;
  refresh: () => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={
        data
          ? data?.map((d: Record<string, any>) => new TransactionData(d))
          : null
      }
      isLoading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      onRefresh={refresh}
      pagination={{
        total: meta?.total,
        page: meta?.currentPage,
        limit: meta?.perPage,
      }}
      structure={[
        {
          id: "trxId",
          header: t("Trx ID"),
          cell: ({ row }) => (
            <Link
              href={`/withdraws/${row.original?.id}`}
              className="text-xs font-normal text-foreground hover:underline"
            >
              {row.original?.trxId}
            </Link>
          ),
        },

        {
          id: "createdAt",
          header: t("Date"),
          cell: ({ row }) => (
            <div>
              <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                {row.original.getCreatedAt("dd MMM yyyy;")}
              </span>
              <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                {row.original.getCreatedAt("hh:mm a")}
              </span>
            </div>
          ),
        },

        {
          id: "status",
          header: t("Status"),
          cell: ({ row }) => {
            if (row.original?.status === "completed") {
              return (
                <Badge variant="success">
                  {t(startCase(row.original?.status))}
                </Badge>
              );
            }

            if (row.original?.status === "pending") {
              return (
                <Badge variant="secondary" className="bg-muted">
                  {t(startCase(row.original?.status))}
                </Badge>
              );
            }

            if (row.original?.status === "failed") {
              return (
                <Badge variant="destructive">
                  {t(startCase(row.original?.status))}
                </Badge>
              );
            }

            return (
              <Badge variant="secondary" className="bg-muted">
                {t("Pending")}
              </Badge>
            );
          },
        },
        {
          id: "amount",
          header: t("Amount"),
          cell: ({ row }) => {
            let currencyCode;

            if (row.original.type === "exchange") {
              currencyCode = row.original?.metaData?.currencyFrom;
            } else if (row.original.type === "deposit") {
              currencyCode = row.original?.metaData?.currency;
            } else {
              currencyCode = row.original?.from?.currency;
            }

            return (
              <span className="leading-20 text-sm font-semibold text-foreground">
                {currency.format(row.original.amount, currencyCode as string)}
              </span>
            );
          },
        },

        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }) => {
            let currencyCode;

            if (row.original.type === "exchange") {
              currencyCode = row.original?.metaData?.currencyFrom;
            } else if (row.original.type === "deposit") {
              currencyCode = row.original?.metaData?.currency;
            } else {
              currencyCode = row.original?.from?.currency;
            }

            return (
              <span className="leading-20 text-sm font-semibold text-foreground">
                {currency.format(row.original.fee, currencyCode as string)}
              </span>
            );
          },
        },

        {
          id: "after_processing",
          header: t("After Processing"),
          cell: ({ row }) => {
            let currencyCode;

            if (row.original.type === "exchange") {
              currencyCode = row.original?.metaData?.currencyFrom;
            } else if (row.original.type === "deposit") {
              currencyCode = row.original?.metaData?.currency;
            } else {
              currencyCode = row.original?.from?.currency;
            }

            return (
              <span className="leading-20 text-sm font-semibold text-foreground">
                {currency.format(row.original.total, currencyCode as string)}
              </span>
            );
          },
        },

        {
          id: "method",
          header: t("Method"),
          cell: ({ row }) => {
            if (!row.original?.method)
              return <span className="text-sm font-normal">N/A</span>;
            return (
              <span className="line-clamp-2 w-[100px] text-sm font-normal text-foreground">
                {row.original?.method}
              </span>
            );
          },
        },
        {
          id: "customer",
          header: t("Customer"),
          cell: ({ row }) => <AdminUserRow row={row} />,
        },
        {
          id: "view",
          header: t("View"),
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                asChild
              >
                <Link href={`/withdraws/${row.original?.id}`} prefetch={false}>
                  <Eye />
                </Link>
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
