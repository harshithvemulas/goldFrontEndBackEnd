"use client";

import { Loader } from "@/components/common/Loader";
import { Accordion } from "@/components/ui/accordion";
import axios from "@/lib/axios";
import cn, { startCase } from "@/lib/utils";
import { Address } from "@/types/address";
import { Key, ShieldSearch, ShoppingCart, TickCircle } from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { AddressInfo } from "./_components/AddressInfo";
import { BalanceInfo } from "./_components/Balance";
import { MerchantAccessCard } from "./_components/MerchantAccessCard";
import { MerchantProfile } from "./_components/MerchantProfile";
import { ProfileInfo } from "./_components/ProfileInfo";
import { StatusCard } from "./_components/StatusCard";

export default function CustomerDetails() {
  const params = useParams(); // get merchantId from params
  const { t } = useTranslation();

  // fetch user by id
  const { data, isLoading, mutate } = useSWR(
    `/admin/merchants/${params.merchantId}`,
    (u: string) => axios(u),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const merchant = data?.data;

  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "STORE_PROFILE",
        "ConvertAccountType",
        "MerchantAccessCard",
      ]}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid w-full grid-cols-12 gap-4">
          <StatusCard
            {...{
              title: t("Account Status"),
              icon: (props) => <TickCircle {...props} variant="Outline" />,
              statusClass: merchant?.user?.status
                ? "text-success"
                : "text-danger",
              status: merchant?.user?.status ? t("Active") : t("Inactive"),
              iconClass: "bg-success/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("KYC Status"),
              icon: (props) => (
                <ShieldSearch
                  className={cn(props.className, "text-primary")}
                  {...props}
                />
              ),
              statusClass: "text-primary",
              status: merchant?.user?.kycStatus
                ? t("Verified")
                : t("Pending Verification"),
              iconClass: "bg-primary/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Merchant access"),
              icon: (props) => <Key {...props} />,
              statusClass: "text-spacial-blue",
              status: startCase(merchant?.status),
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Suspended"),
              icon: (props) => <Key {...props} />,
              statusClass: "text-spacial-blue",
              status: merchant?.isSuspend ? t("Yes") : t("No"),
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Account type"),
              icon: (props) => <ShoppingCart {...props} />,
              statusClass: "text-spacial-blue",
              status: t("Merchant"),
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />
        </div>

        <BalanceInfo
          wallets={merchant?.user?.wallets}
          onMutate={() => mutate(data)}
        />
        <ProfileInfo
          isLoading={isLoading}
          customer={merchant?.user}
          onMutate={() => mutate(data)}
        />
        <AddressInfo customer={merchant?.user} onMutate={() => mutate(data)} />
        <MerchantProfile
          merchant={{
            id: merchant?.id,
            userId: merchant?.userId,
            storeImage: merchant?.storeProfileImage,
            name: merchant?.name,
            email: merchant?.email,
            merchantId: merchant?.merchantId,
            address: new Address(merchant?.address),
          }}
          isLoading={isLoading}
          onMutate={() => mutate(data)}
        />
        <MerchantAccessCard
          customer={{
            id: merchant?.id,
            isSuspended: merchant?.isSuspend,
            status: merchant?.status,
          }}
          onMutate={() => mutate(data)}
        />
      </div>
    </Accordion>
  );
}
