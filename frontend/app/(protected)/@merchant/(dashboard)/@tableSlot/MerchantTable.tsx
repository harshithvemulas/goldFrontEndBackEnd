"use client";

import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { useTableData } from "@/hooks/useTableData";
import { Currency, startCase } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

const currency = new Currency();

export function MerchantTable() {
  const { t } = useTranslation();
  const sp = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useTableData(
    `/payments/merchants/list-view?${sp.toString()}`,
  );

  return (
    <DataTable
      data={data}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
      structure={[
        {
          id: "description",
          header: t("Description"),
          cell: ({ row }: any) => {
            const data = row?.original;
            const type = data?.type;

            return (
              <div>
                <p className="text-xs font-bold text-secondary-text">
                  {startCase(type)}
                </p>
              </div>
            );
          },
        },
        {
          id: "amount",
          header: t("Amount"),
          cell: ({ row }: any) => {
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
                    currency.format(data.amount, from?.currency),
                  )}
              </span>
            );
          },
        },

        {
          id: "fee",
          header: t("Fee"),
          cell: ({ row }: any) => {
            const data = row?.original;
            const from = data?.from && JSON.parse(data.from);
            const metadata = data?.metaData && JSON.parse(data?.metaData);

            return (
              <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                {match(data)
                  .with({ type: "exchange" }, () => {
                    return currency.format(data?.fee, metadata?.currency);
                  })
                  .with({ type: "deposit" }, () =>
                    currency.format(data.fee, metadata?.currency),
                  )
                  .otherwise(() => currency.format(data.fee, from?.currency))}
              </span>
            );
          },
        },
        {
          id: "afterProcessing",
          accessorKey: "afterProcessing",
          header: t("After Processing"),
          cell: ({ row }: any) => {
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
                  .otherwise(() => currency.format(data.total, to?.currency))}
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
              return (
                <Badge variant="success">{startCase(t(data.status))}</Badge>
              );
            }

            if (data.status === "failed") {
              return (
                <Badge variant="destructive">{startCase(t(data.status))}</Badge>
              );
            }

            return (
              <Badge variant="secondary">{startCase(t(data.status))}</Badge>
            );
          },
        },
      ]}
    />
  );
}
