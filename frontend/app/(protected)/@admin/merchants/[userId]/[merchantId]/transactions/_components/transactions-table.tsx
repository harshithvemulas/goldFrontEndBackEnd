import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Currency, startCase } from "@/lib/utils";
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
}: {
  data: any;
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
          id: "trxId",
          header: t("Trx ID"),
          cell: (args: any) => (
            <span className="text-sm font-normal text-secondary-text">
              {args.row.original?.trxId}
            </span>
          ),
        },
        {
          id: "createdAt",
          header: t("Date"),
          cell: (args: any) => {
            const createdAt = args.row.original?.createdAt;

            if (!createdAt)
              return <span className="text-secondary-text"> N/A </span>;

            return (
              <span className="block w-24 text-sm font-normal leading-5 text-secondary-text">
                {format(createdAt, "dd MMM yyyy hh:mm b")}
              </span>
            );
          },
        },
        {
          id: "type",
          header: t("Type"),
          cell: (args: any) => (
            <div>
              <p className="text-xs font-bold text-secondary-text">
                {startCase(args.row.original?.type)}
              </p>
            </div>
          ),
        },

        {
          id: "status",
          header: t("Status"),
          cell: (args: any) => {
            const status = args.row.original?.status;

            if (status === "completed") {
              return <Badge variant="success">{t("Complete")}</Badge>;
            }

            if (status === "failed") {
              return <Badge variant="destructive">{t("Failed")}</Badge>;
            }

            return <Badge variant="secondary">{t("Pending")}</Badge>;
          },
        },

        {
          id: "amount",
          header: t("Amount"),
          cell: ({ row }) => {
            const data = row?.original;
            const from = data?.from && JSON.parse(data.from);

            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () =>
                    currency.format(
                      metadata?.amountFrom,
                      metadata?.currencyFrom,
                    ),
                  )
                  .with({ type: "deposit" }, () =>
                    currency.format(data.amount, metadata?.currency),
                  )
                  .otherwise(() =>
                    currency.format(data.amount, from?.currency as string),
                  )}
              </span>
            );
          },
        },

        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }) => {
            const data = row?.original;
            const from = data?.from && JSON.parse(data.from);
            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () =>
                    currency.format(data?.fee, metadata?.currency),
                  )
                  .with({ type: "deposit" }, () =>
                    currency.format(data.fee, metadata?.currency),
                  )
                  .otherwise(() =>
                    currency.format(data.fee, from?.currency as string),
                  )}
              </span>
            );
          },
        },

        {
          id: "after_processing",
          header: t("After Processing"),
          cell: ({ row }) => {
            const data = row?.original;
            const to = data?.to && JSON.parse(data.to);
            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () =>
                    currency.format(data.total, metadata?.currencyTo),
                  )
                  .with({ type: "deposit" }, () =>
                    currency.format(data.total, metadata?.currency),
                  )
                  .otherwise(() =>
                    currency.format(data.total, to?.currency as string),
                  )}
              </span>
            );
          },
        },

        {
          id: "method",
          header: t("Method"),
          cell: ({ row }) => {
            const data = row.original;
            if (!data?.method)
              return <span className="text-sm font-normal">N/A</span>;
            return (
              <span className="line-clamp-2 w-[100px] text-sm font-normal text-foreground">
                {data.method}
              </span>
            );
          },
        },
        {
          id: "agent",
          header: t("Agent"),
          cell: ({ row }) => {
            const data = row.original;

            const to = data?.to && JSON.parse(data.to);

            if (!to || data.method !== "agent") {
              return (
                <div className="text-sm font-normal leading-5 text-foreground">
                  <span className="block size-5 rounded-full bg-primary" />
                  <span>N/A</span>
                </div>
              );
            }

            return (
              <div className="text-sm font-normal leading-5 text-foreground">
                <Avatar className="size-7 border-2 border-primary p-1">
                  <AvatarImage src={to.image} alt={to.label} />
                  <AvatarFallback>
                    {" "}
                    {getAvatarFallback(to.label)}{" "}
                  </AvatarFallback>
                </Avatar>
                <span>{to.label}</span>
              </div>
            );
          },
        },
        {
          id: "merchant",
          header: t("Merchant"),
          cell: ({ row }) => {
            const data = row.original;

            const to = data?.to && JSON.parse(data.to);

            if (!to || data.method === "agent") {
              return (
                <div className="text-sm font-normal leading-5 text-foreground">
                  <span className="block size-5 rounded-full bg-primary" />
                  <span>N/A</span>
                </div>
              );
            }

            return (
              <div className="text-sm font-normal leading-5 text-foreground">
                <Avatar className="size-7 border-2 border-primary p-1">
                  <AvatarImage src={to.image} alt={to.label} />
                  <AvatarFallback>{getAvatarFallback(to.label)}</AvatarFallback>
                </Avatar>
                <span>{to.label}</span>
              </div>
            );
          },
        },
      ]}
    />
  );
}
