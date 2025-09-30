import DataTable from "@/components/common/DataTable";
import TransactionTableMenu from "@/components/common/TransactionTableMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Currency, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

const currency = new Currency();

export default function TransactionsTable({
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
      data={data ? data?.map((d: any) => new TransactionData(d)) : []}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
      onRefresh={refresh}
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

            if (!data.createdAt)
              return <span className="text-sm font-normal">N/A</span>;

            return (
              <span className="block w-[100px] text-sm font-normal leading-5 text-foreground">
                {format(data.createdAt, "dd MMM yyyy; \n hh:mm a")}
              </span>
            );
          },
        },
        {
          id: "type",
          header: t("Type"),
          cell: ({ row }) => {
            if (!row.original?.type) {
              return <span className="text-sm font-normal">N/A</span>;
            }
            return (
              <div>
                <p className="text-xs font-bold text-foreground">
                  {startCase(row.original?.type)}
                </p>
              </div>
            );
          },
        },
        {
          id: "from.label",
          header: t("From"),
          cell: ({ row }) => {
            if (!row.original.from && row.original.type === "deposit") {
              return (
                <div className="text-sm font-normal leading-5 text-foreground">
                  <span className="block size-5 rounded-full bg-primary" />
                  <span> N/A</span>
                </div>
              );
            }
            return (
              <div className="text-sm font-normal leading-5 text-foreground">
                <Avatar className="size-7 border-2 border-primary p-1">
                  <AvatarImage
                    src={row.original.from?.image}
                    alt={row.original.from?.label}
                  />
                  <AvatarFallback>
                    {getAvatarFallback(row.original.from.label)}
                  </AvatarFallback>
                </Avatar>
                <span>{row.original.from.label}</span>
              </div>
            );
          },
        },
        {
          id: "from.label",
          header: t("To"),
          cell: ({ row }) => {
            if (!row.original.to && row.original.type === "withdraw") {
              return (
                <div className="text-sm font-normal leading-5 text-foreground">
                  <span className="block size-5 rounded-full bg-primary" />
                  <span> N/A</span>
                </div>
              );
            }
            return (
              <div className="text-sm font-normal leading-5 text-foreground">
                <Avatar className="size-7 border-2 border-primary p-1">
                  <AvatarImage
                    src={row.original.to?.image}
                    alt={row.original.to?.label}
                  />
                  <AvatarFallback>
                    {getAvatarFallback(row.original.to.label)}
                  </AvatarFallback>
                </Avatar>
                <span>{row.original.to.label}</span>
              </div>
            );
          },
        },
        {
          id: "amount",
          header: t("Amount"),
          cell: ({ row }) => {
            const data = row.original;
            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () =>
                    currency.format(
                      data?.metaData?.amountFrom,
                      data?.metaData?.currencyFrom,
                    ),
                  )
                  .with({ type: "deposit" }, () =>
                    currency.format(data.amount, data?.metaData?.currency),
                  )
                  .otherwise(() =>
                    currency.format(
                      data.amount,
                      data?.from?.currency as string,
                    ),
                  )}
              </span>
            );
          },
        },
        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }) => {
            const data = row.original;

            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () =>
                    currency.format(data?.fee, data.metaData?.currency),
                  )
                  .with({ type: "deposit" }, () =>
                    currency.format(data.fee, data.metaData?.currency),
                  )
                  .otherwise(() =>
                    currency.format(data.fee, data.from?.currency as string),
                  )}
              </span>
            );
          },
        },
        {
          id: "total",
          header: t("After Processing"),
          cell: ({ row }) => {
            const data = row.original;

            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () =>
                    currency.format(data.total, data.metaData?.currencyTo),
                  )
                  .with({ type: "deposit" }, () =>
                    currency.format(data.total, data.metaData?.currency),
                  )
                  .otherwise(() =>
                    currency.format(data.total, data.to?.currency as string),
                  )}
              </span>
            );
          },
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
          id: "trxId",
          header: t("Trx ID"),
          cell: ({ row }) => {
            if (!row.original?.trxId)
              return <span className="text-sm font-normal">N/A</span>;
            return (
              <span className="text-xs font-normal text-foreground">
                {row.original?.trxId}
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
          id: "menu",
          header: t("Menu"),
          cell: ({ row }) => <TransactionTableMenu row={row.original} />,
        },
      ]}
    />
  );
}
