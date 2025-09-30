import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Currency, startCase } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

const currency = new Currency();

export default function TransactionHistoryTable({
  data,
  isLoading,
}: {
  data: any;
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
      structure={[
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
          id: "amount",
          header: t("Amount"),
          cell: ({ row }) => {
            const data = row?.original;
            const from = data?.from && JSON.parse(data.from);
            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return match(data)
              .with({ type: "exchange" }, () => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(
                      metadata?.amountFrom,
                      metadata?.currencyFrom,
                    )}
                  </span>
                );
              })
              .with({ type: "deposit" }, () => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.amount, metadata?.currency)}
                  </span>
                );
              })
              .otherwise(() => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.amount, from?.currency)}
                  </span>
                );
              });
          },
        },

        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }) => {
            const data = row?.original;
            const from = data?.from && JSON.parse(data.from);
            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return match(data)
              .with({ type: "exchange" }, () => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data?.fee, metadata?.currency)}
                  </span>
                );
              })
              .with({ type: "deposit" }, () => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.fee, metadata?.currency)}
                  </span>
                );
              })
              .otherwise(() => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.fee, from?.currency)}
                  </span>
                );
              });
          },
        },

        {
          id: "after_processing",
          header: t("After Processing"),
          cell: ({ row }) => {
            const data = row?.original;
            const to = data?.to && JSON.parse(data.to);
            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return match(data)
              .with({ type: "exchange" }, () => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.total, metadata?.currencyTo)}
                  </span>
                );
              })
              .with({ type: "deposit" }, () => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.total, metadata?.currency)}
                  </span>
                );
              })
              .otherwise(() => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(data.total, to?.currency)}
                  </span>
                );
              });
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
      ]}
    />
  );
}
