"use client";

import TransactionsTable from "@/app/(protected)/@admin/merchants/[userId]/[merchantId]/transactions/_components/transactions-table";
import { SearchBox } from "@/components/common/form/SearchBox";
import { ReportCard } from "@/components/common/ReportCard";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import TransactionCategoryFilter from "@/components/common/TransactionCategoryFilter";
import Separator from "@/components/ui/separator";
import { useSWR } from "@/hooks/useSWR";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { Add, ArrowRight, Receive, Repeat } from "iconsax-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function TransactionHistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { t } = useTranslation();

  const [search, setSearch] = React.useState("");
  const { data, meta, isLoading, filter } = useTableData(
    `/admin/transactions/${params.customerId}?${searchParams.toString()}`,
  );

  const { data: trxCount, isLoading: trxCountLoading } = useSWR(
    `/admin/transactions/counts/${params.customerId}`,
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
            value: trxCount?.data?.deposit,
            title: t("Total Deposit"),
            icon: (props) => <Add {...props} />,
            status: "",
            className: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            statusClass: "text-spacial-green",
            iconClass: "bg-spacial-green-foreground",
            isLoading: trxCountLoading,
          }}
        />

        <ReportCard
          {...{
            value: trxCount?.data?.withdraw,
            title: t("Total Withdraw"),
            icon: (props) => <Receive {...props} />,
            status: "",
            className: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            iconClass: "bg-spacial-red-foreground text-spacial-red",
            statusClass: "text-spacial-red",
            isLoading: trxCountLoading,
          }}
        />

        <ReportCard
          {...{
            value: trxCount?.data?.transfer,
            title: t("Total Transfers"),
            icon: (props) => <ArrowRight {...props} />,
            status: "",
            className: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            iconClass: "bg-spacial-blue-foreground text-spacial-blue",
            statusClass: "text-spacial-blue",
            isLoading: trxCountLoading,
          }}
        />

        <ReportCard
          {...{
            value: trxCount?.data?.exchange,
            title: t("Total Exchange"),
            icon: (props) => <Repeat {...props} />,
            status: "",
            className: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            isLoading: trxCountLoading,
          }}
        />
      </div>

      <div className="h-fit w-full overflow-auto rounded-xl bg-background p-6 shadow-default">
        {/* filter bar */}
        <div className="flex w-full flex-col gap-4 md:justify-between xl:h-12 xl:flex-row xl:items-center">
          <div className="flex h-full w-full flex-col items-center gap-4 rounded-md bg-accent p-1 sm:w-fit sm:flex-row">
            <TransactionCategoryFilter filter={filter} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search box */}
            <SearchBox
              value={search}
              onChange={handleSearch}
              iconPlacement="end"
              placeholder={t("Search...")}
              containerClass="w-full sm:w-auto"
            />

            <TableFilter
              canFilterByAgent
              canFilterByMethod
              canFilterByGateway
            />

            <TableExportButton
              url={`/admin/transactions/export/${params.userId}`}
            />
          </div>
        </div>

        <Separator className="my-4" />
        {/* Data table */}
        <TransactionsTable data={data} meta={meta} isLoading={isLoading} />
      </div>
    </div>
  );
}
