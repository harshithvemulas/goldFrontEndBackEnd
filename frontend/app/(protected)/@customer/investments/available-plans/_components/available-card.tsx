import InvestmentDetailsModal from "@/app/(protected)/@customer/investments/_components/investment-details-modal";
import InvestNowModal from "@/app/(protected)/@customer/investments/available-plans/_components/invest-now-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Separator from "@/components/ui/separator";
import { InvestmentPlan } from "@/data/investments/investmentPlan";
import { startCase } from "@/lib/utils";
import { ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function AvailableCard({
  isAdmin = false,
  item,
  onMutate,
}: {
  isAdmin?: boolean;
  item: InvestmentPlan;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Card
      key={item?.id}
      className={`w-[350px] overflow-hidden rounded-xl border-2 shadow-featured ${item.isFeatured ? "border-primary" : "border-transparent"}`}
    >
      <CardContent className="space-y-4 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">{item?.name}</p>
          {item?.isFeatured ? (
            <Badge variant="success">{t("Featured")}</Badge>
          ) : null}
        </div>
        <Separator className="border-b bg-transparent" />
        <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
          <div>
            <span className="text-xs">
              {startCase(item?.durationType)} {t("Profit")}
            </span>
            <p className="font-bold text-primary">{item?.interestRate}%</p>
          </div>
          <div className="text-right">
            <span className="text-xs">{t("Duration")}</span>
            <p className="font-bold text-primary">
              {item?.duration} {item?.duration > 1 ? t("Days") : t("Day")}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-xs">
              {item?.isRange ? t("Min Amount") : t("Required Amount")}
            </span>
            <p className="text-sm font-semibold">
              {item?.minAmount} {item?.currency?.toUpperCase()}
            </p>
          </div>
          {item?.isRange ? (
            <div className="text-right">
              <span className="text-xs">{t("Max Amount")}</span>
              <p className="text-sm font-semibold">
                {item?.maxAmount} {item?.currency?.toUpperCase()}
              </p>
            </div>
          ) : null}
        </div>
        <Separator className="border-b bg-transparent" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">{t("Profit Adjust")}</span>
            <span className="text-sm font-semibold">
              {startCase(item?.durationType)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t("Withdraw After Matured")}</span>
            <span className="text-sm font-semibold">
              {item?.withdrawAfterMatured ? t("Yes") : t("No")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t("Type")}</span>
            <span className="text-sm font-semibold">
              {item?.isRange ? t("Range") : t("Fixed")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4">
        {isAdmin ? (
          <Button
            type="button"
            onClick={() => router.push(`/investments/edit-plan/${item?.id}`)}
            variant="default"
            className="w-full"
          >
            {t("Edit plan")}
            <ArrowRight2 size={20} />
          </Button>
        ) : (
          <InvestNowModal item={item} onMutate={onMutate} />
        )}

        <InvestmentDetailsModal item={item} />
      </CardFooter>
    </Card>
  );
}
