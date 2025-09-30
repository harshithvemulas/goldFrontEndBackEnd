"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import TransferTable from "@/app/(protected)/@admin/transfers/_components/transfer-table";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function TransferPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  // fetch deposit transaction data
  const { data, isLoading, meta, refresh } = useTableData(
    `/admin/transfers?${searchParams.toString()}`,
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
              placeholder={t("Search...")}
              containerClass="w-full sm:w-auto"
            />

            <TableFilter />
            <TableExportButton url="/admin/transfers/export/all" />
          </div>
          <div />
        </div>

        <Separator className="my-4" />

        {/* Data table */}
        <TransferTable
          data={data}
          meta={meta}
          isLoading={isLoading}
          refresh={refresh}
        />
      </div>
    </div>
  );
}
