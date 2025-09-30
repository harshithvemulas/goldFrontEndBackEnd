"use client";

import { AddressInfo } from "@/components/page-components/settings/AddressInfo";
import { PrivacyAndSecurity } from "@/components/page-components/settings/PrivacyAndSecurity";
import { ProfileInfo } from "@/components/page-components/settings/ProfileInfo";
import { Accordion } from "@/components/ui/accordion";
import axios from "@/lib/axios";
import { Address } from "@/types/address";
import { User } from "@/types/user";
import useSWR from "swr";

export default function AccountSettings() {
  const { data, isLoading, error } = useSWR("/customers/detail", (url) =>
    axios.get(url),
  );

  const fetchData = data?.data;

  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "PROFILE_INFORMATION",
        "PASSWORD_INFORMATION",
        "ADDRESS_INFORMATION",
      ]}
    >
      <div className="flex flex-col gap-4">
        <ProfileInfo
          user={
            fetchData
              ? new User({
                  ...fetchData,
                  ...fetchData?.user,
                  address: fetchData?.address,
                  avatar: fetchData?.profileImage,
                })
              : null
          }
          isLoading={isLoading}
          error={error}
        />
        <AddressInfo address={new Address(fetchData?.address)} />
        <PrivacyAndSecurity />
      </div>
    </Accordion>
  );
}
