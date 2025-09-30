"use client";

import * as React from "react";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useBranding } from "@/hooks/useBranding";
import { useTableData } from "@/hooks/useTableData";
import { Currency, searchQuery } from "@/lib/utils";
import { Settlement } from "@/types/settlement";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTranslation } from "react-i18next";

const currency = new Currency();

export function SettlementTable() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const [search, setSearch] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { defaultCurrency } = useBranding();
  // Fetch user data
  const { data, meta, isLoading, refresh } = useTableData(
    `/commissions/${params?.userId}?${searchParams.toString()}`,
  );

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  return (
    <div className="rounded-xl border border-border bg-background">
      <AccordionItem value="settlement_table" className="border-none px-4 py-0">
        <AccordionTrigger className="py-6 hover:no-underline">
          <p className="text-base font-medium leading-[22px]">
            {t("Settlements")}
          </p>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-6 border-t px-1 py-4">
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
              <TableExportButton
                url={`/commissions/export/${params?.userId}?status=pending`}
              />
            </div>
          </div>

          <DataTable
            data={
              data
                ? data?.map((d: Record<string, unknown>) => new Settlement(d))
                : []
            }
            isLoading={isLoading}
            sorting={sorting}
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
                  <Link
                    href={`/transactions/${row.original?.transaction.trxId}`}
                    className="text-xs font-normal text-foreground hover:underline"
                  >
                    {row.original?.transaction.trxId}
                  </Link>
                ),
              },
            ]}
            onRefresh={refresh}
          />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
