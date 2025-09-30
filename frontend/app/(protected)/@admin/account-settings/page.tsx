"use client";

import { AddressInfo } from "@/components/page-components/settings/AddressInfo";
import { PrivacyAndSecurity } from "@/components/page-components/settings/PrivacyAndSecurity";
import { ProfileInfo } from "@/components/page-components/settings/ProfileInfo";
import { Accordion } from "@/components/ui/accordion";
import { useCustomerSettings } from "@/hooks/useCustomerSettings";
import type { TAddress } from "@/types/address";

export default function AccountSettings() {
  const { data, user, address, error, isLoading } = useCustomerSettings();

  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "PROFILE_INFORMATION",
        "ADDRESS_INFORMATION",
        "PASSWORD_INFORMATION",
      ]}
    >
      <div className="flex flex-col gap-4 p-4">
        <ProfileInfo user={user(data)} isLoading={isLoading} error={error} />
        <AddressInfo address={address(data) as TAddress} />
        <PrivacyAndSecurity />
      </div>
    </Accordion>
  );
}
