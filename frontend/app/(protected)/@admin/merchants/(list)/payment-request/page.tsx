"use client";

import PaymentReqTable from "@/app/(protected)/@admin/merchants/_components/payment-req-table";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function MerchantPaymentRequestPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");

  const { t } = useTranslation();

  const { data, meta, isLoading } = useTableData(
    `/admin/merchants/payment-requests/all?${searchParams.toString()}`,
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
        <div className="flex h-12 items-center">
          <div className="flex items-center gap-4">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              containerClass="w-full sm:w-auto"
            />

            <TableFilter />

            <TableExportButton url="" align="end" />
          </div>
          <div />
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <PaymentReqTable data={data} meta={meta} isLoading={isLoading} />
      </div>
    </div>
  );
}
