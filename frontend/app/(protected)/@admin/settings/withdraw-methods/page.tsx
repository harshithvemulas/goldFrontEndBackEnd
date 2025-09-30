"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTableData } from "@/hooks/useTableData";
import { imageURL, searchQuery } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { Add, Edit2 } from "iconsax-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export default function WithdrawMethodsSettings() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  const { data, meta, isLoading } = useTableData(
    `/admin/methods?${searchParams.toString()}`,
  );

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex items-start py-4 sm:flex-row sm:items-center">
        <CardTitle className="flex-1 text-base font-medium leading-[22px]">
          {t("Withdraw Methods")}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="mr-2.5 text-sm"
            asChild
          >
            <Link href="/settings/withdraw-methods/create">
              <Add />
              <span>{t("Add New Method")}</span>
            </Link>
          </Button>
          <SearchBox
            value={search}
            onChange={handleSearch}
            iconPlacement="end"
            placeholder={t("Search...")}
          />
        </div>
      </CardHeader>

      <CardContent className="border-t border-divider py-4">
        <div className="flex flex-col gap-4">
          <DataTable
            data={data}
            sorting={sorting}
            setSorting={setSorting}
            isLoading={isLoading}
            pagination={{
              total: meta?.total,
              page: meta?.currentPage,
              limit: meta?.perPage,
            }}
            structure={[
              {
                id: "id",
                header: t("Id"),
                cell: ({ row }: any) => {
                  return (
                    <div className="font-normal text-secondary-text">
                      {`#${row.original?.id}`}
                    </div>
                  );
                },
              },
              {
                id: "name",
                header: t("Name"),
                cell: ({ row }: any) => {
                  return (
                    <Link
                      href={`/settings/withdraw-methods/${row.original?.id}?name=${row.original?.name}`}
                      className="flex items-center gap-2 font-normal"
                    >
                      <Avatar>
                        <AvatarImage src={imageURL(row.original?.logoImage)} />
                        <AvatarFallback className="font-semibold">
                          {getAvatarFallback(
                            row.original?.name?.split(/\s+/)[0],
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-secondary-text hover:text-primary hover:underline">
                        {row.original?.name}
                      </span>
                    </Link>
                  );
                },
              },
              {
                id: "currency",
                header: t("Currency"),
                cell: ({ row }: any) => {
                  return (
                    <div className="font-normal text-secondary-text">
                      {row.original?.currencyCode || "N/A"}
                    </div>
                  );
                },
              },
              {
                id: "limit",
                header: t("Limit"),
                cell: ({ row }: any) => {
                  return (
                    <div className="min-w-28 font-normal text-secondary-text">
                      {row.original?.minAmount} {row.original?.currencyCode} -{" "}
                      {row.original?.maxAmount} {row.original?.currencyCode}
                    </div>
                  );
                },
              },
              {
                id: "charge",
                header: t("Charge"),
                cell: ({ row }: any) => {
                  return (
                    <div className="min-w-28 font-normal text-secondary-text">
                      {row.original?.fixedCharge} {row.original?.currencyCode} +{" "}
                      {row.original?.percentageCharge}%
                    </div>
                  );
                },
              },
              {
                id: "status",
                header: t("Status"),
                cell: ({ row }: any) => (
                  <Badge
                    variant={row.original?.active ? "success" : "secondary"}
                  >
                    {row.original?.active ? t("Active") : t("Inactive")}
                  </Badge>
                ),
              },
              {
                id: "recommended",
                header: t("Recommended"),
                cell: ({ row }: any) => (
                  <Badge
                    variant={
                      row.original?.recommended ? "important" : "secondary"
                    }
                  >
                    {row.original?.recommended ? t("Yes") : t("No")}
                  </Badge>
                ),
              },

              {
                id: "menu",
                header: t("Menu"),
                cell: ({ row }: any) => {
                  return (
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8 bg-background p-1.5 text-primary"
                    >
                      <Link
                        href={`/settings/withdraw-methods/${row.original?.id}?name=${row.original?.name}`}
                      >
                        <Edit2 size="20" className="text-primary" />
                      </Link>
                    </Button>
                  );
                },
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
