"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, UserSquare } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { MerchantTable } from "./MerchantTable";
import { PersonalTable } from "./PersonalTable";

export default function TableSlot() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="merchant">
      <div className="w-full rounded-xl bg-background px-4 py-6 shadow-default">
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Tabs list */}
          <TabsList className="h-12 max-w-[392px] p-1">
            <TabsTrigger
              value="merchant"
              className="inline-flex h-10 gap-0.5 bg-accent text-sm font-semibold leading-5 data-[state=active]:text-foreground [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
            >
              <ShoppingCart variant="Bulk" size={24} />
              {t("Merchant")}
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="inline-flex h-10 gap-0.5 bg-accent text-sm font-semibold leading-5 data-[state=active]:text-foreground data-[state=active]:shadow-defaultLite [&>svg]:text-secondary-text [&>svg]:data-[state=active]:text-primary"
            >
              <UserSquare variant="Bulk" size={24} />
              {t("Personal")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Data table */}
        <div>
          <TabsContent value="personal">
            <PersonalTable />
          </TabsContent>

          <TabsContent value="merchant">
            <MerchantTable />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
