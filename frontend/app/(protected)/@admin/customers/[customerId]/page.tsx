"use client";

import { Loader } from "@/components/common/Loader";
import { Accordion } from "@/components/ui/accordion";
import axios from "@/lib/axios";
import cn from "@/lib/utils";
import { ShieldSearch, TickCircle, UserSquare, Wallet2 } from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { AddressInfo } from "./_components/AddressInfo";
import { BalanceInfo } from "./_components/Balance";
import { ConvertAccountType } from "./_components/ConvertAccountType";
import { ProfileInfo } from "./_components/ProfileInfo";
import { StatusCard } from "./_components/StatusCard";

export default function CustomerDetails() {
  const params = useParams(); // get customerId from params
  const { t } = useTranslation();

  // fetch user by id
  const { data, isLoading, mutate } = useSWR(
    `/admin/customers/${params.customerId}`,
    (u: string) => axios(u),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const customer = data?.data;
  const wallet = customer?.user?.wallets?.find((w: any) => w.default);

  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "PROFILE_INFORMATION",
        "ADDRESS_INFORMATION",
        "BALANCE",
        "ConvertAccountType",
      ]}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid w-full grid-cols-12 gap-4">
          <StatusCard
            {...{
              title: t("Account Status"),
              icon: (props) => <TickCircle {...props} variant="Outline" />,
              statusClass: customer?.user?.status ? "text-success" : "",
              status: customer?.user?.status ? "Active" : "Inactive",
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
              status: customer?.user?.kycStatus
                ? t("Verified")
                : t("Pending Verification"),
              iconClass: "bg-primary/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Default Wallet"),
              icon: (props) => <Wallet2 {...props} />,
              statusClass: "text-spacial-blue",
              status: `${wallet?.balance} ${wallet?.currency?.code}`,
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Account type"),
              icon: (props) => <UserSquare {...props} />,
              statusClass: "text-spacial-blue",
              status: "Customer",
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />
        </div>

        <BalanceInfo
          wallets={customer?.user?.wallets}
          onMutate={() => mutate(data)}
        />
        <ProfileInfo
          isLoading={isLoading}
          customer={customer}
          onMutate={() => mutate(data)}
        />
        <AddressInfo customer={customer} onMutate={() => mutate(data)} />
        <ConvertAccountType customer={customer} />
      </div>
    </Accordion>
  );
}
