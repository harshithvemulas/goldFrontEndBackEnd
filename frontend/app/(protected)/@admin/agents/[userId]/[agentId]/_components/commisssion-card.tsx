import { Case } from "@/components/common/Case";
import { useSWR } from "@/hooks/useSWR";
import { PercentageSquare } from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function CommissionCard() {
  const params = useParams();
  const { t } = useTranslation();

  // fetch total commission data
  const { data, isLoading } = useSWR(
    `/commissions/total-pending/${params.userId}`,
  );

  return (
    <div className="col-span-12 inline-flex items-center gap-4 rounded-xl bg-background px-6 py-3 shadow-default md:col-span-6">
      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-muted">
        <PercentageSquare variant="Bulk" size={34} />
      </div>
      <div className="flex flex-col gap-y-2">
        <Case condition={isLoading}>
          <h1>0.00</h1>
        </Case>
        <Case condition={!isLoading}>
          <h1>{`${data?.data?.total ?? "0.00"} ${data?.data?.currency}`}</h1>
        </Case>

        <span className="block text-xs font-normal leading-4">
          {t("Total Commission")}
        </span>
      </div>
    </div>
  );
}
