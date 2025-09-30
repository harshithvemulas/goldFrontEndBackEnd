"use client";

import { Loader } from "@/components/common/Loader";
import { MerchantProfile } from "@/components/page-components/settings/MerchantProfile";
import { Accordion } from "@/components/ui/accordion";
import { useMerchantSettings } from "@/hooks/useMerchantSettings";
import { useTranslation } from "react-i18next";

export default function MerchantSettings() {
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
    <Accordion type="multiple" defaultValue={["STORE_PROFILE"]}>
      <div className="flex flex-col gap-4">
        <MerchantProfile data={data} isLoading={isLoading} />
      </div>
    </Accordion>
  );
}
