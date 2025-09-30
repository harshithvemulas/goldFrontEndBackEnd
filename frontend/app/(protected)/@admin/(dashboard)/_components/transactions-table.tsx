import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Currency, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { SortingState } from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

const currency = new Currency();

export default function TransactionTable({
  data,
  isLoading,
}: {
  data: TransactionData[];
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data ? [...data.map((d: any) => new TransactionData(d))] : null}
      sorting={sorting}
      isLoading={isLoading}
      setSorting={setSorting}
      structure={[
        {
          id: "type",
          header: t("Type"),
          cell: ({ row }) => {
            return (
              <div>
                <p className="text-xs font-bold text-secondary-text">
                  {startCase(row.original?.type)}
                </p>
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
          cell: ({ row }: any) => {
            const data = row?.original;

            if (data.status === "completed") {
              return <Badge variant="success">{startCase(data.status)}</Badge>;
            }

            if (data.status === "failed") {
              return (
                <Badge variant="destructive">{startCase(data.status)}</Badge>
              );
            }

            return <Badge variant="secondary">{startCase(data.status)}</Badge>;
          },
        },
      ]}
    />
  );
}
