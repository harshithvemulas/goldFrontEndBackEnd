import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { imageURL, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";

export default function PaymentReqTable({
  data,
  meta,
  isLoading,
}: {
  data: TransactionData[];
  meta: any;
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();

  return (
    <DataTable
      data={
        data
          ? [...data.map((d: Record<string, any>) => new TransactionData(d))]
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
          id: "id",
          header: t("ID"),
          cell: ({ row }) => (
            <span className="text-sm font-normal text-foreground">
              #{row.original?.id}
            </span>
          ),
        },

        {
          id: "createdAt",
          header: t("Date"),
          cell: ({ row }) => (
            <div>
              <p className="whitespace-nowrap font-normal">
                {format(row.original?.createdAt, "dd MMM yyyy")}
              </p>
              <p className="whitespace-nowrap font-normal">
                {format(row.original?.createdAt, "hh:mm a")}
              </p>
            </div>
          ),
        },

        {
          id: "status",
          header: t("Status"),
          cell: ({ row }) => {
            if (row.original?.id === "completed") {
              return (
                <Badge variant="success">
                  {t(startCase(row.original?.status))}
                </Badge>
              );
            }

            if (row.original?.id === "failed") {
              return (
                <Badge variant="destructive">
                  {t(startCase(row.original?.status))}
                </Badge>
              );
            }

            return (
              <Badge variant="secondary">
                {t(startCase(row.original?.status))}
              </Badge>
            );
          },
        },

        {
          id: "type",
          header: t("Type"),
          cell: ({ row }) => (
            <Badge variant="success" className="whitespace-nowrap">
              {startCase(row.original?.type)}
            </Badge>
          ),
        },

        {
          id: "trxId",
          header: t("Trx ID"),
          cell: ({ row }) => {
            if (!row.original?.id)
              return <span className="text-sm font-normal">N/A</span>;
            return (
              <span className="text-xs font-normal text-foreground">
                {row.original?.trxId}
              </span>
            );
          },
        },

        {
          id: "amount",
          header: t("Amount"),
          cell: ({ row }) => {
            return (
              <span className="leading-20 text-sm font-semibold text-foreground">
                {`${row.original?.amount} ${row.original.metaData?.currency}`}
              </span>
            );
          },
        },

        {
          id: "fee",
          header: t("Commission"),
          cell: ({ row }) => (
            <span className="leading-20 text-sm font-semibold text-success">
              {`${row.original?.fee} ${row.original.metaData.currency}`}
            </span>
          ),
        },

        {
          id: "from.label",
          header: t("Merchant"),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={imageURL(row.original?.from?.image as string)}
                />
                <AvatarFallback>
                  {getAvatarFallback(row.original?.from?.label)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm font-normal">
                  {row.original?.from?.label}
                </p>
                <p className="text-xs font-normal text-secondary-text">
                  {row.original?.from?.email}
                </p>

                <p className="text-xs font-normal text-secondary-text">
                  {row.original?.from?.phone}
                </p>
              </div>
            </div>
          ),
        },

        {
          id: "user",
          header: t("User"),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={imageURL(row.original?.from?.image as string)}
                />
                <AvatarFallback>
                  {getAvatarFallback(row.original?.from?.label)}
                </AvatarFallback>
              </Avatar>
              <div className="font-normal">
                <p className="text-sm font-normal">{row.original?.to?.label}</p>
                <p className="text-xs font-normal text-secondary-text empty:hidden">
                  {row.original?.to?.email}
                </p>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
