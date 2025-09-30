"use client";

import { InvestmentMenu } from "@/app/(protected)/@admin/investments/_components/investment-menu";
import UpdateStatus from "@/app/(protected)/@admin/investments/_components/update-status";
import AdminUserRow from "@/components/common/AdminUserRow";
import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery, startCase } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Investments() {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  const { t } = useTranslation();

  const { data, isLoading, meta, refresh } = useTableData(
    `/admin/investments?${searchParams.toString()}`,
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
        <div className="flex items-center sm:h-12">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              className="flex-1"
              placeholder={t("Search...")}
            />
          </div>
          <div />
        </div>

        <Separator className="my-4" />

        <DataTable
          data={data ?? []}
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
              id: "id",
              header: t("ID"),
              cell: ({ row }) => (
                <p className="font-normal">#{row.original?.id}</p>
              ),
            },
            {
              id: "name",
              header: t("Plan"),
              cell: ({ row }) => (
                <p className="whitespace-nowrap font-normal">
                  {row.original?.name}
                </p>
              ),
            },
            {
              id: "durationType",
              header: t("Term"),
              cell: ({ row }) => (
                <p className="font-normal">
                  {startCase(row.original?.durationType)}
                </p>
              ),
            },
            {
              id: "interestRate",
              header: t("Profit rate"),
              cell: ({ row }) => <p>{row.original?.interestRate}%</p>,
            },
            {
              id: "amountInvested",
              header: t("Amount"),
              cell: ({ row }) => (
                <p className="whitespace-nowrap">
                  {row.original?.amountInvested}{" "}
                  {row.original?.currency?.toUpperCase()}
                </p>
              ),
            },
            {
              id: "profit",
              header: t("Profit"),
              cell: ({ row }) => (
                <p className="whitespace-nowrap text-success">
                  {row.original?.profit} {row.original?.currency?.toUpperCase()}
                </p>
              ),
            },
            {
              id: "duration",
              header: t("Duration"),
              cell: ({ row }) => (
                <p className="whitespace-nowrap">
                  {row.original?.duration}{" "}
                  {row.original?.duration > 1 ? t("Days") : t("Day")}
                </p>
              ),
            },
            {
              id: "status",
              header: t("Status"),
              cell: ({ row }) => (
                <UpdateStatus
                  investmentId={row.original?.id}
                  status={row.original?.status}
                  onMutate={refresh}
                />
              ),
            },
            {
              id: "createdAt",
              header: t("Opening date"),
              cell: ({ row }) => (
                <div>
                  <p className="whitespace-nowrap font-normal">
                    {format(row.original?.createdAt, "dd MMM yyyy;")}
                  </p>
                  <p className="whitespace-nowrap font-normal">
                    {format(row.original?.createdAt, "hh:mm a")}
                  </p>
                </div>
              ),
            },
            {
              id: "endsAt",
              header: t("End date"),
              cell: ({ row }) => (
                <div>
                  <p className="whitespace-nowrap font-normal">
                    {format(row.original?.endsAt, "dd MMM yyyy;")}
                  </p>
                  <p className="whitespace-nowrap font-normal">
                    {format(row.original?.endsAt, "hh:mm a")}
                  </p>
                </div>
              ),
            },
            {
              id: "user",
              header: t("User"),
              cell: ({ row }) => <AdminUserRow row={row} />,
            },
            {
              id: "actions",
              header: t("Actions"),
              cell: ({ row }) => {
                return (
                  <InvestmentMenu
                    onMutate={refresh}
                    investmentId={row.original?.id}
                  />
                );
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
