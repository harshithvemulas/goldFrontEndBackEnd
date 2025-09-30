"use client";

import FavoritesTable from "@/app/(protected)/@customer/favorites/_components/favorites-table";
import { SearchBox } from "@/components/common/form/SearchBox";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function FavoritesListPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();
  const { data, meta, isLoading } = useTableData(
    `/saves?${searchParams.toString()}`,
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
        <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end xl:h-12 xl:items-center">
          <div className="flex w-full items-center gap-4 sm:w-fit">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              className="h-10 rounded-lg"
              containerClass="w-full sm:w-[280px]"
            />
          </div>
        </div>

        {/* Data table */}
        <FavoritesTable data={data} isLoading={isLoading} meta={meta} />
      </div>
    </div>
  );
}
