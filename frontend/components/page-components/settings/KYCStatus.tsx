"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldSearch, ShieldTick } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function KYCStatus({
  fetchData,
  isLoading,
}: {
  fetchData: any;
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-background">
      <AccordionItem value="KYC_STATUS" className="border-none px-4 py-0">
        <AccordionTrigger className="py-6 hover:no-underline">
          <div className="flex items-center gap-1">
            <p className="text-base font-medium leading-[22px]">
              {t("KYC Status")}
            </p>
            <Case condition={fetchData?.status === "verified"}>
              <Badge className="h-5 bg-spacial-green text-[10px] text-spacial-green-foreground">
                {t("Verified")}
              </Badge>
            </Case>
            <Case condition={fetchData?.status === "pending"}>
              <Badge className="h-5 bg-primary text-[10px] text-primary-foreground">
                {t("Pending")}
              </Badge>
            </Case>

            <Case
              condition={
                !["pending", "verified", "failed"].includes(fetchData?.status)
              }
            >
              <Badge className="h-5 bg-foreground text-[10px] text-background">
                {t("Awaiting submission")}
              </Badge>
            </Case>
          </div>
        </AccordionTrigger>

        <Case condition={isLoading}>
          <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
            <Loader />
          </AccordionContent>
        </Case>
        <Case condition={!isLoading}>
          <AccordionContent className="flex flex-col gap-6 border-t border-divider px-1 pt-4">
            <Case condition={fetchData?.status === "verified"}>
              <Alert className="border-none bg-transparent shadow-default [&>svg]:text-spacial-green">
                <ShieldTick size="32" variant="Bulk" />
                <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                  {t("Your account is verified")}
                </AlertTitle>
                <AlertDescription className="ml-2.5 text-sm font-normal">
                  {t(
                    "Your account has been successfully verified. If you have any questions feel free to reach out to our support team.",
                  )}
                </AlertDescription>
              </Alert>
            </Case>
            <Case condition={fetchData?.status === "pending"}>
              {/* Pending alert type */}
              <Alert className="border-none bg-transparent shadow-default [&>svg]:text-primary">
                <ShieldSearch size="32" variant="Bulk" />
                <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                  {t("Pending verification")}
                </AlertTitle>
                <AlertDescription className="ml-2.5 text-sm font-normal">
                  {t(
                    "Thank you for submitting your documents! Your KYC verification is currently under review. Our team is working to process your submission as quickly as possible.",
                  )}
                </AlertDescription>
              </Alert>
            </Case>

            <Case
              condition={
                !["pending", "verified", "failed"].includes(fetchData?.status)
              }
            >
              {/* Awaiting alert type */}
              <Alert className="border-none bg-transparent shadow-default [&>svg]:text-foreground">
                <Shield size="32" variant="Bulk" />
                <AlertTitle className="ml-2.5 text-sm font-semibold leading-5">
                  {t("You have not submitted documents yet.")}
                </AlertTitle>
                <AlertDescription className="ml-2.5 text-sm font-normal">
                  {t(
                    "Your account is not yet verified. Please complete the KYC process by submitting the required documents.",
                  )}
                </AlertDescription>
              </Alert>
            </Case>
          </AccordionContent>
        </Case>
      </AccordionItem>
    </div>
  );
}
