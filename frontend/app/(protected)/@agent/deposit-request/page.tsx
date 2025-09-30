"use client";

import { SearchBox } from "@/components/common/form/SearchBox";
import { Loader } from "@/components/common/Loader";
import { TableExportButton } from "@/components/common/TableExportButton";
import { TableFilter } from "@/components/common/TableFilter";
import Separator from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTableData } from "@/hooks/useTableData";
import { searchQuery } from "@/lib/utils";
import { AddCircle, Warning2 } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTranslation } from "react-i18next";
import TransactionsTable from "./_components/transactions-table";

// render Deposit Request page
export default function DepositRequestPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const router = useRouter();
  const pathname = usePathname();

  // fetch deposits data
  const {
    data: trx,
    meta,
    isLoading,
  } = useTableData(`/deposit-requests?${searchParams.toString()}`, {
    keepPreviousData: true,
  });

  // handle search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const q = searchQuery(e.target.value);
    setSearch(e.target.value);
    router.replace(`${pathname}?${q.toString()}`);
  };

  return (
    <Tabs defaultValue="depositRequest">
      <div className="p-4">
        <div className="w-full rounded-xl bg-background p-4 shadow-default md:p-6">
          {/* filter bar */}
          <div className="flex w-full flex-col gap-4 md:justify-between xl:h-12 xl:flex-row xl:items-center">
            <div className="flex h-full w-full max-w-[380px] items-center gap-4 rounded-md bg-accent">
              {/* Tabs list */}
              <TabsList className="h-12 w-full max-w-[380px] p-1">
                <TabsTrigger
                  value="depositRequest"
                  className="inline-flex h-10 w-full gap-1 text-sm font-semibold leading-5 text-secondary-text data-[state=active]:text-foreground data-[state=active]:shadow-defaultLite [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
                >
                  <AddCircle variant="Bulk" size={24} />
                  {t("Deposit Request")}
                </TabsTrigger>

                <TabsTrigger
                  value="pendingRequest"
                  className="inline-flex h-10 w-full gap-1 text-sm font-semibold leading-5 text-secondary-text data-[state=active]:text-foreground [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
                >
                  <Warning2 variant="Bulk" size={24} />
                  {t("Pending")}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex w-full flex-wrap items-center gap-4 xl:justify-end">
              {/* Search box */}
              <SearchBox
                value={search}
                onChange={handleSearch}
                iconPlacement="end"
                placeholder={t("Search...")}
                containerClass="w-full sm:w-auto"
              />

              <TableFilter canFilterByAgentMethod />

              <TableExportButton
                url="/deposit-requests/export/all"
                align="end"
              />
            </div>
            <div />
          </div>

          <Separator className="my-4" />
          {/* Data table */}

          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              <TabsContent value="depositRequest">
                <TransactionsTable data={trx} meta={meta} />
              </TabsContent>
              <TabsContent value="pendingRequest">
                <TransactionsTable
                  data={[
                    ...trx.filter(
                      (t: Record<string, any>) => t.status === "pending",
                    ),
                  ]}
                  meta={meta}
                />
              </TabsContent>
            </>
          )}
        </div>
      </div>
    </Tabs>
  );
}
