"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { Badge } from "@/components/ui/badge";
import Separator from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { useTableData } from "@/hooks/useTableData";
import { Currency, searchQuery } from "@/lib/utils";
import { Settlement } from "@/types/settlement";
import { type SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { FilterButton } from "./_components/filter";

const currency = new Currency();

export default function TransactionHistoryPage() {
  const { t } = useTranslation();
  const { defaultCurrency } = useBranding();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { auth } = useAuth();
  const { data, isLoading } = useTableData(
    `/commissions/${auth?.id}?${searchParams.toString()}`,
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
        <div className="flex items-center justify-end sm:h-12">
          <div className="flex flex-1 flex-wrap items-center gap-4 sm:flex-initial sm:flex-row sm:flex-nowrap">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              containerClass="w-full sm:max-w-56"
            />

            <FilterButton />

            <TableExportButton
              url={`/commissions/export/${auth?.id}?${searchParams.toString()}`}
            />
          </div>
          <div />
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <DataTable
          data={
            data
              ? data?.map((d: Record<string, unknown>) => new Settlement(d))
              : []
          }
          isLoading={isLoading}
          sorting={sorting}
          setSorting={setSorting}
          structure={[
            {
              id: "createdAt",
              header: t("Date"),
              cell: ({ row }) => (
                <span className="whitespace-nowrap text-xs font-normal leading-5 text-foreground sm:text-sm">
                  {row.original?.createdAt
                    ? format(row.original.createdAt, "dd MMM yyyy")
                    : "N/A"}
                </span>
              ),
            },
            {
              id: "status",
              header: t("Status"),
              cell: ({ row }) => {
                if (row.original?.status === "completed") {
                  return <Badge variant="success">{t("Completed")}</Badge>;
                }
                if (row.original?.status === "failed") {
                  return <Badge variant="destructive">{t("Failed")}</Badge>;
                }
                return <Badge variant="secondary">{t("Pending")}</Badge>;
              },
            },
            {
              id: "amount",
              header: t("Amount sent"),
              cell: ({ row }) => (
                <span className="text-xs font-semibold leading-4 text-foreground sm:text-sm">
                  {currency.format(row.original?.amount, defaultCurrency)}
                </span>
              ),
            },
            {
              id: "transaction.trxId",
              header: t("Trx ID"),
              cell: ({ row }) => (
                <span className="text-xs font-normal leading-4 text-foreground sm:text-sm">
                  {row.original?.transaction.trxId}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
