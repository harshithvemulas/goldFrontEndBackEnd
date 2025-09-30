import AdminUserRow from "@/components/common/AdminUserRow";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Currency, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { SortingState } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import MenuButton from "./menu";

const currency = new Currency();

export default function ExchangesTable({
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
              href={`/exchanges/${row.original?.id}`}
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
            if (row.original?.trxId === "completed") {
              return (
                <Badge variant="success">
                  {startCase(row.original?.trxId)}
                </Badge>
              );
            }

            if (row.original?.trxId === "pending") {
              return (
                <Badge variant="secondary" className="bg-muted">
                  {startCase(row.original?.trxId)}
                </Badge>
              );
            }

            if (row.original?.trxId === "failed") {
              return (
                <Badge variant="destructive">
                  {startCase(row.original?.trxId)}
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
          id: "from",
          header: t("From"),
          cell: ({ row }) => (
            <span className="leading-20 text-sm font-semibold text-foreground">
              {currency.formatVC(
                row.original.metaData.amountFrom as number,
                row.original.metaData.currencyFrom as string,
              )}
            </span>
          ),
        },
        {
          id: "to",
          header: t("To"),
          cell: ({ row }) => (
            <span className="leading-20 text-sm font-semibold text-foreground">
              {currency.formatVC(
                row.original.amount,
                row.original.metaData.currencyTo as string,
              )}
            </span>
          ),
        },
        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }) => (
            <span className="leading-20 text-sm font-semibold text-foreground">
              {currency.formatVC(
                row.original.fee,
                row.original.metaData.currencyTo as string,
              )}
            </span>
          ),
        },
        {
          id: "after_processing",
          header: t("After Processing"),
          cell: ({ row }) => {
            let currencyCode;

            if (row.original.type === "exchange") {
              currencyCode = row.original?.metaData?.currencyTo;
            } else if (row.original.type === "deposit") {
              currencyCode = row.original?.metaData?.currency;
            } else {
              currencyCode = row.original?.from?.currency;
            }

            return (
              <span className="leading-20 text-sm font-semibold text-foreground">
                {currency.formatVC(row.original.total, currencyCode as string)}
              </span>
            );
          },
        },
        {
          id: "user",
          header: t("User"),
          cell: ({ row }) => <AdminUserRow row={row} />,
        },
        {
          id: "menu",
          header: t("Menu"),
          cell: (info) => <MenuButton {...info} />,
        },
      ]}
    />
  );
}
