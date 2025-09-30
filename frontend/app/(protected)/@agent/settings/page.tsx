"use client";

import { Loader } from "@/components/common/Loader";
import { AddressInfo } from "@/components/page-components/settings/AddressInfo";
import { AgentInfoSettings } from "@/components/page-components/settings/AgentInfo";
import { PrivacyAndSecurity } from "@/components/page-components/settings/PrivacyAndSecurity";
import { ProfileInfo } from "@/components/page-components/settings/ProfileInfo";
import { Accordion } from "@/components/ui/accordion";
import { useAgentSettings } from "@/data/useAgentSetting";
import { useCustomerSettings } from "@/hooks/useCustomerSettings";
import { TAddress } from "@/types/address";
import { useTranslation } from "react-i18next";

export default function AccountSettings() {
  const { t } = useTranslation();
  const { data, user, address, isLoading, error } = useCustomerSettings();
  const { agent, isLoading: agentInfoLoading } = useAgentSettings();

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
    <Accordion
      type="multiple"
      defaultValue={[
        "PROFILE_INFORMATION",
        "AGENT_INFORMATION",
        "PASSWORD_INFORMATION",
        "ADDRESS_INFORMATION",
      ]}
    >
      <div className="flex flex-col gap-4">
        <ProfileInfo user={user(data)} isLoading={isLoading} error={error} />
        <AgentInfoSettings agent={agent} isLoading={agentInfoLoading} />
        <AddressInfo address={address(data) as TAddress} />
        <PrivacyAndSecurity />
      </div>
    </Accordion>
  );
}
