"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSWR } from "@/hooks/useSWR";
import { useTableData } from "@/hooks/useTableData";
import { imageURLPlugin, searchQuery } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { Edit2 } from "iconsax-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export default function DepositGatewaySettings() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  const { data, meta, isLoading } = useTableData(
    `/admin/external-plugins?${searchParams.toString()}`,
  );

  const { data: plugins, isLoading: pluginsLoading } = useSWR(
    "/admin/external-plugins/config",
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
      <CardHeader className="flex w-full flex-wrap items-start justify-between py-4 sm:flex-row sm:items-center">
        <CardTitle className="flex-1 text-base font-medium leading-[22px]">
          {t("Plugins")}
        </CardTitle>
        <SearchBox
          value={search}
          onChange={handleSearch}
          iconPlacement="end"
          placeholder={t("Search...")}
        />
      </CardHeader>

      <CardContent className="border-t border-divider py-4">
        <div className="flex flex-col gap-4">
          <DataTable
            data={data}
            sorting={sorting}
            setSorting={setSorting}
            isLoading={isLoading || pluginsLoading}
            pagination={{
              total: meta?.total,
              page: meta?.currentPage,
              limit: meta?.perPage,
            }}
            structure={[
              {
                id: "name",
                header: t("Name"),
                cell: ({ row }: any) => {
                  return (
                    <Link
                      href={`/settings/plugins/${row.original?.id}?name=${row.original?.value}`}
                      className="flex items-center gap-2"
                    >
                      <Avatar>
                        <AvatarImage
                          src={imageURLPlugin(`${row.original?.value}.png`)}
                        />
                        <AvatarFallback className="font-semibold">
                          {getAvatarFallback(row.original?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-secondary-text hover:text-primary hover:underline">
                          {row.original?.name}
                        </span>
                        <span className="text-xs font-medium text-secondary-text">
                          {
                            plugins?.data?.[`${row.original?.value}`]
                              .description
                          }
                        </span>
                      </div>
                    </Link>
                  );
                },
              },
              {
                id: "status",
                header: t("Status"),
                cell: ({ row }: any) => {
                  return (
                    <Badge
                      variant={row.original?.active ? "success" : "secondary"}
                    >
                      {row.original?.active ? t("Active") : t("Inactive")}
                    </Badge>
                  );
                },
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
                        href={`/settings/plugins/${row.original?.id}?name=${row.original?.value}`}
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
