"use client";

import * as React from "react";

import TransactionTable from "@/app/(protected)/@admin/(dashboard)/_components/transactions-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTableData } from "@/hooks/useTableData";
import { ShoppingCart, UserSquare } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function TableSlot() {
  const [role, setRole] = React.useState(2);
  const { data, isLoading } = useTableData(`/admin/transactions/role/${role}`);

  const { t } = useTranslation();

  return (
    <Tabs
      onValueChange={(tab) => setRole(tab === "customer" ? 2 : 3)}
      defaultValue="customer"
    >
      <div className="w-full rounded-xl bg-background px-4 py-6 shadow-default">
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Tabs list */}
          <TabsList className="h-12 max-w-[392px] p-1">
            <TabsTrigger
              value="customer"
              className="inline-flex h-10 gap-0.5 bg-accent text-sm font-semibold leading-5 data-[state=active]:text-foreground data-[state=active]:shadow-defaultLite [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
            >
              <UserSquare variant="Bulk" size={24} />
              {t("Customer")}
            </TabsTrigger>

            <TabsTrigger
              value="merchant"
              className="inline-flex h-10 gap-0.5 bg-accent text-sm font-semibold leading-5 data-[state=active]:text-foreground [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
            >
              <ShoppingCart variant="Bulk" size={24} />
              {t("Merchant")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Data table */}
        <div>
          <TabsContent value="customer">
            <TransactionTable data={data} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="merchant">
            <TransactionTable data={data} isLoading={isLoading} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
