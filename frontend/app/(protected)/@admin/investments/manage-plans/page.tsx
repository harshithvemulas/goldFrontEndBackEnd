"use client";

import AvailableCard from "@/app/(protected)/@customer/investments/available-plans/_components/available-card";
import { Loader } from "@/components/common/Loader";
import { InvestmentPlan } from "@/data/investments/investmentPlan";
import { useSWR } from "@/hooks/useSWR";

export default function ManagePlans() {
  const { data, isLoading, mutate } = useSWR("/admin/investment-plans");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {data?.data.map((item: InvestmentPlan) => (
        <AvailableCard isAdmin key={item.id} item={item} onMutate={mutate} />
      ))}
    </div>
  );
}
