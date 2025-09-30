import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Separator from "@/components/ui/separator";
import { InvestmentPlan } from "@/data/investments/investmentPlan";
import { startCase } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function InvestmentDetailsModal({
  item,
}: {
  item: InvestmentPlan;
}) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          {t("View details")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{item?.name}</DialogTitle>
        </DialogHeader>
        <div className="rounded-xl bg-secondary p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs">
                {startCase(item?.durationType)} {t("Profit")}
              </span>
              <p className="font-bold text-primary">{item?.interestRate}%</p>
            </div>
            <div className="text-right">
              <span className="text-xs">{t("Profit Adjust")}</span>
              <p className="font-bold text-primary">
                {startCase(item?.durationType)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs">
                {item?.isRange ? t("Min Amount") : t("Required Amount")}
              </span>
              <p className="font-bold text-primary">
                {item?.minAmount} {item?.currency?.toUpperCase()}
              </p>
            </div>
            {item?.isRange ? (
              <div className="text-right">
                <span className="text-xs">{t("Max Amount")}</span>
                <p className="font-bold text-primary">
                  {item?.maxAmount} {item?.currency?.toUpperCase()}
                </p>
              </div>
            ) : null}
          </div>
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
        <Separator className="border-b bg-transparent" />
        <div>
          <p className="mb-1 text-sm">{t("Description")}</p>

          <p className="text-sm text-gray-500">
            {item?.description || t("No description")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
