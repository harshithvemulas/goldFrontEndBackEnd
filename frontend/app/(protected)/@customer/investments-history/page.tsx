"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { Badge } from "@/components/ui/badge";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery, startCase } from "@/lib/utils";
import { type SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function InvestmentsHistory() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { data, meta, isLoading } = useTableData(
    `/investments/history?${searchParams.toString()}`,
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
          </div>
        </div>

        <Separator className="my-4" />

        {/* Data table */}
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
                    {format(data.createdAt, "dd MMM yyyy; \n hh:mm a")}
                  </span>
                );
              },
            },
            {
              id: "name",
              header: t("Name"),
              cell: ({ row }) => <p>{row.original?.name}</p>,
            },
            {
              id: "status",
              header: t("Status"),
              cell: ({ row }: any) => {
                const data = row?.original;

                if (data.status === "completed") {
                  return (
                    <Badge variant="success">{startCase(data.status)}</Badge>
                  );
                }

                if (data.status === "withdrawn") {
                  return (
                    <Badge variant="default">{startCase(data.status)}</Badge>
                  );
                }

                if (data.status === "on_hold") {
                  return (
                    <Badge variant="warning">{startCase(data.status)}</Badge>
                  );
                }

                return (
                  <Badge variant="secondary">{startCase(data.status)}</Badge>
                );
              },
            },
            {
              id: "amountInvested",
              header: t("Amount Invested"),
              cell: ({ row }) => (
                <p className="whitespace-nowrap">
                  {row.original?.amountInvested}{" "}
                  {row.original?.currency?.toUpperCase()}
                </p>
              ),
            },
            {
              id: "interestRate",
              header: t("Interest Rate"),
              cell: ({ row }) => <p>{row.original?.interestRate}%</p>,
            },
            {
              id: "profit",
              header: t("Profit"),
              cell: ({ row }) => (
                <p className="whitespace-nowrap">
                  {row.original?.profit} {row.original?.currency?.toUpperCase()}
                </p>
              ),
            },
            {
              id: "duration",
              header: t("Duration"),
              cell: ({ row }) => (
                <p className="font-normal">
                  {row.original?.duration}{" "}
                  {row.original?.duration > 1 ? t("Days") : t("Day")}
                </p>
              ),
            },
            {
              id: "durationType",
              header: t("Duration Type"),
              cell: ({ row }) => (
                <p className="font-normal">
                  {startCase(row.original?.durationType)}
                </p>
              ),
            },
            {
              id: "withdrawAfterMatured",
              header: t("Withdraw Type"),
              cell: ({ row }) =>
                row.original?.withdrawAfterMatured ? (
                  <Badge variant="important">{t("Yes")}</Badge>
                ) : (
                  <Badge variant="secondary">{t("No")}</Badge>
                ),
            },
          ]}
        />
      </div>
    </div>
  );
}
