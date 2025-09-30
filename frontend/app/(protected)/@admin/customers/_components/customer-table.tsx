import DataTable from "@/components/common/DataTable";
import { DeleteUserButton } from "@/components/common/DeleteUserButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/data/admin/deleteUser";
import { imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye } from "iconsax-react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CustomerTable({
  data,
  meta,
  isLoading,
  refresh,
}: {
  data: any[];
  meta: any;
  isLoading: boolean;
  refresh: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={data}
      sorting={sorting}
      isLoading={isLoading}
      setSorting={setSorting}
      onRefresh={refresh}
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
            <Link
              href={`/customers/${row?.original?.id}?name=${row?.original?.name}&active=${row?.original?.user?.status}`}
              className="text-sm font-normal text-foreground"
            >
              #{row.original.id}
            </Link>
          ),
        },
        {
          id: "createdAt",
          header: t("Date"),
          cell: ({ row }) => (
            <span className="block min-w-24 text-sm font-normal leading-5 text-secondary-text">
              {row.original.createdAt
                ? format(row.original.createdAt, "dd MMM yyyy \n hh:mm:ss")
                : "--"}
            </span>
          ),
        },
        {
          id: "name",
          header: t("Name"),
          cell: ({ row }) => (
            <Link
              href={`/customers/${row.original?.id}?name=${row.original?.name}&active=${row.original?.user?.status}`}
              prefetch={false}
              className="flex items-center gap-2 font-normal text-secondary-text hover:text-foreground"
            >
              {row.original?.name && (
                <Avatar>
                  <AvatarImage src={imageURL(row.original.profileImage)} />
                  <AvatarFallback>
                    {getAvatarFallback(row.original.name)}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="block whitespace-nowrap">
                {row.original?.name ?? "--"}
              </span>
            </Link>
          ),
        },

        {
          id: "email",
          header: t("Email"),
          cell: ({ row }) => (
            <span className="leading-20 text-sm font-normal text-secondary-text">
              {row.original?.user?.email ?? "--"}
            </span>
          ),
        },

        {
          id: "status",
          header: t("Status"),
          cell: ({ row }) =>
            row.original?.user?.status ? (
              <Badge variant="success">{t("Active")}</Badge>
            ) : (
              <Badge variant="secondary">{t("Deactivated")}</Badge>
            ),
        },

        {
          id: "role",
          header: t("Role"),
          cell: () => (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {t("Customer")}
            </Badge>
          ),
        },

        {
          id: "kyc",
          header: t("KYC"),
          cell: ({ row }) =>
            row.original?.user?.kycStatus ? (
              <Badge
                variant="success"
                className="bg-muted text-muted-foreground"
              >
                {t("Active")}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {t("Pending")}
              </Badge>
            ),
        },
        {
          id: "balance",
          header: t("Balance"),
          cell: ({ row }) => (
            <span className="block whitespace-nowrap font-semibold">
              {row.original.user?.wallets?.[0]?.balance}{" "}
              {row.original.user?.wallets?.[0]?.currency?.code}
            </span>
          ),
        },
        {
          id: "menu",
          header: t("Menu"),
          cell: (args: any) => (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                asChild
              >
                <Link
                  href={`/customers/${args.row.original?.id}?name=${args.row.original?.name}&active=${args.row.original.user?.status}`}
                  prefetch={false}
                >
                  <Eye />
                </Link>
              </Button>

              {/* Delete user */}
              <DeleteUserButton
                onConfirm={() => {
                  (async () => {
                    toast.promise(deleteUser(args.row.original?.userId), {
                      loading: "Loading...",
                      success: (res) => {
                        if (!res?.status) throw new Error(res.message);
                        args?.table?.getState()?.onRefresh();
                        return res.message;
                      },
                      error: (err) => err.message,
                    });
                  })();
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
