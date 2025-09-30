"use client";

import DeleteStaffButton from "@/app/(protected)/@admin/staffs/_components/delete-staff";
import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import { Flag } from "@/components/icons/Flag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useTableData } from "@/hooks/useTableData";
import { imageURL, searchQuery } from "@/lib/utils";
import { User } from "@/types/auth";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { type SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Add, Edit2 } from "iconsax-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function StaffPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  const { data, meta, isLoading, refresh } = useTableData(
    `/admin/users?${searchParams.toString()}&role=1`,
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
            />

            <TableFilter
              canFilterUser
              canFilterByGender
              canFilterByCountryCode
            />

            <TableExportButton url="/admin/users/export/all?role=1" />
          </div>
          <div className="flex-1" />
          <Button asChild className="pl-2">
            <Link href="/staffs/create">
              <Add />
              <span>{t("Add Staff")}</span>
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <DataTable
          data={data ? data.map((d: any) => new User(d)) : []}
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
              header: t("ID"),
              cell: ({ row }) => (
                <span className="text-sm font-normal text-foreground">
                  #{row.original?.id}
                </span>
              ),
            },

            {
              id: "name",
              header: t("Name"),
              cell: ({ row }) => (
                <div className="inline-flex items-center gap-2 font-normal text-secondary-text">
                  <Avatar>
                    <AvatarImage
                      src={imageURL(row.original?.customer?.avatar as string)}
                    />
                    <AvatarFallback>
                      {getAvatarFallback(row.original?.customer.name)}
                    </AvatarFallback>
                  </Avatar>

                  <span>{row.original?.customer.name}</span>
                </div>
              ),
            },

            {
              id: "email",
              header: t("Email"),
              cell: ({ row }) => (
                <span className="leading-20 text-sm font-normal text-secondary-text">
                  {row.original?.email}
                </span>
              ),
            },

            {
              id: "customer.phone",
              header: t("Phone"),
              cell: ({ row }) => (
                <span className="leading-20 text-sm font-normal text-secondary-text">
                  {row.original.customer?.phone}
                </span>
              ),
            },

            {
              id: "customer.address.countryCode",
              header: t("Country"),
              cell: ({ row }) => (
                <div className="leading-20 inline-flex gap-2 text-sm font-normal text-secondary-text">
                  {row.original?.customer.address.countryCode ? (
                    <Flag
                      countryCode={row.original.customer.address.countryCode}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              ),
            },
            {
              id: "updatedAt",
              header: t("Last logged in"),
              cell: ({ row }) => (
                <span className="text-sm font-normal leading-5 text-secondary-text">
                  {row.original?.updatedAt
                    ? format(row.original?.updatedAt, "dd MMM yyyy hh:mm b")
                    : "N/A"}
                </span>
              ),
            },
            {
              id: "action",
              header: t("Action"),
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/staffs/edit/${row.original?.id}`)
                    }
                    className="h-8 w-8 rounded-md bg-background text-primary hover:bg-background"
                  >
                    <Edit2 size={20} />
                  </Button>
                  <DeleteStaffButton
                    onMutate={refresh}
                    staffId={row.original?.id}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
