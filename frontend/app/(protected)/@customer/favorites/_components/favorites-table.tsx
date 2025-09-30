import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { shapePhoneNumber, startCase } from "@/lib/utils";
import { FavoriteItem } from "@/types/favorite-item";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { parsePhoneNumber } from "libphonenumber-js";
import React from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "./menu";

export default function FavoritesTable({
  data,
  meta,
  isLoading,
}: {
  data: FavoriteItem[];
  meta: any;
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data?.length ? [...data.map((d: any) => new FavoriteItem(d))] : []}
      sorting={sorting}
      isLoading={isLoading}
      setSorting={setSorting}
      pagination={{
        total: meta?.total,
        page: meta?.currentPage,
        limit: meta?.perPage,
      }}
      structure={[
        {
          id: "name",
          header: t("Name"),
          cell: ({ row }) => {
            const data = row.original;

            if (!data.info) return <span> N/A </span>;

            return (
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={data.info?.avatar} alt={data.info?.label} />
                  <AvatarFallback>
                    {getAvatarFallback(data.info?.label)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-normal">{data.info?.label}</span>
              </div>
            );
          },
        },

        {
          id: "id",
          header: t("Number/ID"),
          cell: ({ row }) => {
            const data = row.original;
            if (!data?.value) {
              return <span className="text-sm font-normal"> N/A </span>;
            }

            if (Number.isNaN(Number(data?.value))) {
              return (
                <span className="block min-w-28 font-normal">
                  {data?.value}
                </span>
              );
            }
            const phone = parsePhoneNumber(shapePhoneNumber(data?.value));
            return (
              <span className="block min-w-28 font-normal">
                {phone.formatInternational()}
              </span>
            );
          },
        },

        {
          id: "email",
          header: t("Email"),
          cell: ({ row }) => {
            const data = row.original;

            if (!data?.info?.email) {
              return <span className="text-sm font-normal"> N/A </span>;
            }

            return <span className="font-normal">{data?.info?.email}</span>;
          },
        },

        {
          id: "website",
          header: t("Website"),
          cell: ({ row }) => {
            const data = row.original;
            if (!data?.website)
              return <span className="text-sm font-normal"> N/A </span>;
            return <span className="font-normal">{data?.website}</span>;
          },
        },

        {
          id: "type",
          header: t("Type"),
          cell: ({ row }) => {
            return (
              <Badge
                variant="secondary"
                className="bg-status-secondary font-normal text-status-secondary-foreground"
              >
                {startCase(row.original.type) ?? (
                  <span className="text-sm font-normal"> N/A </span>
                )}
              </Badge>
            );
          },
        },

        {
          id: "menu",
          header: t("Menu"),
          cell: ({ row }) => <Menu row={row?.original} />,
        },
      ]}
    />
  );
}
