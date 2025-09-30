"use client";

import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import TransactionCategoryFilter from "@/components/common/TransactionCategoryFilter";
import { Checkbox } from "@/components/ui/checkbox";
import Label from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import TransactionsTable from "./_components/transactions-table";

export default function TransactionHistoryPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  const { t } = useTranslation();

  // transaction
  const { data, meta, isLoading, refresh, filter } = useTableData(
    `/transactions/?${searchParams.toString()}`,
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
          <div className="flex h-full w-full flex-col items-center gap-4 rounded-md bg-accent p-1 sm:w-fit sm:flex-row">
            <TransactionCategoryFilter filter={filter} />

            <div className="flex h-full w-full items-center gap-2.5 px-4 py-2.5 sm:w-40 sm:px-0">
              <Checkbox
                id="bookmark"
                defaultChecked={searchParams.get("bookmark") === "true"}
                onCheckedChange={(checked) =>
                  filter("bookmark", checked.toString())
                }
                className="border-foreground/40 data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="bookmark"
                className="text-sm font-normal hover:cursor-pointer"
              >
                {t("Show bookmarks")}
              </Label>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-4 md:flex-nowrap md:justify-end">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              containerClass="w-full sm:w-auto"
            />

            {/* Filter Button */}
            <TableFilter
              canFilterByAgent
              canFilterByGateway
              canFilterByMethod
            />

            <TableExportButton url="/transactions/export/all" align="end" />
          </div>
          <div />
        </div>

        <Separator className="my-4" />

        {/* Data table */}
        <TransactionsTable
          data={data}
          meta={meta}
          isLoading={isLoading}
          refresh={refresh}
        />
      </div>
    </div>
  );
}
