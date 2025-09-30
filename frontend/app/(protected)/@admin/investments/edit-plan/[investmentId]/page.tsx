"use client";

import EditPlanForm from "@/app/(protected)/@admin/investments/edit-plan/[investmentId]/_components/edit-plan-form";
import { Loader } from "@/components/common/Loader";
import { useSWR } from "@/hooks/useSWR";
import { useParams } from "next/navigation";

export default function EditPlan() {
  const params = useParams();

  const { data, isLoading } = useSWR(
    `/admin/investment-plans/${params.investmentId}`,
  );

  const formData = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-157px)] overflow-y-auto bg-background p-4">
      <EditPlanForm formData={formData} />
    </div>
  );
}
