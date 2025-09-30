"use client";

import { Loader } from "@/components/common/Loader";
import FeesCommissionsSettings from "@/components/page-components/settings/FeesCommissionsSettings";
import { Accordion } from "@/components/ui/accordion";
import { useAgentSettings } from "@/data/useAgentSetting";
import { useTranslation } from "react-i18next";

export default function FeesAndCommissionsSettingsPage() {
  const { t } = useTranslation();
  const { agent, isLoading, error } = useAgentSettings();

  if (error) {
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

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={["FEES_COMMISSIONS_INFORMATION"]}>
      <div className="flex flex-col gap-4">
        <FeesCommissionsSettings data={agent} isLoading={isLoading} />
      </div>
    </Accordion>
  );
}
