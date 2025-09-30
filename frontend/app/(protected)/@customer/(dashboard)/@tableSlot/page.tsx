"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTableData } from "@/hooks/useTableData";
import { ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TransactionHistoryTable from "./transactions-table";

export default function TableSlot() {
  const { t } = useTranslation();
  const { data, isLoading } = useTableData(`/transactions?page=1&limit=10`);

  return (
    <Tabs defaultValue="personal">
      <div className="w-full rounded-xl bg-background px-4 py-6 shadow-default">
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Tabs list */}
          <div className="flex items-center gap-4">
            <p className="font-medium text-foreground">
              {t("Transaction History")}
            </p>
            <Button variant="secondary" size="sm" className="px-2.5" asChild>
              <Link href="/transaction-history">
                <span>{t("See all")}</span>
                <ArrowRight2 size={20} />
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="personal">
          <TransactionHistoryTable data={data} isLoading={isLoading} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
