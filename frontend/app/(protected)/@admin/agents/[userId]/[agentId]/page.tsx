"use client";

/* eslint-disable no-nested-ternary */
import { Loader } from "@/components/common/Loader";
import { Accordion } from "@/components/ui/accordion";
import { useSWR } from "@/hooks/useSWR";
import cn from "@/lib/utils";
import {
  Flag as FlagIcon,
  Key,
  MedalStar,
  ShieldSearch,
  ShieldTick,
  TickCircle,
} from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AddressInfo } from "./_components/address-info";
import { AgentInfoSettings } from "./_components/agent-info";
import { AgentStatus } from "./_components/agent-status";
import BalanceInfo from "./_components/Balance";
import { CommissionCard } from "./_components/commisssion-card";
import { ProfileInfo } from "./_components/profile-info";
import { StatusCard } from "./_components/status-card";

export default function CustomerDetails() {
  const { t } = useTranslation();
  const params = useParams(); // get merchantId from params
  // fetch user by id
  const { data, isLoading, mutate } = useSWR(`/admin/agents/${params.agentId}`);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const agent = data?.data;

  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "ADDRESS_INFORMATION",
        "BALANCE",
        "PROFILE_INFORMATION",
        "ConvertAccountType",
        "AGENT_INFORMATION",
        "AgentStatus",
      ]}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid w-full grid-cols-12 gap-4">
          <CommissionCard />

          <StatusCard
            {...{
              title: t("Agent access"),
              icon: (props) => <Key {...props} />,
              status:
                agent?.status === "verified"
                  ? t("Granted")
                  : agent?.status === "failed"
                    ? t("Not Granted")
                    : t("Pending"),
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />
          <StatusCard
            {...{
              title: t("Account Status"),
              icon: (props) => <TickCircle {...props} variant="Outline" />,
              statusClass: agent?.user?.status ? "text-success" : "",
              status: agent?.user?.status ? t("Active") : t("Inactive"),
              iconClass: "bg-success/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("KYC Status"),
              icon: (props) =>
                agent?.user?.kycStatus ? (
                  <ShieldTick
                    className={cn(props.className, "text-success")}
                    {...props}
                  />
                ) : (
                  <ShieldSearch
                    className={cn(props.className, "text-primary")}
                    {...props}
                  />
                ),
              statusClass: agent?.user?.kycStatus
                ? "text-success"
                : "text-primary",
              status: agent?.user?.kycStatus
                ? t("Verified")
                : agent?.user?.kyc
                  ? t("Pending Verification")
                  : t("Not Submitted Yet"),
              iconClass: agent?.user?.kycStatus
                ? "bg-success/20"
                : "bg-primary/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Suspended"),
              icon: (props) => <FlagIcon {...props} />,
              statusClass: agent?.isSuspend ? "text-danger" : "",
              status: agent?.isSuspend ? t("Yes") : t("No"),
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />

          <StatusCard
            {...{
              title: t("Recommended"),
              icon: (props) => <MedalStar {...props} />,
              statusClass: "text-spacial-blue",
              status: agent?.isRecommended ? t("Yes") : t("No"),
              iconClass: "bg-important/20",
              className:
                "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3",
            }}
          />
        </div>

        <BalanceInfo
          wallets={agent?.user?.wallets}
          onMutate={() => mutate(data)}
        />
        <ProfileInfo
          isLoading={isLoading}
          customer={agent?.user}
          onMutate={() => mutate(data)}
        />
        <AgentInfoSettings agentInfo={agent} onMutate={() => mutate(data)} />
        <AddressInfo customer={agent?.user} onMutate={() => mutate(data)} />
        <AgentStatus
          id={agent?.userId}
          agentId={agent?.id}
          status={agent?.status}
          recommended={!!agent?.isRecommended}
          suspended={!!agent?.isSuspend}
          onMutate={() => mutate()}
        />
      </div>
    </Accordion>
  );
}
