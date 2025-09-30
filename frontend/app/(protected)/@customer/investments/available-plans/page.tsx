"use client";

import AvailableCard from "@/app/(protected)/@customer/investments/available-plans/_components/available-card";
import { Loader } from "@/components/common/Loader";
import { InvestmentPlan } from "@/data/investments/investmentPlan";
import { useSWR } from "@/hooks/useSWR";
import { Warning2 } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function AvailablePlans() {
  const { data, isLoading, mutate } = useSWR("/investment-plans");
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex h-32 w-full flex-col items-center justify-center gap-4">
          <Warning2 size="38" variant="Bulk" className="text-primary-400" />
          {t("No plans available!")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 pb-10">
      {data?.data.map((item: InvestmentPlan) => (
        <AvailableCard key={item.id} item={item} onMutate={mutate} />
      ))}
    </div>
  );
}
