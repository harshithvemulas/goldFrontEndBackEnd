"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserSquare } from "iconsax-react";
import { useTranslation } from "react-i18next";
import AgentConvertCard from "./AgentConvertCard";
import CustomerConvertCard from "./CustomerConvertCard";
import MerchantConvertCard from "./MerchantConvertCard";

export function ConvertAccountType({
  customer,
}: {
  customer: Record<string, any>;
}) {
  const { t } = useTranslation();

  return (
    <AccordionItem
      value="ConvertAccountType"
      className="rounded-xl border border-border bg-background px-4 py-0"
    >
      <AccordionTrigger className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">
          {t("Convert account type")}
        </p>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 border-t p-[1px] py-4">
        <Alert className="border-none bg-transparent shadow-default">
          <UserSquare color="#0B6A0B" variant="Bulk" className="-mt-1" />
          <AlertTitle className="pl-2 text-sm font-semibold leading-5">
            {t("This is a Customer Account")}
          </AlertTitle>
          <AlertDescription className="pl-2 text-sm font-normal">
            {t(
              "You will need to add additional information to convert this account into a Merchant of Agent.",
            )}
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap items-center gap-y-4 sm:gap-4">
          <CustomerConvertCard />
          <AgentConvertCard customer={customer} />
          <MerchantConvertCard customer={customer} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
