"use client";

import APIDocumentation from "@/app/(protected)/@merchant/settings/mpay-api/_components/api-documentation";
import APIPaymentSettings from "@/app/(protected)/@merchant/settings/mpay-api/_components/api-payment-settings";
import { Loader } from "@/components/common/Loader";
import { Accordion } from "@/components/ui/accordion";
import { useMerchantSettings } from "@/hooks/useMerchantSettings";
import { useTranslation } from "react-i18next";

export default function MPayAPI() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useMerchantSettings();

  if (!data && error) {
    return (
      <div className="w-full bg-danger py-2.5 text-danger-foreground">
        <p>
          {t(
            "We encountered an issue while retrieving the requested data. Please try again later or contact support if the problem persists.",
          )}
        </p>
      </div>
    );
  }

  if (!data && isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={["API_KEY", "API_DOCUMENTATION"]}>
      <div className="flex flex-col gap-4">
        <APIPaymentSettings data={data} />
        <APIDocumentation />
      </div>
    </Accordion>
  );
}
