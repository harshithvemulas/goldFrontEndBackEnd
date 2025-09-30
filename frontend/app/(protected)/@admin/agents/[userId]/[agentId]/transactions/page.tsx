"use client";

import DataTable from "@/components/common/DataTable";
import { SearchBox } from "@/components/common/form/SearchBox";
import { ReportCard } from "@/components/common/ReportCard";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import TransactionCategoryFilter from "@/components/common/TransactionCategoryFilter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Label from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import { useSWR } from "@/hooks/useSWR";
import { useTableData } from "@/hooks/useTableData";
import { Currency, searchQuery, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import type { SortingState } from "@tanstack/react-table";
import { Add, Receive } from "iconsax-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

const currency = new Currency();

export default function TransactionHistoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { t } = useTranslation();

  // get all transaction list
  const { data, meta, isLoading, refresh, filter } = useTableData(
    `/admin/transactions/${params.userId}?${searchParams.toString()}`,
    { keepPreviousData: true },
  );

  // get total count data
  const { data: countData, isLoading: isCounting } = useSWR(
    `/admin/transactions/counts/${params.userId}`,
  );

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 grid grid-cols-12 gap-4">
        <ReportCard
          {...{
            value: isCounting ? 0 : countData?.data?.deposit,
            title: t("Total Deposit"),
            icon: (props) => <Add {...props} />,
            status: "",
            className: "col-span-12 sm:col-span-6",
            statusClass: "text-spacial-green",
            iconClass: "bg-spacial-green-foreground",
          }}
        />

        <ReportCard
          {...{
            value: isCounting ? 0 : countData?.data?.withdraw,
            title: t("Total Withdraw"),
            icon: (props) => <Receive {...props} />,
            status: "",
            className: "col-span-12 sm:col-span-6",
            iconClass: "bg-spacial-red-foreground text-spacial-red",
            statusClass: "text-spacial-red",
          }}
        />
      </div>

      <div className="h-fit w-full overflow-y-auto overflow-x-hidden bg-background p-6 pb-16 shadow-default sm:rounded-xl sm:pb-4">
        {/* filter bar */}
        <div className="flex w-full flex-col gap-4 md:justify-between xl:h-12 xl:flex-row xl:items-center">
          <div className="flex h-full w-full flex-col items-center gap-4 rounded-md bg-accent p-1 sm:w-fit sm:flex-row">
            <TransactionCategoryFilter filter={filter} />

            <div className="flex h-full w-full items-center gap-2.5 px-4 py-2.5 sm:w-40 sm:px-0">
              <Checkbox
                id="bookmark"
                defaultChecked={searchParams.get("bookmark") === "true"}
                onCheckedChange={(checked) =>
                  filter("bookmark", checked.toString())
                }
                className="border-foreground/40 data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="bookmark"
                className="text-sm font-normal hover:cursor-pointer"
              >
                {t("Show bookmarks")}
              </Label>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-4 md:flex-nowrap xl:justify-end">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              containerClass="w-full sm:w-auto"
            />

            <TableFilter canFilterByMethod canFilterByGateway />
            <TableExportButton
              url={`/admin/transactions/export/${params.userId}`}
            />
          </div>
          <div />
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <DataTable
          data={
            data
              ? data?.map(
                  (d: Record<string, unknown>) => new TransactionData(d),
                )
              : []
          }
          isLoading={isLoading}
          onRefresh={refresh}
          sorting={sorting}
          setSorting={setSorting}
          pagination={{
            total: meta?.total,
            page: meta?.currentPage,
            limit: meta?.perPage,
          }}
          structure={[
            {
              id: "createdAt",
              header: t("Date"),
              cell: ({ row }) => {
                return (
                  <span className="text-sm font-normal leading-5 text-secondary-text">
                    {row.original.getCreatedAt()}
                  </span>
                );
              },
            },

            {
              id: "to",
              header: t("To"),
              cell: ({ row }) => {
                return (
                  <div className="text-sm font-normal leading-5 text-foreground">
                    <Avatar className="size-7 border-2 border-primary p-1 font-semibold">
                      <AvatarImage
                        src={row.original?.to?.image}
                        alt={row.original?.to?.label}
                      />
                      <AvatarFallback>
                        {getAvatarFallback(row.original?.to?.label)}{" "}
                      </AvatarFallback>
                    </Avatar>
                    <span>{row.original.to.label}</span>
                  </div>
                );
              },
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
                  <Badge variant="secondary">
                    {t(startCase(row.original?.status))}
                  </Badge>
                );
              },
            },

            {
              id: "amount",
              header: t("Amount sent"),
              cell: ({ row }) => {
                const data = row.original;
                return (
                  <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                    {match(data)
                      .with({ type: "exchange" }, () =>
                        currency.format(
                          data?.metaData?.amountFrom,
                          data?.metaData?.currencyFrom,
                        ),
                      )
                      .with({ type: "deposit" }, () =>
                        currency.format(data.amount, data?.metaData?.currency),
                      )
                      .otherwise(() =>
                        currency.format(
                          data.amount,
                          data?.from?.currency as string,
                        ),
                      )}
                  </span>
                );
              },
            },

            {
              id: "fee",
              header: t("Fee"),
              cell: ({ row }) => {
                const data = row.original;

                return (
                  <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                    {match(data)
                      .with({ type: "exchange" }, () =>
                        currency.format(data?.fee, data.metaData?.currency),
                      )
                      .with({ type: "deposit" }, () =>
                        currency.format(data.fee, data.metaData?.currency),
                      )
                      .otherwise(() =>
                        currency.format(
                          data.fee,
                          data.from?.currency as string,
                        ),
                      )}
                  </span>
                );
              },
            },

            {
              id: "total",
              header: t("Amount received"),
              cell: ({ row }) => {
                const data = row.original;

                return (
                  <span className="leading-20 whitespace-nowrap text-sm font-semibold text-foreground">
                    {match(data)
                      .with({ type: "exchange" }, () =>
                        currency.format(data.total, data.metaData?.currencyTo),
                      )
                      .with({ type: "deposit" }, () =>
                        currency.format(data.total, data.metaData?.currency),
                      )
                      .otherwise(() =>
                        currency.format(
                          data.total,
                          data.to?.currency as string,
                        ),
                      )}
                  </span>
                );
              },
            },

            {
              id: "metaData",
              header: t("Phone number"),
              cell: ({ row }) => (
                <span className="text-xs font-normal text-secondary-text">
                  {(row.original?.metaData?.phone as string) ?? "N/A"}
                </span>
              ),
            },

            {
              id: "trxId",
              header: t("Trx ID"),
              cell: ({ row }) => {
                if (!row.original?.trxId) {
                  return <span className="text-sm font-normal">N/A</span>;
                }

                return (
                  <Link
                    href={`/transactions/${row.original?.trxId}`}
                    className="text-xs font-normal text-foreground hover:underline"
                  >
                    {row.original?.trxId}
                  </Link>
                );
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
