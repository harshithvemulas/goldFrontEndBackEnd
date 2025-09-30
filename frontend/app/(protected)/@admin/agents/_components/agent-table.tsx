import DataTable from "@/components/common/DataTable";
import { DeleteUserButton } from "@/components/common/DeleteUserButton";
import { Flag } from "@/components/icons/Flag";
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

export default function AgentTable({
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
          id: "agentId",
          header: t("Agent ID"),
          cell: ({ row }) => (
            <span className="text-sm font-normal text-foreground">
              {row.original?.agentId}
            </span>
          ),
        },
        {
          id: "name",
          header: t("Name"),
          cell: ({ row }) => (
            <Link
              href={`/agents/${row.original?.userId}/${row.original?.id}?name=${row.original?.name}&active=${row.original?.user?.status}`}
              prefetch={false}
              className="flex w-[120px] items-center gap-2 font-normal text-secondary-text hover:text-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={imageURL(row.original?.storeProfileImage)} />
                <AvatarFallback>
                  {getAvatarFallback(row.original?.name)}
                </AvatarFallback>
              </Avatar>

              <span className="block whitespace-nowrap">
                {row.original?.name}
              </span>
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
                {createdAt ? format(createdAt, "dd MMM yyyy \n hh:mm b") : "--"}
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
          id: "recommended",
          header: t("Recommended"),
          cell: ({ row }) => {
            if (row.original?.isRecommended) {
              return <Badge variant="success">{t("Yes")}</Badge>;
            }

            return <Badge variant="secondary">{t("No")}</Badge>;
          },
        },

        {
          id: "country",
          header: t("Country"),
          cell: ({ row }) => (
            <div className="leading-20 flex w-28 items-center gap-2 text-sm font-normal text-secondary-text">
              <span>
                <Flag countryCode={row.original?.address?.countryCode} />
              </span>
              <span className="block flex-1">
                {row.original?.address?.countryCode}
              </span>
            </div>
          ),
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
                  href={`/agents/${args.row.original?.userId}/${args.row.original?.id}?name=${args.row.original?.name}&active=${args.row.original?.user?.status}`}
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
      onRefresh={refresh}
    />
  );
}
