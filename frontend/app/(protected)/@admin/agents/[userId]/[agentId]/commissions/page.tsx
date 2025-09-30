"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { paySettlement } from "@/data/admin/settlements";
import { useSWR } from "@/hooks/useSWR";
import { ArrowRight2 } from "iconsax-react";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { mutate as GlobalMutate } from "swr";
import { CommissionCard } from "../_components/commisssion-card";
import SettlementSettings from "./_components/settlement-settings";
import { SettlementTable } from "./_components/settlement-table";

export default function FeesAndCommissionsSettingsPage() {
  const params = useParams(); // get merchantId from params
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

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

  const payCommission = () => {
    startTransition(async () => {
      const res = await paySettlement(params.userId as string);
      if (res.status) {
        GlobalMutate(
          `/commissions/${params?.userId}?${searchParams.toString()}`,
        );
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={["FEES_COMMISSIONS_INFORMATION", "settlement_table"]}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-12 gap-4">
          <CommissionCard />

          <div className="col-span-6 flex items-end">
            <Button
              type="button"
              onClick={payCommission}
              disabled={isPending}
              className="rounded-lg"
            >
              <Case condition={isPending}>
                <Loader
                  title={t("Processing...")}
                  className="text-primary-foreground"
                />
              </Case>
              <Case condition={!isPending}>
                {t("Pay Commission")}
                <ArrowRight2 size={16} />
              </Case>
            </Button>
          </div>
        </div>
        <SettlementSettings
          data={{
            id: agent?.id as string,
            userId: agent?.userId as string,
            depositCharge: agent?.depositCharge,
            withdrawalCharge: agent?.withdrawalCharge,
            depositCommission: agent?.depositCommission,
            withdrawalCommission: agent?.withdrawalCommission,
          }}
          onMutate={() => mutate(data)}
        />

        <SettlementTable />
      </div>
    </Accordion>
  );
}
