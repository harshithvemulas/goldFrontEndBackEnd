"use client";

import { SearchBox } from "@/components/common/form/SearchBox";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ContactsTable from "./_components/contacts-table";

export default function Contacts() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  // fetch contact table data
  const { data, meta, isLoading } = useTableData(
    `/contacts?${searchParams.toString()}`,
    { keepPreviousData: true },
  );

  // handle search input
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
          <div className="ml-auto flex items-center gap-4">
            {/* Search box */}
            <SearchBox
              iconPlacement="end"
              placeholder={t("Search...")}
              className="h-10 w-full rounded-lg"
              containerClass="w-full sm:w-[280px]"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Data table */}
        <ContactsTable data={data} isLoading={isLoading} meta={meta} />
      </div>
    </div>
  );
}
