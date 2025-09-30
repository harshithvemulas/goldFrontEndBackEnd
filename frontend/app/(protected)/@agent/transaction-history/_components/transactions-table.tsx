import DataTable from "@/components/common/DataTable";
import TransactionTableMenu from "@/components/common/TransactionTableMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Currency, imageURL, startCase } from "@/lib/utils";
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
      isLoading={isLoading}
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

            if (!data.createdAt)
              return <span className="text-sm font-normal">N/A</span>;

            return (
              <span className="block w-[100px] text-sm font-normal leading-5 text-foreground">
                {format(data.createdAt, "dd MMM yyyy")}
              </span>
            );
          },
        },
        {
          id: "type",
          header: t("Type"),
          cell: ({ row }) => {
            const data = row.original;

            if (!data.type)
              return <span className="text-sm font-normal">N/A</span>;

            return (
              <div>
                <p className="text-xs font-bold text-foreground">
                  {startCase(data.type)}
                </p>
              </div>
            );
          },
        },

        {
          id: "from",
          header: t("From"),
          cell: ({ row }) => {
            const data = row.original;

            const from = data?.from && JSON.parse(data.from);
            if (!from || data.type === "deposit") {
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
                  <AvatarImage src={imageURL(from.image)} alt={from.label} />
                  <AvatarFallback>
                    {" "}
                    {getAvatarFallback(from.label)}{" "}
                  </AvatarFallback>
                </Avatar>
                <span>{from.label}</span>
              </div>
            );
          },
        },

        {
          id: "to",
          header: t("To"),
          cell: ({ row }) => {
            const data = row.original;

            const to = data?.to && JSON.parse(data.to);

            if (!to || data.type === "withdraw") {
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
                  <AvatarImage src={imageURL(to.image)} alt={to.label} />
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
          id: "status",
          header: t("Status"),
          cell: ({ row }) => {
            const data = row?.original;

            if (!data.status)
              return <span className="text-sm font-normal">N/A</span>;

            if (data.status === "completed") {
              return <Badge variant="success">{startCase(data.status)}</Badge>;
            }

            if (data.status === "pending") {
              return (
                <Badge variant="secondary" className="bg-muted">
                  {startCase(data.status)}
                </Badge>
              );
            }

            if (data.status === "failed") {
              return (
                <Badge variant="destructive">{startCase(data.status)}</Badge>
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
            const data = row.original;
            if (!data?.trxId)
              return <span className="text-sm font-normal">N/A</span>;
            return (
              <span className="text-xs font-normal text-foreground">
                {data.trxId}
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
          id: "menu",
          header: t("Menu"),
          cell: ({ row }) => <TransactionTableMenu row={row.original} />,
        },
      ]}
    />
  );
}
