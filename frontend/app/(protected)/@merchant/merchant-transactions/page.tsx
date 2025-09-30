"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import TransactionTableMenu from "@/components/common/TransactionTableMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { type SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function MerchantTransactions() {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();
  const pathname = usePathname();

  const { t } = useTranslation();

  const { data, meta, isLoading, refresh } = useTableData(
    `/payments/merchants/list-view?${searchParams.toString()}`,
    { keepPreviousData: true },
  );

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  return (
    <div className="p-4">
      <div className="w-full rounded-xl bg-background p-4 shadow-default md:p-6">
        {/* filter bar */}
        <div className="flex w-full flex-col gap-4 md:justify-between xl:h-12 xl:flex-row xl:items-center">
          <div className="flex w-full flex-wrap items-center gap-4 md:flex-nowrap md:justify-end">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              containerClass="w-full sm:w-auto"
            />

            <TableFilter canFilterByGateway canFilterByMethod />
            <TableExportButton url="/payments/merchants/export" align="end" />
          </div>
          <div />
        </div>

        <Separator className="my-4" />

        {/* Data table */}
        <DataTable
          data={
            data
              ? [
                  ...data.map(
                    (d: Record<string, any>) => new TransactionData(d),
                  ),
                ]
              : []
          }
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
                return (
                  <div>
                    <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                      {row.original.getCreatedAt("dd MMM yyyy;")}
                    </span>
                    <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                      {row.original.getCreatedAt("hh:mm a")}
                    </span>
                  </div>
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
                return (
                  <div className="text-sm font-normal leading-5 text-foreground">
                    <Avatar className="size-7 border-2 border-primary p-1 font-semibold">
                      <AvatarImage
                        src={row.original?.from?.image}
                        alt={row.original?.from?.label}
                      />
                      <AvatarFallback>
                        {getAvatarFallback(row.original?.from?.label)}{" "}
                      </AvatarFallback>
                    </Avatar>
                    <span>{row.original.from.label}</span>
                  </div>
                );
              },
            },
            {
              id: "amount",
              header: t("Amount"),
              cell: ({ row }) => {
                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {`${row.original?.amount} ${row.original.metaData?.currency}`}
                  </span>
                );
              },
            },
            {
              id: "fee",
              header: t("Total Commission"),
              cell: ({ row }) => {
                return (
                  <span className="leading-20 text-sm font-semibold text-success">
                    {`${row.original?.fee} ${row.original.metaData.currency}`}
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

                if (row.original?.status === "failed") {
                  return (
                    <Badge variant="destructive">
                      {t(startCase(row.original?.status))}
                    </Badge>
                  );
                }

                return (
                  <Badge variant="secondary">
                    {t(startCase(row.original?.status))}
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
              id: "menu",
              header: t("Menu"),
              cell: ({ row }) => <TransactionTableMenu row={row.original} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
