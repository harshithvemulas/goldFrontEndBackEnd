import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import cn, { Currency } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { SortingState } from "@tanstack/react-table";
import { Eye } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const currency = new Currency();

export default function TransferTable({
  data,
  meta,
  isLoading,
  refresh,
}: {
  data: TransactionData[];
  meta: any;
  isLoading: boolean;
  refresh: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <DataTable
      data={data ? data?.map((d: any) => new TransactionData(d)) : []}
      sorting={sorting}
      isLoading={isLoading}
      onRefresh={refresh}
      setSorting={setSorting}
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
              href={`/transfers/${row.original?.id}`}
              className="text-xs font-normal text-foreground hover:underline"
            >
              {row.original?.trxId}
            </Link>
          ),
        },

        {
          id: "createdAt",
          header: t("Date"),
          cell: ({ row }) => (
            <div>
              <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                {row.original.getCreatedAt("dd MMM yyyy;")}
              </span>
              <span className="block min-w-24 text-sm font-normal leading-5 text-foreground">
                {row.original.getCreatedAt("hh:mm a")}
              </span>
            </div>
          ),
        },

        {
          id: "type",
          header: t("Type"),
          cell: ({ row }) => {
            if (row.original?.metaData?.trxAction === "send") {
              return <Badge variant="destructive">{t("Send")}</Badge>;
            }
            if (row.original?.metaData?.trxAction === "receive") {
              return <Badge variant="success">{t("Receive")}</Badge>;
            }

            return <span>N/A</span>;
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
              <span
                className={cn(
                  "leading-20 whitespace-nowrap text-sm font-semibold text-success",
                  row.original?.metaData?.trxAction === "send" &&
                    "text-destructive",
                )}
              >
                {currency.format(row.original.total, currencyCode as string)}
              </span>
            );
          },
        },

        {
          id: "send_by",
          header: t("Send by"),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={row.original.from.image} />
                <AvatarFallback>
                  {getAvatarFallback(row.original.from.label)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm font-normal">
                  {row.original?.from?.label}
                </p>
                <p className="text-xs font-normal text-secondary-text">
                  {row.original.from?.email}
                </p>
                <p className="text-xs font-normal text-secondary-text">
                  {row.original.from?.phone}
                </p>
              </div>
            </div>
          ),
        },

        {
          id: "received_by",
          header: t("Received by"),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={row.original.from.image} />
                <AvatarFallback>
                  {getAvatarFallback(row.original.to.label)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm font-normal">{row.original?.to?.label}</p>
                <p className="text-xs font-normal text-secondary-text">
                  {row.original.from?.email}
                </p>
                <p className="text-xs font-normal text-secondary-text">
                  {row.original.from?.phone}
                </p>
              </div>
            </div>
          ),
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
              onClick={() => router.push(`/transfers/${row.original.id}`)}
            >
              <Eye />
            </Button>
          ),
        },
      ]}
    />
  );
}
