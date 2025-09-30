"use client";

import AdminUserRow from "@/components/common/AdminUserRow";
import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { Currency, searchQuery, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { type SortingState } from "@tanstack/react-table";
import { Eye } from "iconsax-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

const currency = new Currency();

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // fetch deposit transaction data
  const { data, isLoading, meta, refresh } = useTableData(
    `/admin/payments?${searchParams.toString()}`,
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

            <TableExportButton url="/admin/payments/export/all" />
          </div>
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <DataTable
          data={data ? data?.map((d: any) => new TransactionData(d)) : []}
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
              id: "trxId",
              header: t("Trx ID"),
              cell: ({ row }) => (
                <Link
                  href={`/transactions/${row.original.trxId}`}
                  className="cursor-pointer text-xs font-normal text-foreground hover:underline"
                >
                  {row.original.trxId}
                </Link>
              ),
            },

            {
              id: "createdAt",
              header: t("Date"),
              cell: ({ row }) => (
                <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                  {row.original.getCreatedAt("dd MMM yyyy; hh:mm b")}
                </span>
              ),
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
                  <Badge variant="secondary" className="bg-muted">
                    {t("Pending")}
                  </Badge>
                );
              },
            },
            {
              id: "amount",
              header: t("Amount"),
              cell: ({ row }) => {
                let currencyCode;

                if (row.original.type === "exchange") {
                  currencyCode = row.original?.metaData?.currencyFrom;
                } else if (row.original.type === "deposit") {
                  currencyCode = row.original?.metaData?.currency;
                } else {
                  currencyCode = row.original?.from?.currency;
                }

                return (
                  <span className="leading-20 text-sm font-semibold text-foreground">
                    {currency.format(
                      row.original.amount,
                      currencyCode as string,
                    )}
                  </span>
                );
              },
            },

            {
              id: "merchant",
              header: t("Merchant"),
              cell: ({ row }) => (
                <span className="leading-20 block min-w-24 text-sm font-normal text-secondary-text">
                  {row.original?.to?.label}
                </span>
              ),
            },

            {
              id: "user",
              header: t("User"),
              cell: ({ row }) => <AdminUserRow row={row} />,
            },

            {
              id: "view",
              header: t("View"),
              cell: ({ row }) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                  onClick={() =>
                    router.push(`/transactions/${row.original.trxId}`)
                  }
                >
                  <Eye />
                </Button>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
