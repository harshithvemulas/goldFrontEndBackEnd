import DataTable from "@/components/common/DataTable";
import { DeleteUserButton } from "@/components/common/DeleteUserButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/data/admin/deleteUser";
import { imageURL, shapePhoneNumber } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye } from "iconsax-react";
import { parsePhoneNumber } from "libphonenumber-js";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function MerchantTable({
  data,
  meta,
  isLoading,
  refresh,
}: {
  data: any;
  meta: any;
  isLoading: boolean;
  refresh: () => void;
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
            <span className="text-sm font-normal text-foreground">
              #{row.original?.id}
            </span>
          ),
        },
        {
          id: "merchant_id",
          header: t("Merchant ID"),
          cell: ({ row }) => (
            <span className="text-sm font-normal text-foreground">
              {row.original?.merchantId}
            </span>
          ),
        },
        {
          id: "name",
          header: t("Name"),
          cell: ({ row }) => (
            <Link
              href={`/merchants/${row.original?.userId}/${row.original?.id}?name=${row.original?.name}&active=${row.original?.user?.status}`}
              prefetch={false}
              className="flex min-w-[80px] items-center gap-2 font-normal text-secondary-text hover:text-foreground"
            >
              <Avatar>
                <AvatarImage src={imageURL(row.original?.storeProfileImage)} />
                <AvatarFallback>
                  {getAvatarFallback(row.original?.name)}
                </AvatarFallback>
              </Avatar>

              <span className="block">{row.original?.name}</span>
            </Link>
          ),
        },
        {
          id: "createdAt",
          header: t("Date"),
          cell: ({ row }) => {
            const createdAt = row.original?.createdAt;

            return (
              <span className="block w-28 text-sm font-normal leading-5 text-secondary-text">
                {createdAt ? format(createdAt, "dd MMM yyyy \n hh:mm a") : "--"}
              </span>
            );
          },
        },
        {
          id: "status",
          header: t("Status"),
          cell: ({ row }) =>
            row.original?.user?.status ? (
              <Badge variant="success">{t("Active")}</Badge>
            ) : (
              <Badge variant="secondary">{t("Inactive")}</Badge>
            ),
        },
        {
          id: "email",
          header: t("Email"),
          cell: ({ row }) => (
            <span className="leading-20 block text-sm font-normal text-secondary-text">
              {row.original?.email}
            </span>
          ),
        },
        {
          id: "address",
          header: t("Address"),
          cell: ({ row }) => {
            const address = row.original?.address;

            return (
              <span className="leading-20 block w-[150px] text-sm font-normal text-secondary-text">
                {`${address?.addressLine}, ${address?.city}-${address?.zipCode}, ${address?.countryCode}`}
              </span>
            );
          },
        },
        {
          id: "user",
          header: t("User"),
          cell: ({ row }) => {
            const user = row.original?.user;
            const phone = shapePhoneNumber(user?.customer?.phone);

            return (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={imageURL(user?.customer?.profileImage)} />
                  <AvatarFallback>
                    {getAvatarFallback(user?.customer?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-normal">{user?.customer?.name}</p>
                  <p className="text-xs font-normal text-secondary-text">
                    {user?.email}
                  </p>
                  <p className="text-xs font-normal text-secondary-text">
                    {phone ? parsePhoneNumber(phone).formatNational() : "--"}
                  </p>
                </div>
              </div>
            );
          },
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
                  href={`/merchants/${args.row.original?.userId}/${args.row.original?.id}?name=${args.row.original?.name}&active=${args.row.original?.user?.status}`}
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
